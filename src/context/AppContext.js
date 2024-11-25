import React, { createContext, useState } from 'react';

// Créer le contexte global
export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // États pour les étudiants
  const [students, setStudents] = useState([]);
  
  // États pour les compétences
  const [competences, setCompetences] = useState([]);
  
  // États pour le titre de l'évaluation
  const [evaluationTitle, setEvaluationTitle] = useState('');
  
  // États pour les compétences sélectionnées
  const [selectedCompetences, setSelectedCompetences] = useState([]);

  const [evaluations, setEvaluations] = useState({}); 

  const [studentOrder, setStudentOrder] = useState([]); // Ajout pour gérer l'ordre des élèves


  return (
    <AppContext.Provider value={{
      students,
      setStudents, // Mise à jour des étudiants
      competences,
      setCompetences, // Mise à jour des compétences
      evaluationTitle,
      setEvaluationTitle, // Mise à jour du titre de l'évaluation
      selectedCompetences,
      setSelectedCompetences,
      evaluations,
      studentOrder,
      setStudentOrder,
      setEvaluations
    }}>
      {children}
    </AppContext.Provider>
  );
};