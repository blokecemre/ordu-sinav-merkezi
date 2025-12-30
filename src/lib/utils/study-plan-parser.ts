
import { SUBJECTS, GRADES } from "@/lib/constants/curriculum-index"

export type ParsedLesson = {
    subject: string
    classLevel: string
    duration: number
    outcomes: string[]
}

export type WeeklyPlan = {
    [key: string]: ParsedLesson[]
}

const DAYS = [
    "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"
]

// Normalize subjects for matching (remove spaces, lowercase)
const normalizedSubjects = SUBJECTS.map(s => ({ original: s, normalized: s.toLowerCase().replace(/\s/g, '') }))

function matchSubject(input: string): string {
    const normalized = input.toLowerCase().replace(/\s/g, '')
    const match = normalizedSubjects.find(s => s.normalized === normalized)
    return match ? match.original : input
}

function matchDay(input: string): string | null {
    // Strip markdown bold/italic formatting: **text**, *text*, __text__, _text_
    const cleanInput = input.replace(/\*\*/g, '').replace(/\*/g, '').replace(/__/g, '').replace(/_/g, '').toLowerCase().trim()
    const day = DAYS.find(d => d.toLowerCase() === cleanInput)
    return day || null
}

// Extract class level from outcome code (e.g., MAT.6.1.1 -> "6", FB.7.2.1 -> "7", T.O.6.1 -> "6")
function extractClassLevel(outcomeCode: string): string {
    // Pattern matches: letter(s).number or letter(s).letter(s).number
    // Examples: MAT.6, FB.6, T.O.6, DKAB.6, M.6, SB.6
    const patterns = [
        /^[A-Za-z]+\.([5-8])\./,           // MAT.6. FB.7. M.6.
        /^[A-Za-z]+\.[A-Za-z]+\.([5-8])\./  // T.O.6. DKAB.6.
    ]

    for (const pattern of patterns) {
        const match = outcomeCode.match(pattern)
        if (match && match[1]) {
            console.log("[Parser] Extracted class level:", match[1], "from", outcomeCode)
            return match[1]
        }
    }

    // Fallback: look for any digit 5-8 in the string
    const fallbackMatch = outcomeCode.match(/[^0-9]([5-8])[^0-9]/)
    if (fallbackMatch && fallbackMatch[1]) {
        console.log("[Parser] Fallback class level:", fallbackMatch[1], "from", outcomeCode)
        return fallbackMatch[1]
    }

    console.log("[Parser] Could not extract class level from:", outcomeCode, "defaulting to 7")
    return "7" // Default if no match found
}

// Parse table format: | Gün | Ders | Kazanımlar | Süre (dk) |
// Also supports tables without leading |
function parseTableFormat(content: string): WeeklyPlan {
    const lines = content.split('\n')
    const plan: WeeklyPlan = {}

    // Initialize empty days
    DAYS.forEach(day => plan[day] = [])

    console.log("[Parser] Trying table format, lines:", lines.length)

    // Find header row and determine column indices
    let headerIndex = -1
    let columnIndices: { day: number; subject: number; outcomes: number; duration: number } | null = null

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim()

        // Check for table header - either starts with | or contains | and has Gün
        if (line.includes('|') && (line.toLowerCase().includes('gün') || line.toLowerCase().includes('gun'))) {
            headerIndex = i
            const columns = line.split('|').map(c => c.trim().toLowerCase())

            console.log("[Parser] Found header at line", i, "columns:", columns)

            columnIndices = {
                day: columns.findIndex(c => c.includes('gün') || c.includes('gun')),
                subject: columns.findIndex(c => c.includes('ders')),
                outcomes: columns.findIndex(c => c.includes('kazanım') || c.includes('kazanim')),
                duration: columns.findIndex(c => c.includes('süre') || c.includes('sure'))
            }
            console.log("[Parser] Column indices:", columnIndices)
            break
        }
    }

    if (headerIndex === -1 || !columnIndices) {
        console.log("[Parser] No table header found")
        return plan
    }

    // Parse data rows (skip header and separator row)
    for (let i = headerIndex + 1; i < lines.length; i++) {
        const line = lines[i].trim()

        // Skip empty lines and separator rows (e.g., |---|---|---|---|)
        if (!line || line.includes('---') || !line.includes('|')) continue

        const columns = line.split('|').map(c => c.trim())

        // Skip if not enough columns
        if (columns.filter(c => c.length > 0).length < 3) continue

        const dayValue = columns[columnIndices.day] || ''
        const subjectValue = columns[columnIndices.subject] || ''
        const outcomesValue = columns[columnIndices.outcomes] || ''
        const durationValue = columns[columnIndices.duration] || ''

        const day = matchDay(dayValue)
        if (!day) {
            console.log("[Parser] Invalid day:", dayValue)
            continue
        }

        const subject = matchSubject(subjectValue)
        const duration = parseInt(durationValue) || 40
        const outcomes = outcomesValue ? [outcomesValue] : []

        console.log("[Parser] Adding lesson:", day, subject, duration)

        // Extract class level from the outcome code
        const classLevel = extractClassLevel(outcomesValue)

        // Add lesson to the day (max 5 per day)
        if (plan[day].length < 5) {
            plan[day].push({
                subject,
                classLevel,
                duration,
                outcomes
            })
        }
    }

    return plan
}

// Parse simple row format: each row is "Day Subject Outcome Duration"
// This handles cases where file is tab/space separated
function parseSimpleFormat(content: string): WeeklyPlan {
    const lines = content.split('\n')
    const plan: WeeklyPlan = {}

    // Initialize empty days
    DAYS.forEach(day => plan[day] = [])

    console.log("[Parser] Trying simple format")

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim()
        if (!line) continue

        // Check if line starts with a day name
        const dayMatch = DAYS.find(d => line.toLowerCase().startsWith(d.toLowerCase()))
        if (!dayMatch) continue

        // Try to extract subject after day name
        const afterDay = line.substring(dayMatch.length).trim()

        // Try to find a known subject
        let foundSubject = ''
        for (const subj of SUBJECTS) {
            if (afterDay.toLowerCase().includes(subj.toLowerCase())) {
                foundSubject = subj
                break
            }
        }

        if (!foundSubject) continue

        // Extract remaining as outcome
        const afterSubject = afterDay.replace(new RegExp(foundSubject, 'i'), '').trim()

        // Try to find duration (number followed by optional 'dk' or just a number at end)
        const durationMatch = afterSubject.match(/(\d+)\s*(dk)?/i)
        const duration = durationMatch ? parseInt(durationMatch[1]) : 40

        const outcome = afterSubject.replace(/\d+\s*(dk)?/i, '').trim()

        console.log("[Parser] Simple format found:", dayMatch, foundSubject, duration)

        if (plan[dayMatch].length < 5) {
            plan[dayMatch].push({
                subject: foundSubject,
                classLevel: "7",
                duration,
                outcomes: outcome ? [outcome] : []
            })
        }
    }

    return plan
}

// Parse list format: # Pazartesi, ## Ders 1, - Ders: Matematik, etc.
function parseListFormat(content: string): WeeklyPlan {
    const lines = content.split('\n')
    const plan: WeeklyPlan = {}

    let currentDay: string | null = null
    let currentLesson: Partial<ParsedLesson> | null = null
    let currentOutcomes: string[] = []
    let inOutcomes = false

    const saveCurrentLesson = () => {
        if (currentDay && currentLesson && currentLesson.subject) {
            if (!plan[currentDay]) {
                plan[currentDay] = []
            }

            if (plan[currentDay].length < 5) {
                plan[currentDay].push({
                    subject: currentLesson.subject,
                    classLevel: currentLesson.classLevel || "8",
                    duration: currentLesson.duration || 40,
                    outcomes: [...currentOutcomes]
                })
            }
        }
        currentLesson = null
        currentOutcomes = []
        inOutcomes = false
    }

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim()

        if (!line) continue

        if (line.startsWith('# ')) {
            saveCurrentLesson()
            const dayName = line.replace('#', '').trim()
            const validDay = DAYS.find(d => d.toLowerCase() === dayName.toLowerCase())
            currentDay = validDay || null
            continue
        }

        if (line.startsWith('##')) {
            saveCurrentLesson()
            if (currentDay) {
                currentLesson = {}
            }
            continue
        }

        if (currentDay) {
            if (!currentLesson) {
                currentLesson = {}
            }

            if (line.startsWith('- Ders:')) {
                const subjectVal = line.replace('- Ders:', '').trim()
                currentLesson.subject = matchSubject(subjectVal)
                inOutcomes = false
            } else if (line.startsWith('- Sınıf:')) {
                const classVal = line.replace('- Sınıf:', '').trim()
                if (GRADES.includes(classVal)) {
                    currentLesson.classLevel = classVal
                }
                inOutcomes = false
            } else if (line.startsWith('- Süre:')) {
                const durationVal = parseInt(line.replace('- Süre:', '').trim())
                if (!isNaN(durationVal)) {
                    currentLesson.duration = durationVal
                }
                inOutcomes = false
            } else if (line.startsWith('- Kazanımlar:')) {
                inOutcomes = true
                continue
            } else if (inOutcomes && line.startsWith('-')) {
                const outcome = line.replace('-', '').trim()
                if (outcome) {
                    currentOutcomes.push(outcome)
                }
            }
        }
    }

    saveCurrentLesson()
    return plan
}

// Detect format and parse accordingly
export function parseStudyPlanMarkdown(content: string): WeeklyPlan {
    console.log("[Parser] Starting parse, content length:", content.length)
    console.log("[Parser] First 300 chars:", content.substring(0, 300))

    // Try table format first (has | characters)
    if (content.includes('|')) {
        console.log("[Parser] Detected table format (has | character)")
        const result = parseTableFormat(content)
        const totalLessons = Object.values(result).reduce((sum, arr) => sum + arr.length, 0)
        if (totalLessons > 0) {
            console.log("[Parser] Table format succeeded, lessons:", totalLessons)
            return result
        }
        console.log("[Parser] Table format returned 0 lessons, trying other formats")
    }

    // Try list format (has # headers)
    if (content.includes('# ')) {
        console.log("[Parser] Detected list format (has # headers)")
        const result = parseListFormat(content)
        const totalLessons = Object.values(result).reduce((sum, arr) => sum + arr.length, 0)
        if (totalLessons > 0) {
            console.log("[Parser] List format succeeded, lessons:", totalLessons)
            return result
        }
        console.log("[Parser] List format returned 0 lessons, trying simple format")
    }

    // Try simple row format as fallback
    console.log("[Parser] Trying simple row format as fallback")
    const result = parseSimpleFormat(content)
    console.log("[Parser] Simple format result, lessons:", Object.values(result).reduce((sum, arr) => sum + arr.length, 0))
    return result
}
