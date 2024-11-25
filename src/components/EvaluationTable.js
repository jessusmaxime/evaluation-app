// src/components/EvaluationTable.js

import React from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import './EvaluationTable.css'; // Optionnel, pour des styles spécifiques

function EvaluationTable({ eleveIndex, competences, selectedCompetences, evaluations, setEvaluations }) {
  // Fonction pour gérer les changements de curseur
  const handleSliderChange = (competence, value) => {
    const updatedEvaluations = { ...evaluations };
    if (!updatedEvaluations[eleveIndex]) {
      updatedEvaluations[eleveIndex] = {};
    }
    updatedEvaluations[eleveIndex][competence] = value;
    setEvaluations(updatedEvaluations);
  };

  // Fonction pour déterminer la couleur en fonction de la valeur
  const getColor = (value) => {
    if (value < 25) return 'red';
    if (value < 50) return 'orange';
    if (value < 75) return 'lightgreen';
    return 'darkgreen';
  };

  return (
    <div>
      <table className="evaluation-table">
        <thead>
          <tr>
            <th>Compétence</th>
            <th>Évaluation</th>
          </tr>
        </thead>
        <tbody>
          {competences.map((comp, index) => (
            <React.Fragment key={index}>
              <tr>
                <td style={{ fontWeight: 'bold' }}>{comp.name}</td>
                <td></td>
              </tr>
              {comp.subComp.length > 0 ? (
                comp.subComp.map((sub, subIndex) => {
                  const fullName = `${comp.name} - ${sub}`;
                  const currentValue = evaluations[eleveIndex] && evaluations[eleveIndex][fullName] ? evaluations[eleveIndex][fullName] : 0;
                  return (
                    <tr key={`${index}-${subIndex}`}>
                      <td style={{ paddingLeft: '20px' }}>{sub}</td>
                      <td>
                        <div className="slider-container">
                          <Slider
                            min={0}
                            max={100}
                            step={1}
                            value={currentValue}
                            onChange={(value) => handleSliderChange(fullName, value)}
                            trackStyle={{ backgroundColor: getColor(currentValue), height: 10 }}
                            handleStyle={{
                              borderColor: getColor(currentValue),
                              height: 20,
                              width: 20,
                              marginLeft: -10,
                              marginTop: -5,
                              backgroundColor: '#fff',
                            }}
                            railStyle={{ backgroundColor: '#ddd', height: 10 }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td></td>
                  <td>
                    <div className="slider-container">
                      <Slider
                        min={0}
                        max={100}
                        step={1}
                        value={selectedCompetences.includes(comp.name) && evaluations[eleveIndex] && evaluations[eleveIndex][comp.name] ? evaluations[eleveIndex][comp.name] : 0}
                        onChange={(value) => handleSliderChange(comp.name, value)}
                        trackStyle={{ backgroundColor: getColor(selectedCompetences.includes(comp.name) && evaluations[eleveIndex] && evaluations[eleveIndex][comp.name] ? evaluations[eleveIndex][comp.name] : 0), height: 10 }}
                        handleStyle={{
                          borderColor: getColor(selectedCompetences.includes(comp.name) && evaluations[eleveIndex] && evaluations[eleveIndex][comp.name] ? evaluations[eleveIndex][comp.name] : 0),
                          height: 20,
                          width: 20,
                          marginLeft: -10,
                          marginTop: -5,
                          backgroundColor: '#fff',
                        }}
                        railStyle={{ backgroundColor: '#ddd', height: 10 }}
                      />
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EvaluationTable;
