
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
    const normalized = input.toLowerCase().trim()
    const day = DAYS.find(d => d.toLowerCase() === normalized)
    return day || null
}

// Parse table format: | Gün | Ders | Kazanımlar | Süre (dk) |
function parseTableFormat(content: string): WeeklyPlan {
    const lines = content.split('\n')
    const plan: WeeklyPlan = {}

    // Initialize empty days
    DAYS.forEach(day => plan[day] = [])

    // Find header row and determine column indices
    let headerIndex = -1
    let columnIndices: { day: number; subject: number; outcomes: number; duration: number } | null = null

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim()
        if (line.startsWith('|') && line.includes('Gün')) {
            headerIndex = i
            const columns = line.split('|').map(c => c.trim().toLowerCase())

            columnIndices = {
                day: columns.findIndex(c => c.includes('gün')),
                subject: columns.findIndex(c => c.includes('ders')),
                outcomes: columns.findIndex(c => c.includes('kazanım')),
                duration: columns.findIndex(c => c.includes('süre'))
            }
            break
        }
    }

    if (headerIndex === -1 || !columnIndices) {
        return plan // No table header found, return empty plan
    }

    // Parse data rows (skip header and separator row)
    for (let i = headerIndex + 1; i < lines.length; i++) {
        const line = lines[i].trim()

        // Skip separator rows (e.g., |---|---|---|---|)
        if (!line.startsWith('|') || line.includes('---')) continue

        const columns = line.split('|').map(c => c.trim())

        if (columns.length < 4) continue

        const dayValue = columns[columnIndices.day] || ''
        const subjectValue = columns[columnIndices.subject] || ''
        const outcomesValue = columns[columnIndices.outcomes] || ''
        const durationValue = columns[columnIndices.duration] || ''

        const day = matchDay(dayValue)
        if (!day) continue

        const subject = matchSubject(subjectValue)
        const duration = parseInt(durationValue) || 40
        const outcomes = outcomesValue ? [outcomesValue] : []

        // Add lesson to the day (max 5 per day)
        if (plan[day].length < 5) {
            plan[day].push({
                subject,
                classLevel: "7", // Default to 7 based on user's data
                duration,
                outcomes
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

            // Limit to 5 lessons per day as per UI constraint
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

        // Check for Day Header (e.g., # Pazartesi)
        if (line.startsWith('# ')) {
            saveCurrentLesson()

            const dayName = line.replace('#', '').trim()
            const validDay = DAYS.find(d => d.toLowerCase() === dayName.toLowerCase())
            if (validDay) {
                currentDay = validDay
            } else {
                currentDay = null
            }
            continue
        }

        // Check for Lesson Header (e.g., ## Ders 1)
        if (line.startsWith('##')) {
            saveCurrentLesson()
            if (currentDay) {
                currentLesson = {}
            }
            continue
        }

        // Parse Fields
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
    // Check if content contains table format indicators
    if (content.includes('|') && (content.includes('Gün') || content.includes('gün'))) {
        return parseTableFormat(content)
    }

    // Default to list format
    return parseListFormat(content)
}
