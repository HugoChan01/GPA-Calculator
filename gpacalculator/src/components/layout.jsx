import React from 'react'
import { useState } from "react";

function Layout() {
    const [grade, setGrade] = useState('');
    const [credit, setCredit] = useState('');
    const [result, setResult] = useState('');
    const calculateGPA = (event) => {
        event.preventDefault(); // Prevent default form submission
        const gpa = parseFloat(grade) * parseInt(credit);
        setResult(`Your GPA is ${gpa}`);

};
  return (
    <div className="calculator-container">
        <div id="title">
          <h2>GPA Calculator</h2>
        </div>

        <div id="calculator-input">
          <div id="grade-input-title">
            <label>Grade (A=4, B=3, C=2, D=1, F=0):</label>
          </div>

          <div id="grade-input">
            <input 
              type="number" 
              id="grade" 
              name="grade" 
              value={grade} 
              onChange={(e) => setGrade(e.target.value)} 
            />
          </div>

          <div id="credit-input-title">
            <label>Credit Hours:</label>
          </div>

          <div id="credit-input">
            <input 
              type="number" 
              id="credit" 
              name="credit" 
              value={credit} 
              onChange={(e) => setCredit(e.target.value)} 
            />
          </div>

          <div id="submit-button">
            <button type="submit" onClick={calculateGPA}>Calculate</button>
          </div>
          
        </div>

        <div id="result-container">
          <p id="result">{result}</p>
        </div>

      </div>
  );
}

export default Layout;