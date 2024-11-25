import React, { createContext, useState } from 'react';

// Créer le contexte
export const SelectedCompetencesContext = createContext();

// Créer un fournisseur de contexte pour gérer les compétences sélectionnées
export const SelectedCompetencesProvider = ({ children }) => {
  const [selectedCompetences, setSelectedCompetences] = useState([]);

  return (
    <SelectedCompetencesContext.Provider value={{ selectedCompetences, setSelectedCompetences }}>
      {children}
    </SelectedCompetencesContext.Provider>
  );
};