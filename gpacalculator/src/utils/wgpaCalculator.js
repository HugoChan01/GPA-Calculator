import { GRADE_POINTS, HONOURS_CLASSIFICATION, EXCLUDED_GRADES } from '../constants/gradeConfig';

/**
 * Select best courses for a group based on grade points
 * @param {Array} courses - Array of course objects
 * @param {number} requiredCredits - Target credits to accumulate
 * @param {Set} excludedCourseIds - Course IDs to exclude (already used)
 * @returns {Object} { selectedCourses, totalCredits }
 */
export const selectBestCourses = (courses, requiredCredits, excludedCourseIds = new Set()) => {
    const sortedCourses = [...courses]
        .filter(c => !excludedCourseIds.has(c.id))
        .filter(c => GRADE_POINTS[c.grade] !== null && !EXCLUDED_GRADES.includes(c.grade))
        .sort((a, b) => GRADE_POINTS[b.grade] - GRADE_POINTS[a.grade]);

    const selectedCourses = [];
    let accumulatedCredits = 0;

    for (const course of sortedCourses) {
        if (accumulatedCredits >= requiredCredits) break;

        const remainingNeeded = requiredCredits - accumulatedCredits;
        
        // Include course if it fits or is close enough (within 2 credits tolerance)
        if (course.credits <= remainingNeeded || course.credits <= remainingNeeded + 2) {
            selectedCourses.push(course);
            accumulatedCredits += course.credits;
        }
    }

    return {
        selectedCourses,
        totalCredits: accumulatedCredits
    };
};

/**
 * Calculate WGPA based on programme configuration
 * @param {Array} courses - All course objects
 * @param {string} programmeType - 'single' or 'double'
 * @param {number} groupAWeight - Weight for Group A
 * @param {number} groupBWeight - Weight for Group B
 * @returns {Object} Calculation result with wgpa, classification, and details
 */
export const calculateWGPA = (courses, programmeType, groupAWeight, groupBWeight) => {
    // Separate courses by level
    const higherLevelCourses = courses.filter(c => c.level === 'Higher');
    const middleLevelCourses = courses.filter(c => c.level === 'Middle');

    // Get programme requirements
    const config = programmeType === 'double' 
        ? { groupACredits: 60, groupBCredits: 60 }
        : { groupACredits: 40, groupBCredits: 40 };

    // Select Group A: Best credits from Higher level courses
    const { selectedCourses: groupACourses, totalCredits: actualGroupACredits } = 
        selectBestCourses(higherLevelCourses, config.groupACredits);

    // Get course IDs already used in Group A
    const groupACourseIds = new Set(groupACourses.map(c => c.id));

    // Select Group B: Best remaining credits from Higher or Middle level
    const remainingCourses = [...higherLevelCourses, ...middleLevelCourses];
    const { selectedCourses: groupBCourses, totalCredits: actualGroupBCredits } = 
        selectBestCourses(remainingCourses, config.groupBCredits, groupACourseIds);

    // Validate credit requirements
    if (actualGroupACredits < config.groupACredits || actualGroupBCredits < config.groupBCredits) {
        return {
            error: `Insufficient credits. Need ${config.groupACredits} Group A and ${config.groupBCredits} Group B credits. Got ${actualGroupACredits} Group A and ${actualGroupBCredits} Group B.`,
            wgpa: null,
            classification: null
        };
    }

    // Calculate weighted grade points (only for courses with valid grade points)
    const sumGP_GroupA = groupACourses.reduce((sum, c) => {
        const gradePoint = GRADE_POINTS[c.grade];
        return sum + (gradePoint !== null ? gradePoint * c.credits : 0);
    }, 0);
    
    const sumGP_GroupB = groupBCourses.reduce((sum, c) => {
        const gradePoint = GRADE_POINTS[c.grade];
        return sum + (gradePoint !== null ? gradePoint * c.credits : 0);
    }, 0);

    // Apply weights
    const weightedSumGP = (sumGP_GroupA * groupAWeight) + (sumGP_GroupB * groupBWeight);
    const weightedSumCredits = (actualGroupACredits * groupAWeight) + (actualGroupBCredits * groupBWeight);

    // Calculate WGPA with proper error handling for division by zero
    let wgpa = 0;
    if (weightedSumCredits > 0) {
        wgpa = weightedSumGP / weightedSumCredits;
    } else {
        return {
            error: 'Unable to calculate WGPA: No valid credits found.',
            wgpa: null,
            classification: null
        };
    }

    // Determine honours classification with proper floating-point comparison
    let classification = 'No Honours';
    const wgpaRounded = Math.round(wgpa * 100) / 100; // Round to 2 decimal places for comparison
    for (const cls of HONOURS_CLASSIFICATION) {
        if (wgpaRounded >= cls.min && wgpaRounded <= cls.max) {
            classification = cls.name;
            break;
        }
    }

    return {
        error: null,
        wgpa: wgpaRounded.toFixed(2),
        classification,
        groupACourses,
        groupBCourses,
        actualGroupACredits,
        actualGroupBCredits,
        groupAWeight,
        groupBWeight
    };
};
