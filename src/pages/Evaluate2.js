import React, { useState, useEffect } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useNavigate } from 'react-router-dom';

const Evaluate = ({ students = [], selectedSkills = [] }) => {
  const [evaluations, setEvaluations] = useState({});
  const [completedSubCompetences, setCompletedSubCompetences] = useState({});
  const navigate = useNavigate();

  // Initialize evaluations and completedSubCompetences based on students and selectedSkills
  useEffect(() => {
    const initialEvaluations = {};
    const initialCompleted = {};
    students.forEach((student, index) => {
      initialEvaluations[index] = {};
      selectedSkills.forEach(skill => {
        initialEvaluations[index][skill] = 50; // Default value
        initialCompleted[skill] = false; // Default checkbox state
      });
    });
    setEvaluations(initialEvaluations);
    setCompletedSubCompetences(initialCompleted);
  }, [students, selectedSkills]);

  // Handle slider change
  const handleSliderChange = (studentIndex, skill, value) => {
    setEvaluations(prevEvaluations => ({
      ...prevEvaluations,
      [studentIndex]: {
        ...prevEvaluations[studentIndex],
        [skill]: value
      }
    }));
  };

  // Handle checkbox change
  const handleCheckboxChange = (skill) => {
    setCompletedSubCompetences(prevState => ({
      ...prevState,
      [skill]: !prevState[skill]
    }));
  };

  // Apply color based on slider value
  const getColor = (value) => {
    const percent = value / 100;
    const r = percent < 0.5 ? 255 : Math.floor(255 - (percent - 0.5) * 2 * 255);
    const g = percent > 0.5 ? 255 : Math.floor(percent * 2 * 255);
    return `rgb(${r}, ${g}, 0)`;
  };

  // Return an error message if no students data is available
  if (!students.length) {
    return <div>No students available for evaluation.</div>;
  }

  return (
    <div className="evaluation-container">
      {students.map((student, index) => (
        <div key={index} className="evaluation-card">
          <h3>{`${student['Prénom']} ${student['Nom']}`}</h3>
          {selectedSkills.map((skill, skillIndex) => (
            <div key={skillIndex} className="competence">
              <label>{skill}</label>
              <div className="slider-container">
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={evaluations[index][skill] || 50}
                  onChange={(value) => handleSliderChange(index, skill, value)}
                  trackStyle={{ backgroundColor: getColor(evaluations[index][skill] || 50), height: 10 }}
                  handleStyle={{
                    borderColor: getColor(evaluations[index][skill] || 50),
                    height: 20,
                    width: 20,
                    backgroundColor: '#fff',
                  }}
                  railStyle={{ backgroundColor: '#ddd', height: 10 }}
                />
              </div>
              <input
                type="checkbox"
                checked={completedSubCompetences[skill] || false}
                onChange={() => handleCheckboxChange(skill)}
              />
            </div>
          ))}
        </div>
      ))}
      <button onClick={() => navigate('/students')}>Retour à la liste des élèves</button>
    </div>
  );
};

export default Evaluate;
