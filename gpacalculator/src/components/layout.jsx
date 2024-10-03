import React from 'react'
import '/src/App.css';
import { useState } from "react";


function Layout() {
    const [result, setResult] = useState('');
    const [grade, setGrade] = useState('4.0'); 
    const [credit, setCredit] = useState('3'); 

    const calculateGPA = (event) => {
        event.preventDefault(); // Prevent default form submission
        const gpa = parseFloat(grade) * parseInt(credit);
        setResult(`Your Graduate GPA is ${gpa.toFixed(2)}`);
    };

    return (
        <div id="calculator">
            <table>
                <thead>
                    <tr>
                        <th>Grade</th>
                        <th>Credit</th>
                        <th>Grade Point</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <select 
                                id="grade-point" 
                                value={grade} 
                                onChange={(e) => setGrade(e.target.value)}
                            >
                                <option value="4.0">A</option>
                                <option value="3.7">A-</option>
                                <option value="3.3">B+</option>
                                <option value="3.0">B</option>
                                <option value="2.7">B-</option>
                                <option value="2.3">C+</option>
                                <option value="2.0">C</option>
                                <option value="0">F</option>
                            </select>    
                        </td>
                        <td>
                            <div>
                                <div>
                                    <input 
                                        type="radio" 
                                        name="credit" 
                                        value="3" 
                                        checked={credit === '3'} 
                                        onChange={(e) => setCredit(e.target.value)}
                                    />
                                    3 Credits
                                </div>
                                <div>
                                    <input 
                                        type="radio" 
                                        name="credit" 
                                        value="5" 
                                        checked={credit === '5'} 
                                        onChange={(e) => setCredit(e.target.value)}
                                    />
                                    5 Credits
                                </div>
                            </div>
                        </td>
                        <td>
                            <input 
                                id="grade-point-value" 
                                type="text" 
                                value={grade} 
                                disabled
                            />
                        </td>
                    </tr>
                </tbody>
            </table>

            <div id="submit-button">
                <button type="submit" onClick={calculateGPA}>Calculate</button>
            </div>
            <br />
            <div id="result-container">
                <div id="result">{result}</div>
            </div>
        </div>
    );
}

export default Layout;