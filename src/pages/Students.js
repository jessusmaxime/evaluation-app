import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import StudentList from '../components/StudentList';
import Papa from 'papaparse';
import { useNavigate } from 'react-router-dom';

function Students() {
  const { students, selectedCompetences, evaluations, evaluationTitle, studentOrder } = useContext(AppContext);
  const navigate = useNavigate();
  const [isExporting, setIsExporting] = useState(false);

  // Fonction pour exporter les résultats en CSV
  const exportCSV = () => {
    if (!students || students.length === 0) {
      return alert("Aucun élève disponible pour l'exportation");
    }

    setIsExporting(true);

    // Construction des données d'exportation pour chaque élève
    const dataToExport = studentOrder.map((studentId, index) => {
      const student = students.find((eleve) => eleve.id === studentId);
      if (!student) return null;

      const row = {
        Ordre: index + 1, // Ajouter la position actuelle dans le tableau
        Nom: student.Nom,
        Prénom: student.Prénom,
      };

      const studentEvaluations = evaluations[studentId];

      selectedCompetences.forEach((comp) => {
        if (comp.subComp && comp.subComp.length > 0) {
          comp.subComp.forEach((subComp) => {
            const subCompKey = `${comp.name} - ${subComp}`;
            // Insérer "A" si l'élève est absent, sinon la valeur de l'évaluation
            row[subCompKey] = studentEvaluations?.isAbsent ? "A" : studentEvaluations?.evaluation?.[subCompKey] ?? 0;
          });
        } else {
          const compKey = comp.name || comp;
          // Insérer "A" si l'élève est absent, sinon la valeur de l'évaluation
          row[compKey] = studentEvaluations?.isAbsent ? "A" : studentEvaluations?.evaluation?.[compKey] ?? 0;
        }
      });

      return row;
    }).filter(Boolean); // Supprimer les lignes nulles ou indéfinies

    console.log("Données d'exportation complètes:", dataToExport);

    // Génération du fichier CSV avec une seule ligne d'en-tête automatique
    const csv = Papa.unparse(dataToExport);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;

    // Créer la date actuelle au format DD-MM-YY
    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getFullYear()).slice(-2)}`;
    const fileName = `${evaluationTitle || 'Evaluation'}_${formattedDate}_resultats.csv`;

    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setIsExporting(false);
    alert("Exportation réussie !");
  };

  return (
    <div className="container" style={{ overflowX: 'auto' }}>
      <h1>Liste des Élèves</h1>
      <StudentList />

      {/* Section des boutons */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
        <button onClick={exportCSV} style={{ marginBottom: '10px', padding: '10px 20px' }}>
          Exporter les Résultats en CSV
        </button>

        <button onClick={() => navigate('/')} style={{ padding: '10px 20px' }}>
          Retourner à l'Accueil
        </button>
      </div>
    </div>
  );
}

export default Students;