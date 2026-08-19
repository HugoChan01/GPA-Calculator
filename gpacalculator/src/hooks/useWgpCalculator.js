import { useState, useCallback } from 'react';
import { calculateWGPA as calculateWGPAUtil } from '../utils/wgpaCalculator';

const DEFAULT_COURSE = {
    courseCode: '',
    courseName: '',
    grade: 'A',
    credits: 5,
    level: 'Higher'
};

/**
 * Custom hook for managing WGPA calculator state and operations
 */
export const useWgpCalculator = () => {
    const [programmeType, setProgrammeType] = useState('single');
    const [groupAWeight, setGroupAWeight] = useState(1);
    const [groupBWeight, setGroupBWeight] = useState(1);
    const [courses, setCourses] = useState([
        { id: 1, ...DEFAULT_COURSE }
    ]);
    const [result, setResult] = useState(null);

    // Generate unique ID for new courses
    const generateId = useCallback((existingCourses) => {
        if (existingCourses.length === 0) return 1;
        return Math.max(...existingCourses.map(c => c.id)) + 1;
    }, []);

    // Add a new course row
    const addCourse = useCallback(() => {
        setCourses(prev => {
            const newId = generateId(prev);
            return [...prev, { id: newId, ...DEFAULT_COURSE }];
        });
    }, [generateId]);

    // Remove a course row
    const removeCourse = useCallback((id) => {
        setCourses(prev => {
            if (prev.length > 1) {
                return prev.filter(course => course.id !== id);
            }
            return prev; // Keep at least one course
        });
    }, []);

    // Update a course field
    const updateCourse = useCallback((id, field, value) => {
        setCourses(prev => prev.map(course =>
            course.id === id ? { ...course, [field]: value } : course
        ));
    }, []);

    // Calculate WGPA
    const calculateWGPA = useCallback(() => {
        const calculationResult = calculateWGPAUtil(
            courses,
            programmeType,
            groupAWeight,
            groupBWeight
        );
        setResult(calculationResult);
    }, [courses, programmeType, groupAWeight, groupBWeight]);

    // Reset all state to initial values
    const reset = useCallback(() => {
        setProgrammeType('single');
        setGroupAWeight(1);
        setGroupBWeight(1);
        setCourses([{ id: 1, ...DEFAULT_COURSE }]);
        setResult(null);
    }, []);

    return {
        programmeType,
        setProgrammeType,
        groupAWeight,
        setGroupAWeight,
        groupBWeight,
        setGroupBWeight,
        courses,
        addCourse,
        removeCourse,
        updateCourse,
        result,
        calculateWGPA,
        reset
    };
};
