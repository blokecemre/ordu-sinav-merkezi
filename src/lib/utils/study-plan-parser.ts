
import { SUBJECTS, GRADES } from "../constants/curriculum-index"

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

export function parseStudyPlanMarkdown(content: string): WeeklyPlan {
    const lines = content.split('\n')
    const plan: WeeklyPlan = {}

    let currentDay: string | null = null
    let currentLesson: Partial<ParsedLesson> | null = null
    let currentOutcomes: string[] = []
    let inOutcomes = false

    // Normalize subjects for matching (remove spaces, lowercase)
    const normalizedSubjects = SUBJECTS.map(s => ({ original: s, normalized: s.toLowerCase().replace(/\s/g, '') }))

    const saveCurrentLesson = () => {
        if (currentDay && currentLesson && currentLesson.subject) {
            if (!plan[currentDay]) {
                plan[currentDay] = []
            }

            // Limit to 5 lessons per day as per UI constraint
            if (plan[currentDay].length < 5) {
                plan[currentDay].push({
                    subject: currentLesson.subject,
                    classLevel: currentLesson.classLevel || "8", // Default to 8 if missing
                    duration: currentLesson.duration || 40,      // Default to 40 if missing
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
            // Save previous lesson if exists
            saveCurrentLesson()

            const dayName = line.replace('#', '').trim()
            // Validate day name
            const validDay = DAYS.find(d => d.toLowerCase() === dayName.toLowerCase())
            if (validDay) {
                currentDay = validDay
            } else {
                currentDay = null // Reset if invalid day
            }
            continue
        }

        // Check for Lesson Header (e.g., ## Ders 1 or ## Matematik)
        // Actually, we can just treat any '##' as a new lesson separator if we are inside a day
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
                // If we encounter fields but no lesson header, assume implicit new lesson
                currentLesson = {}
            }

            if (line.startsWith('- Ders:')) {
                const subjectVal = line.replace('- Ders:', '').trim()
                // basic fuzzy match
                const match = normalizedSubjects.find(s => s.normalized === subjectVal.toLowerCase().replace(/\s/g, ''))
                if (match) {
                    currentLesson.subject = match.original
                } else {
                    currentLesson.subject = subjectVal // keeping original if no match found, though specific validation might be better
                }
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

    // Save list item
    saveCurrentLesson()

    return plan
}
