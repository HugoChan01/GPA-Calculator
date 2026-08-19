import React from 'react';
import { useWgpCalculator } from '../../hooks/useWgpCalculator';
import { GRADE_POINTS, CREDIT_OPTIONS, COURSE_LEVELS, PROGRAMME_CONFIG } from '../../constants/gradeConfig';
import './WgpCalculator.css';

const WgpCalculator = () => {
    const {
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
        calculateWGPA
    } = useWgpCalculator();

    return (
        <div className="calculator-container">
            {/* Programme Type Selection */}
            <div className="form-section">
                <label>
                    <strong>Programme Type: </strong>
                    <select
                        value={programmeType}
                        onChange={(e) => setProgrammeType(e.target.value)}
                        className="form-select"
                    >
                        {Object.entries(PROGRAMME_CONFIG).map(([key, config]) => (
                            <option key={key} value={key}>{config.label}</option>
                        ))}
                    </select>
                </label>
            </div>

            {/* Weight Configuration */}
            <div className="form-section weight-config">
                <label>
                    <strong>Group A Weight: </strong>
                    <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        value={groupAWeight}
                        onChange={(e) => setGroupAWeight(parseFloat(e.target.value) || 1)}
                        className="weight-input"
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
                        className="weight-input"
                    />
                </label>
            </div>

            {/* Course Input Table */}
            <table className="course-table">
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
                    {courses.map((course) => (
                        <tr key={course.id}>
                            <td>
                                <input
                                    type="text"
                                    placeholder="e.g., CS4001"
                                    value={course.courseCode}
                                    onChange={(e) => updateCourse(course.id, 'courseCode', e.target.value)}
                                    className="form-input"
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    placeholder="Course Name"
                                    value={course.courseName}
                                    onChange={(e) => updateCourse(course.id, 'courseName', e.target.value)}
                                    className="form-input"
                                />
                            </td>
                            <td>
                                <select
                                    value={course.grade}
                                    onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                                    className="form-select"
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
                                    className="form-select"
                                >
                                    {CREDIT_OPTIONS.map(credit => (
                                        <option key={credit} value={credit}>{credit}</option>
                                    ))}
                                </select>
                            </td>
                            <td>
                                <select
                                    value={course.level}
                                    onChange={(e) => updateCourse(course.id, 'level', e.target.value)}
                                    className="form-select"
                                >
                                    {COURSE_LEVELS.map(level => (
                                        <option key={level} value={level}>{level}</option>
                                    ))}
                                </select>
                            </td>
                            <td>
                                <button
                                    onClick={() => removeCourse(course.id)}
                                    disabled={courses.length === 1}
                                    className="btn-remove"
                                >
                                    Remove
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="action-buttons">
                <button onClick={addCourse} className="btn-add">
                    Add Course
                </button>
                <button onClick={calculateWGPA} className="btn-calculate">
                    Calculate WGPA
                </button>
            </div>

            {/* Results Display */}
            {result && (
                <div className="result-container">
                    {result.error ? (
                        <div className="error-message">{result.error}</div>
                    ) : (
                        <>
                            <h3>WGPA Calculation Result</h3>
                            <p><strong>WGPA:</strong> {result.wgpa}</p>
                            <p><strong>Honours Classification:</strong> {result.classification}</p>

                            <div className="group-details">
                                <h4>Group A Courses (Higher Level) - Weight: {result.groupAWeight}</h4>
                                <ul>
                                    {result.groupACourses.map(c => (
                                        <li key={c.id}>
                                            {c.courseCode || 'Unnamed'} - Grade: {c.grade}, Credits: {c.credits}
                                        </li>
                                    ))}
                                </ul>
                                <p>Total Group A Credits: {result.actualGroupACredits}</p>
                            </div>

                            <div className="group-details">
                                <h4>Group B Courses (Higher/Middle Level) - Weight: {result.groupBWeight}</h4>
                                <ul>
                                    {result.groupBCourses.map(c => (
                                        <li key={c.id}>
                                            {c.courseCode || 'Unnamed'} - Grade: {c.grade}, Credits: {c.credits} ({c.level})
                                        </li>
                                    ))}
                                </ul>
                                <p>Total Group B Credits: {result.actualGroupBCredits}</p>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default WgpCalculator;
