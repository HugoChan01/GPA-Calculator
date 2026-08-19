import React, { useState } from 'react'
import '../App.css';

// Grade to Grade Point mapping
const GRADE_POINTS = {
    'A': 4.0,
    'A-': 3.7,
    'B+': 3.3,
    'B': 3.0,
    'B-': 2.7,
    'C+': 2.3,
    'C': 2.0,
    'F': 0.0
};

// Honours classification thresholds
const HONOURS_CLASSIFICATION = [
    { name: 'First Class', min: 3.50, max: 4.00 },
    { name: 'Second Class (Upper Division)', min: 3.00, max: 3.49 },
    { name: 'Second Class (Lower Division)', min: 2.50, max: 2.99 },
    { name: 'Third Class', min: 2.00, max: 2.49 },
    { name: 'No Honours', min: 0.00, max: 1.99 }
];

function Layout() {
    const [programmeType, setProgrammeType] = useState('single'); // 'single' or 'double'
    const [groupAWeight, setGroupAWeight] = useState(1);
    const [groupBWeight, setGroupBWeight] = useState(1);
    const [courses, setCourses] = useState([
        { id: 1, courseCode: '', courseName: '', grade: 'A', credits: 5, level: 'Higher' }
    ]);
    const [result, setResult] = useState(null);

    // Add a new course row
    const addCourse = () => {
        const newId = courses.length > 0 ? Math.max(...courses.map(c => c.id)) + 1 : 1;
        setCourses([...courses, { 
            id: newId, 
            courseCode: '', 
            courseName: '', 
            grade: 'A', 
            credits: 5, 
            level: 'Higher' 
        }]);
    };

    // Remove a course row
    const removeCourse = (id) => {
        if (courses.length > 1) {
            setCourses(courses.filter(course => course.id !== id));
        }
    };

    // Update a course field
    const updateCourse = (id, field, value) => {
        setCourses(courses.map(course => 
            course.id === id ? { ...course, [field]: value } : course
        ));
    };

    // Calculate WGPA according to the honours classification rules
    const calculateWGPA = (event) => {
        event.preventDefault();

        // Separate courses by level
        const higherLevelCourses = courses.filter(c => c.level === 'Higher');
        const middleLevelCourses = courses.filter(c => c.level === 'Middle');

        // Sort Higher level courses by grade point (descending) for Group A selection
        const sortedHigherCourses = [...higherLevelCourses].sort((a, b) => 
            GRADE_POINTS[b.grade] - GRADE_POINTS[a.grade]
        );

        // Determine required credits based on programme type
        const isDoubleDegree = programmeType === 'double';
        const totalRequiredCredits = isDoubleDegree ? 120 : 80;
        const groupARequiredCredits = isDoubleDegree ? 60 : 40;
        const groupBRequiredCredits = isDoubleDegree ? 60 : 40;

        // Select Group A: Best credits from Higher level courses
        let groupACourses = [];
        let groupACreditsAccumulated = 0;
        
        for (const course of sortedHigherCourses) {
            if (groupACreditsAccumulated >= groupARequiredCredits) break;
            
            const remainingNeeded = groupARequiredCredits - groupACreditsAccumulated;
            if (remainingNeeded >= course.credits) {
                groupACourses.push(course);
                groupACreditsAccumulated += course.credits;
            } else if (remainingNeeded > 0) {
                // Partial credit not typically allowed, skip if doesn't fit exactly
                // For simplicity, we'll include it if it's close or skip
                // In real scenario, you might need more complex logic
                if (course.credits <= remainingNeeded + 2) { // Allow small overflow
                    groupACourses.push(course);
                    groupACreditsAccumulated += course.credits;
                }
            }
        }

        // Get course IDs already used in Group A
        const groupACourseIds = new Set(groupACourses.map(c => c.id));

        // Select Group B: Best remaining credits from Higher or Middle level
        const remainingCourses = [...higherLevelCourses, ...middleLevelCourses]
            .filter(c => !groupACourseIds.has(c.id))
            .sort((a, b) => GRADE_POINTS[b.grade] - GRADE_POINTS[a.grade]);

        let groupBCourses = [];
        let groupBCreditsAccumulated = 0;

        for (const course of remainingCourses) {
            if (groupBCreditsAccumulated >= groupBRequiredCredits) break;
            
            const remainingNeeded = groupBRequiredCredits - groupBCreditsAccumulated;
            if (remainingNeeded >= course.credits) {
                groupBCourses.push(course);
                groupBCreditsAccumulated += course.credits;
            } else if (remainingNeeded > 0) {
                if (course.credits <= remainingNeeded + 2) {
                    groupBCourses.push(course);
                    groupBCreditsAccumulated += course.credits;
                }
            }
        }

        // Check if we have enough credits
        const actualGroupACredits = groupACourses.reduce((sum, c) => sum + c.credits, 0);
        const actualGroupBCredits = groupBCourses.reduce((sum, c) => sum + c.credits, 0);
        
        if (actualGroupACredits < groupARequiredCredits || actualGroupBCredits < groupBRequiredCredits) {
            setResult({
                error: `Insufficient credits. Need ${groupARequiredCredits} Group A and ${groupBRequiredCredits} Group B credits. Got ${actualGroupACredits} Group A and ${actualGroupBCredits} Group B.`,
                wgpa: null,
                classification: null
            });
            return;
        }

        // Calculate GP (Grade Point × Credits) for each group
        const sumGP_GroupA = groupACourses.reduce((sum, c) => sum + (GRADE_POINTS[c.grade] * c.credits), 0);
        const sumGP_GroupB = groupBCourses.reduce((sum, c) => sum + (GRADE_POINTS[c.grade] * c.credits), 0);

        // Apply weights
        const weightedSumGP = (sumGP_GroupA * groupAWeight) + (sumGP_GroupB * groupBWeight);
        const weightedSumCredits = (actualGroupACredits * groupAWeight) + (actualGroupBCredits * groupBWeight);

        // Calculate WGPA
        const wgpa = weightedSumCredits > 0 ? weightedSumGP / weightedSumCredits : 0;

        // Determine honours classification
        let classification = 'No Honours';
        for (const cls of HONOURS_CLASSIFICATION) {
            if (wgpa >= cls.min && wgpa <= cls.max) {
                classification = cls.name;
                break;
            }
        }

        setResult({
            error: null,
            wgpa: wgpa.toFixed(2),
            classification,
            groupACourses,
            groupBCourses,
            groupAWeight,
            groupBWeight
        });
    };

    return (
        <div id="calculator">
            {/* Programme Type Selection */}
            <div style={{ marginBottom: '20px' }}>
                <label>
                    <strong>Programme Type: </strong>
                    <select 
                        value={programmeType} 
                        onChange={(e) => setProgrammeType(e.target.value)}
                        style={{ padding: '5px', marginLeft: '10px' }}
                    >
                        <option value="single">Single Degree (80 credits)</option>
                        <option value="double">Double Degree (120 credits)</option>
                    </select>
                </label>
            </div>

            {/* Weight Configuration */}
            <div style={{ marginBottom: '20px', display: 'flex', gap: '20px' }}>
                <label>
                    <strong>Group A Weight: </strong>
                    <input 
                        type="number" 
                        step="0.1" 
                        min="0.1" 
                        value={groupAWeight}
                        onChange={(e) => setGroupAWeight(parseFloat(e.target.value) || 1)}
                        style={{ width: '60px', padding: '5px', marginLeft: '10px' }}
                    />
                </label>
                <label>
                    <strong>Group B Weight: </strong>
                    <input 
                        type="number" 
                        step="0.1" 
                        min="0.1" 
                        value={groupBWeight}
                        onChange={(e) => setGroupBWeight(parseFloat(e.target.value) || 1)}
                        style={{ width: '60px', padding: '5px', marginLeft: '10px' }}
                    />
                </label>
            </div>

            {/* Course Input Table */}
            <table id="course-table">
                <thead>
                    <tr>
                        <th>Course Code</th>
                        <th>Course Name</th>
                        <th>Grade</th>
                        <th>Credits</th>
                        <th>Level</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map((course, index) => (
                        <tr key={course.id}>
                            <td>
                                <input 
                                    type="text" 
                                    placeholder="e.g., CS4001"
                                    value={course.courseCode}
                                    onChange={(e) => updateCourse(course.id, 'courseCode', e.target.value)}
                                    style={{ width: '100%', padding: '5px' }}
                                />
                            </td>
                            <td>
                                <input 
                                    type="text" 
                                    placeholder="Course Name"
                                    value={course.courseName}
                                    onChange={(e) => updateCourse(course.id, 'courseName', e.target.value)}
                                    style={{ width: '100%', padding: '5px' }}
                                />
                            </td>
                            <td>
                                <select 
                                    value={course.grade}
                                    onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                                    style={{ width: '100%', padding: '5px' }}
                                >
                                    {Object.entries(GRADE_POINTS).map(([grade, point]) => (
                                        <option key={grade} value={grade}>{grade} ({point})</option>
                                    ))}
                                </select>
                            </td>
                            <td>
                                <select 
                                    value={course.credits}
                                    onChange={(e) => updateCourse(course.id, 'credits', parseInt(e.target.value))}
                                    style={{ width: '100%', padding: '5px' }}
                                >
                                    <option value="3">3</option>
                                    <option value="5">5</option>
                                    <option value="10">10</option>
                                </select>
                            </td>
                            <td>
                                <select 
                                    value={course.level}
                                    onChange={(e) => updateCourse(course.id, 'level', e.target.value)}
                                    style={{ width: '100%', padding: '5px' }}
                                >
                                    <option value="Higher">Higher</option>
                                    <option value="Middle">Middle</option>
                                </select>
                            </td>
                            <td>
                                <button 
                                    onClick={() => removeCourse(course.id)}
                                    disabled={courses.length === 1}
                                    style={{ padding: '5px 10px', cursor: courses.length === 1 ? 'not-allowed' : 'pointer' }}
                                >
                                    Remove
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div style={{ marginTop: '15px' }}>
                <button 
                    onClick={addCourse} 
                    style={{ padding: '8px 16px', marginRight: '10px' }}
                >
                    Add Course
                </button>
                <button 
                    onClick={calculateWGPA} 
                    style={{ padding: '8px 16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}
                >
                    Calculate WGPA
                </button>
            </div>

            {/* Results Display */}
            {result && (
                <div id="result-container" style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
                    {result.error ? (
                        <div style={{ color: 'red', fontWeight: 'bold' }}>{result.error}</div>
                    ) : (
                        <>
                            <h3>WGPA Calculation Result</h3>
                            <p><strong>WGPA:</strong> {result.wgpa}</p>
                            <p><strong>Honours Classification:</strong> {result.classification}</p>
                            
                            <div style={{ marginTop: '15px' }}>
                                <h4>Group A Courses (Higher Level) - Weight: {result.groupAWeight}</h4>
                                <ul>
                                    {result.groupACourses.map(c => (
                                        <li key={c.id}>{c.courseCode || 'Unnamed'} - Grade: {c.grade}, Credits: {c.credits}</li>
                                    ))}
                                </ul>
                                <p>Total Group A Credits: {result.groupACourses.reduce((sum, c) => sum + c.credits, 0)}</p>
                            </div>

                            <div style={{ marginTop: '15px' }}>
                                <h4>Group B Courses (Higher/Middle Level) - Weight: {result.groupBWeight}</h4>
                                <ul>
                                    {result.groupBCourses.map(c => (
                                        <li key={c.id}>{c.courseCode || 'Unnamed'} - Grade: {c.grade}, Credits: {c.credits} ({c.level})</li>
                                    ))}
                                </ul>
                                <p>Total Group B Credits: {result.groupBCourses.reduce((sum, c) => sum + c.credits, 0)}</p>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default Layout;