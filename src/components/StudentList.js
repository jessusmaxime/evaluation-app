import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { v4 as uuidv4 } from 'uuid'; // Pour générer un ID si nécessaire

const StudentList = () => {
  const {
    students,
    selectedCompetences,
    evaluations,
    setEvaluations,
    evaluationTitle,
    setEvaluationTitle,
    studentOrder,
    setStudentOrder,
  } = useContext(AppContext);

  const [studentsWithId, setStudentsWithId] = useState(
    studentOrder.length > 0
      ? studentOrder.map((id) => students.find((student) => student.id === id))
      : students.map((student) => ({
          ...student,
          id: student.id || uuidv4(),
        }))
  );

  const navigate = useNavigate();

  useEffect(() => {
    // Sauvegarder l'ordre des élèves
    setStudentOrder(studentsWithId.map((student) => student.id));
  }, [studentsWithId, setStudentOrder]);

  // Mise à jour du titre de l'évaluation
  const handleTitleChange = (e) => {
    setEvaluationTitle(e.target.value);
  };

  // Fonction pour récupérer le nombre de compétences complétées pour chaque étudiant
  const getCompletedCompetencesCount = (studentId) => {
    const studentEvaluation = evaluations[studentId] || {};
    const { evaluation = {}, isAbsent } = studentEvaluation;
    if (isAbsent) return 0; // Si absent, pas de compétences complétées
    return Object.values(evaluation).filter((value) => value > 0).length;
  };

  // Fonction pour obtenir le nombre total de sous-compétences à évaluer
  const getTotalSubCompetencesCount = () => {
    return selectedCompetences.reduce((total, comp) => {
      return total + (comp.subComp ? comp.subComp.length : 0);
    }, 0);
  };

  // Fonction pour gérer l'état "Absent" pour un élève
  const toggleAbsent = (studentId) => {
    setEvaluations((prevEvaluations) => ({
      ...prevEvaluations,
      [studentId]: {
        ...prevEvaluations[studentId],
        isAbsent: !prevEvaluations[studentId]?.isAbsent,
        evaluation: !prevEvaluations[studentId]?.isAbsent
          ? {} // Si absent, réinitialiser les évaluations
          : prevEvaluations[studentId]?.evaluation || {},
      },
    }));
  };

  // Fonction pour réorganiser les élèves après un drag-and-drop
  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const newOrder = Array.from(studentsWithId);
    const [movedStudent] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, movedStudent);

    setStudentsWithId(newOrder);
  };

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="evaluation-title" style={{ fontWeight: 'bold' }}>
          Titre de l'évaluation :
        </label>
        <input
          id="evaluation-title"
          type="text"
          value={evaluationTitle}
          onChange={handleTitleChange}
          style={{ marginLeft: '10px', padding: '5px', width: '300px' }}
        />
      </div>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="students">
          {(provided) => (
            <div style={{ overflowX: 'auto' }}>
              <table
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{ borderCollapse: 'collapse', width: '100%' }}
              >
                <thead>
                  <tr>
                    <th style={{ border: '1px solid black', padding: '8px' }}>Nom</th>
                    <th style={{ border: '1px solid black', padding: '8px' }}>Prénom</th>
                    <th style={{ border: '1px solid black', padding: '8px' }}>Absent</th>
                    <th style={{ border: '1px solid black', padding: '8px' }}>Compétences évaluées</th>
                    <th style={{ border: '1px solid black', padding: '8px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {studentsWithId.map((student, index) => (
                    <Draggable key={student.id} draggableId={student.id} index={index}>
                      {(provided) => (
                        <tr
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            border: '1px solid black',
                            padding: '8px',
                            ...provided.draggableProps.style,
                          }}
                        >
                          <td style={{ border: '1px solid black', padding: '8px' }}>{student.Nom}</td>
                          <td style={{ border: '1px solid black', padding: '8px' }}>{student.Prénom}</td>
                          <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>
                            <input
                              type="checkbox"
                              checked={evaluations[student.id]?.isAbsent || false}
                              onChange={() => toggleAbsent(student.id)}
                            />
                          </td>
                          <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>
                            {getCompletedCompetencesCount(student.id)} / {getTotalSubCompetencesCount()}
                          </td>
                          <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>
                            <button
                              onClick={() => {
                                navigate(`/evaluate/${student.id}`, {
                                  state: { competences: selectedCompetences },
                                });
                              }}
                            >
                              Évaluer
                            </button>
                          </td>
                        </tr>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </tbody>
              </table>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default StudentList;