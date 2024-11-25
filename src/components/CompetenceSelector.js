import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

function CompetenceSelector() {
  const { competences, selectedCompetences, setSelectedCompetences } = useContext(AppContext);
  const [search, setSearch] = useState("");

  // Fonction pour ajouter ou retirer une compétence principale
  const handleMainCheckboxChange = (comp) => {
    const isSelected = selectedCompetences.find(selected => selected.name === comp.name);

    if (isSelected) {
      // Retirer toute la compétence principale (et ses sous-compétences)
      const updatedSelection = selectedCompetences.filter(selected => selected.name !== comp.name);
      setSelectedCompetences(updatedSelection);
    } else {
      // Ajouter la compétence principale avec toutes ses sous-compétences
      const newSelection = [...selectedCompetences, { name: comp.name, subComp: [...comp.subComp] }];
      setSelectedCompetences(newSelection);
    }
  };

  // Fonction pour ajouter ou retirer une sous-compétence
  const handleSubCheckboxChange = (comp, subComp) => {
    const selectedComp = selectedCompetences.find(selected => selected.name === comp.name);

    if (selectedComp) {
      // Sous-compétence déjà présente, la retirer
      const updatedSubComp = selectedComp.subComp.includes(subComp)
        ? selectedComp.subComp.filter(sub => sub !== subComp)
        : [...selectedComp.subComp, subComp];

      // Si aucune sous-compétence n'est sélectionnée, retirer toute la compétence
      const updatedSelection = updatedSubComp.length === 0
        ? selectedCompetences.filter(selected => selected.name !== comp.name)
        : selectedCompetences.map(selected =>
            selected.name === comp.name ? { ...selected, subComp: updatedSubComp } : selected
          );

      setSelectedCompetences(updatedSelection);
    } else {
      // Ajouter la sous-compétence et la compétence principale si elle n'existe pas
      const newSelection = [
        ...selectedCompetences,
        { name: comp.name, subComp: [subComp] }
      ];
      setSelectedCompetences(newSelection);
    }
  };

  // Filtrer les compétences et sous-compétences en fonction de la recherche
  const filteredCompetences = competences.filter(comp =>
    comp.name.toLowerCase().includes(search.toLowerCase()) ||
    (comp.subComp && comp.subComp.some(sub => sub.toLowerCase().includes(search.toLowerCase())))
  );

  return (
    <div>
      <h2>Sélectionner les Compétences</h2>
      <input
        type="text"
        placeholder="Rechercher une compétence"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: '10px', padding: '5px' }}
      />
      <div className="competence-list">
        {filteredCompetences.map((comp, index) => (
          <div key={index}>
            <div>
              <input
                type="checkbox"
                checked={!!selectedCompetences.find(selected => selected.name === comp.name)}
                onChange={() => handleMainCheckboxChange(comp)}
              />
              <label style={{ fontWeight: 'bold' }}>{comp.name}</label>
            </div>
            {comp.subComp.length > 0 && (
              <div style={{ paddingLeft: '20px' }}>
                {comp.subComp.map((subComp, subIndex) => (
                  <div key={subIndex}>
                    <input
                      type="checkbox"
                      checked={!!selectedCompetences.find(selected => selected.name === comp.name)?.subComp.includes(subComp)}
                      onChange={() => handleSubCheckboxChange(comp, subComp)}
                    />
                    <label>{subComp}</label>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CompetenceSelector;