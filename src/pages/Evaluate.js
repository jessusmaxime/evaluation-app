import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { FaCheck, FaRedo } from 'react-icons/fa';

function Evaluate() {
  const navigate = useNavigate();
  const { studentId } = useParams();
  const { selectedCompetences, students, evaluations, setEvaluations, setStudents } = useContext(AppContext);

  const student = students.find(student => student.id === studentId);
  const studentEvaluation = evaluations[studentId] || {};

  const [evaluation, setEvaluation] = useState(studentEvaluation.evaluation || {});
  const [completed, setCompleted] = useState(studentEvaluation.completed || {});

  useEffect(() => {
    if (evaluations[studentId]) {
      setEvaluation(evaluations[studentId].evaluation || {});
      setCompleted(evaluations[studentId].completed || {});
    }
  }, [studentId, evaluations]);

  const resetEvaluations = () => {
    setEvaluation({});
    setCompleted({});
  };

  const handleSliderChange = (competence, value) => {
    setEvaluation({
      ...evaluation,
      [competence]: value
    });
  };

  const getCompletedCompetencesCount = () => {
    return Object.values(completed).filter(Boolean).length;
  };

  const saveCompletedCompetencesCount = () => {
    const updatedStudents = students.map(student => {
      if (student.id === studentId) {
        return {
          ...student,
          completedCompetencesCount: getCompletedCompetencesCount(),
        };
      }
      return student;
    });

    setEvaluations(prevEvaluations => ({
      ...prevEvaluations,
      [studentId]: { evaluation, completed }
    }));

    setStudents(updatedStudents);
    navigate('/students');
  };

  return (
    <div className="container" style={{ paddingBottom: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>
        Évaluation de l'élève {student ? `${student.Prénom} ${student.Nom}` : 'inconnu'}
      </h1>

      <div style={{ overflowX: 'auto' }}>
        <table className="responsive-table" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
          <thead></thead>
          <tbody>
            {selectedCompetences && selectedCompetences.length > 0 ? (
              selectedCompetences.map((comp, index) => (
                <React.Fragment key={index}>
                  <tr>
                    <td colSpan="2" style={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>{comp.name}</td>
                  </tr>
                  {comp.subComp && comp.subComp.length > 0 ? (
                    comp.subComp.map((subComp, subIndex) => (
                      <tr key={subIndex}>
                        <td colSpan="2" style={{ padding: '10px', position: 'relative' }}>
                          <div style={{ marginBottom: '5px', fontSize: '14px' }}>{subComp}</div>
                          <div style={{ position: 'relative', textAlign: 'center' }}>
                            <span
                              style={{
                                position: 'absolute',
                                top: '-0px',
                                right: '10px',
                                backgroundColor: '#4B4B4B',
                                color: '#fff',
                                padding: '4px 10px',
                                borderRadius: '5px',
                                fontSize: '12px',
                                transform: 'translateY(-100%)',
                                textAlign: 'center'
                              }}
                            >
                              {evaluation[`${comp.name} - ${subComp}`] || 0}%
                            </span>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={evaluation[`${comp.name} - ${subComp}`] || 0}
                              onChange={(e) => handleSliderChange(`${comp.name} - ${subComp}`, e.target.value)}
                              className="custom-slider"
                              style={{
                                width: '100%',
                                height: '9px',
                                background: `linear-gradient(
                                  to right,
                                  #c8c8c8 ${evaluation[`${comp.name} - ${subComp}`]}%, 
                                  red 0%,
                                  red 25%,
                                  orange 25%,
                                  orange 50%,
                                  lightgreen 50%,       /* Remplace le jaune par du vert clair */
                                  lightgreen 75%,
                                  darkgreen 75%,        /* Remplace le vert par du vert foncé */
                                  darkgreen 100%
                                )`,
                              }}
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2" style={{ textAlign: 'center', padding: '10px' }}>Pas de sous-compétence disponible</td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="2" style={{ padding: '10px' }}>Aucune compétence disponible</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
        <button onClick={saveCompletedCompetencesCount} style={{ padding: '10px 20px' }}>
          <FaCheck /> Enregistrer
        </button>
        <button onClick={resetEvaluations} style={{ backgroundColor: 'red', color: 'white', padding: '10px 20px' }}>
          <FaRedo /> Réinitialiser
        </button>
      </div>

      <div style={{ marginTop: '30px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', width: '100%', maxWidth: '400px', marginLeft: 'auto', marginRight: 'auto' }}>
        <h3 style={{ textAlign: 'center', fontSize: '14px', marginBottom: '10px' }}>Légende</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginTop: '5px' }}>
          <span>0</span>
          <span>25</span>
          <span>50</span>
          <span>75</span>
          <span>100</span>
        </div>
        <div style={{ width: '100%', height: '10px', background: 'linear-gradient(to right, red 0%, red 25%, orange 25%, orange 50%, yellow 50%, yellow 75%, green 75%, green 100%)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 'bold', marginTop: '5px' }}>
          <span>Insuffisant</span>
          <span>Fragile</span>
          <span>Satisfaisant</span>
          <span>Acquis</span>
        </div>
      </div>
    </div>
  );
}

export default Evaluate;