/**
 * Grade to Grade Point mapping
 * Based on official course assessment standards (Section 8.2)
 */
export const GRADE_POINTS = {
    'A': 4.0,
    'A-': 3.7,
    'B+': 3.3,
    'B': 3.0,
    'B-': 2.7,
    'C+': 2.3,
    'C': 2.0,
    'Fail': 0.0,
    // Non-grade point statuses (for tracking only, excluded from GPA calculation)
    'Fail-resit': null,
    'Pass': null,
    'W': null
};

/**
 * Grades that should be excluded from GPA calculation
 */
export const EXCLUDED_GRADES = ['Fail-resit', 'Pass', 'W'];

/**
 * Honours classification thresholds
 */
export const HONOURS_CLASSIFICATION = [
    { name: 'First Class', min: 3.50, max: 4.00 },
    { name: 'Second Class (Upper Division)', min: 3.00, max: 3.49 },
    { name: 'Second Class (Lower Division)', min: 2.50, max: 2.99 },
    { name: 'Third Class', min: 2.00, max: 2.49 },
    { name: 'No Honours', min: 0.00, max: 1.99 }
];

/**
 * Programme configuration
 */
export const PROGRAMME_CONFIG = {
    single: {
        label: 'Single Degree (80 credits)',
        totalCredits: 80,
        groupACredits: 40,
        groupBCredits: 40
    },
    double: {
        label: 'Double Degree (120 credits)',
        totalCredits: 120,
        groupACredits: 60,
        groupBCredits: 60
    }
};

/**
 * Available credit options for courses
 */
export const CREDIT_OPTIONS = [3, 5, 10];

/**
 * Course levels
 */
export const COURSE_LEVELS = ['Higher', 'Middle'];
