import React from 'react'
import '/src/App.css';
import { useState } from "react";


function Layout() {
    const [result, setResult] = useState('');
    const calculateGPA = (event) => {
        event.preventDefault(); // Prevent default form submission
        const gpa = parseFloat(grade) * parseInt(credit);
        setResult(`Your GPA is ${gpa}`);

};
  return (


    <div id="calculator">
            
        <table>
            <tr>
                <th>Grade</th>
                <th>Credit</th>
                <th>Grade Point</th>
            </tr>
            <tr>
                <td>
                    <select id="grade-point">
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
                <td><input id="credit" disabled></input></td>
                <td><input id="grade-point-value" disabled></input></td>
            </tr>

        </table>

        <div id="submit-button">
            <button type="submit" onClick={calculateGPA}>Calculate</button>
        </div>

        <div id="result-container">
          <p id="result">{result}</p>
        </div>

    </div>

  );
}

export default Layout;