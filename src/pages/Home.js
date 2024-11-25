import React, { useContext , useState, getElementById } from 'react';
import FileUploader from '../components/FileUploader';
import CompetenceSelector from '../components/CompetenceSelector';
import { AppContext } from '../context/AppContext';
import Papa from 'papaparse';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';

function Home() {
  const {
    students,
    setEvaluations,
    setStudents,
    setCompetences,
    setSelectedCompetences,
    setEvaluationTitle,
    selectedCompetences,
    competences,
  } = useContext(AppContext); 
  const navigate = useNavigate();

  const [isEvaluationImported, setIsEvaluationImported] = useState(false); // Nouvel état
  const [selectedFile, setSelectedFile] = useState(null);
  const emailUser = "maxime.jessus";
  const emailDomain = "ac-normandie.fr";
// Fonction de traitement des compétences (données JSON déjà parsées)
const processCompetencesData = (data) => {
  const comps = {};

  data.forEach((row, rowIndex) => {
    const mainComp = row.Compétence ? row.Compétence.trim() : null;
    const subComp = row['Sous-compétence'] ? row['Sous-compétence'].trim() : '';
    if (!data[0].Compétence) {
      alert("Erreur : Le fichier de compétences doit contenir une colonne 'Compétence'.");
      return;
    }

    if (!mainComp) {
      console.warn(`Ligne ${rowIndex + 2} : La colonne "Compétence" est manquante ou vide.`);
      return;
    }

    if (!comps[mainComp]) {
      comps[mainComp] = [];
    }

    if (subComp) {
      comps[mainComp].push(subComp);
    }
  });

  const hierarchicalComps = Object.keys(comps).map((comp) => ({
    name: comp,
    subComp: comps[comp],
  }));

  console.log('Compétences Hiérarchiques importées:', hierarchicalComps);
  setCompetences(hierarchicalComps);
};

// Gestion de la sélection de fichier prédéfini
const handleFileSelection = (event) => {
  const selected = event.target.value;
  if (selected === 'bts-mec') {
    console.log("Option sélectionnée : BTS MEC - chemin du fichier : /data/bts-mec-ens-pro.csv");

    fetch('/data/bts-mec-ens-pro.csv')
      .then(response => {
        console.log("Réponse reçue de fetch :", response);
        if (!response.ok) {
          throw new Error('Erreur lors du chargement du fichier de compétences');
        }
        return response.text();
      })
      .then(csvText => {
        console.log("Contenu du fichier CSV (texte brut) :", csvText);
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => processCompetencesData(results.data),  // Traitement des compétences
          error: (error) => alert('Erreur lors du parsing du fichier CSV : ' + error.message),
        });
      })
      .catch(error => {
        alert('Erreur lors du chargement du fichier BTS MEC : ' + error.message);
      });
  }
};


// Fonction pour importer les élèves avec vérification stricte de conformité
const handleElevesUpload = (file) => {
  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: (result) => {
      const headers = result.meta.fields;

      // Vérifier que seules les colonnes "Nom" et "Prénom" sont présentes
      const requiredHeaders = ['Nom', 'Prénom'];
      const extraHeaders = headers.filter(header => !requiredHeaders.includes(header));

      if (extraHeaders.length > 0) {
        alert("Erreur : Le fichier des élèves doit contenir uniquement les colonnes 'Nom' et 'Prénom'. Colonnes supplémentaires détectées : " + extraHeaders.join(', '));
        return;
      }

      if (!headers.includes('Nom') || !headers.includes('Prénom')) {
        alert("Erreur : Le fichier des élèves doit contenir les colonnes 'Nom' et 'Prénom'.");
        return;
      }

      const data = result.data.map(student => ({
        id: uuidv4(),
        Prénom: student.Prénom,
        Nom: student.Nom
      }));
      console.log('Étudiants importés:', data); 
      setStudents(data);
    },
    error: (error) => {
      alert("Erreur lors de l'importation des élèves : " + error.message);
    },
  });
};

// Fonction pour importer les compétences avec "Compétence" obligatoire et "Sous-compétence" optionnelle
const handleCompetencesUpload = (file) => {
  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: (results) => {
      const headers = results.meta.fields;

      // Vérifier que "Compétence" est présente et que les seules colonnes sont "Compétence" et, éventuellement, "Sous-compétence"
      if (!headers.includes('Compétence')) {
        alert("Erreur : Le fichier de compétences doit contenir une colonne 'Compétence'.");
        return;
      }

      const allowedHeaders = ['Compétence', 'Sous-compétence'];
      const extraHeaders = headers.filter(header => !allowedHeaders.includes(header));

      if (extraHeaders.length > 0) {
        alert("Erreur : Le fichier de compétences doit contenir uniquement les colonnes 'Compétence' et, éventuellement, 'Sous-compétence'. Colonnes supplémentaires détectées : " + extraHeaders.join(', '));
        return;
      }

      processCompetencesData(results.data);
    },
    error: (error) => {
      alert("Erreur lors de l'importation des compétences : " + error.message);
    },
  });
};

const handleImportResults = (file) => {
  const fileName = file.name.split('.').slice(0, -1).join('.'); // Extraire le nom du fichier sans extension

  Papa.parse(file, {
    skipEmptyLines: true,
    complete: (results) => {
      const rawData = results.data;
      const headers = rawData[0];
      const importedData = rawData.slice(1); // Ignorer la première ligne pour les en-têtes

      const newEvaluations = {};
      const importedStudents = [];
      const importedCompetences = new Map();

      importedData.forEach((row) => {
        const rowData = Object.fromEntries(headers.map((header, i) => [header, row[i]]));
        const { Nom, Prénom } = rowData;
        if (!Nom || !Prénom) return;

        const eleveId = `${Nom}-${Prénom}`;

        if (!importedStudents.some((e) => e.Nom === Nom && e.Prénom === Prénom)) {
          importedStudents.push({ id: eleveId, Nom, Prénom, completedCompetencesCount: 0 });
        }

        newEvaluations[eleveId] = { evaluation: {}, completed: {}, isAbsent: false };

        let completedCount = 0;

        headers.forEach((header, index) => {
          if (header !== 'Nom' && header !== 'Prénom' && header !== 'Evaluation') {
            const value = row[index]?.trim() === 'A' ? 'A' : parseInt(row[index], 10) || 0;
            newEvaluations[eleveId].evaluation[header] = value;

            if (value === 'A') {
              newEvaluations[eleveId].isAbsent = true; // Marquer l'élève comme absent
            } else if (value > 0) {
              newEvaluations[eleveId].completed[header] = true;
              completedCount += 1; // Compter les sous-compétences évaluées
            }

            const [comp, subComp] = header.split(' - ');
            if (!importedCompetences.has(comp)) {
              importedCompetences.set(comp, []);
            }
            if (subComp && !importedCompetences.get(comp).includes(subComp)) {
              importedCompetences.get(comp).push(subComp);
            }
          }
        });

        const student = importedStudents.find((e) => e.id === eleveId);
        if (student) {
          student.completedCompetencesCount = completedCount; // Mise à jour du compteur pour cet élève
        }
      });

      const selectedCompetences = Array.from(importedCompetences, ([name, subComp]) => ({
        name,
        subComp,
      }));

      setStudents(importedStudents);
      setSelectedCompetences(selectedCompetences);
      setEvaluations(newEvaluations);

      // Ajouter le nom du fichier au titre de l'évaluation
      const evaluationTitle = headers.includes('Evaluation') 
        ? `${headers.Evaluation} - ${fileName}` 
        : `Import_ - ${fileName}`;
      setEvaluationTitle(evaluationTitle);

      setIsEvaluationImported(true); // Marquer qu'une évaluation a été importée
      alert('Évaluation importée avec succès et l’état restauré, compteur de compétences mis à jour.');
    },
    error: (error) => {
      alert('Erreur lors de l\'importation de l\'évaluation : ' + error.message);
    },
  });
};

  // Fonction pour procéder à la sélection des compétences
  const proceedToStudents = () => {
    console.log('Compétences sélectionnées (avant navigation):', selectedCompetences);

    if (selectedCompetences.length === 0) {
      alert('Veuillez sélectionner au moins une compétence avant de continuer.');
      return;
    }

    console.log('Navigation avec les compétences sélectionnées:', selectedCompetences);

    navigate('/students');
  };

  return (
    <div className="container">
      <h1>Suivi des Compétences</h1>

      <div className="import-section">
      <h2>Données à importer : Élèves </h2>

        <FileUploader label="Élèves" onFileUpload={handleElevesUpload} />
        <div>
          <h4>Format du fichier Élèves.CSV </h4>
          <p>Colonnes requises : <strong>Nom</strong>, <strong>Prénom</strong></p>
          <pre>
            {`Nom,Prénom
Dupont,Jean
Martin,Marie`}
          </pre>
        </div>
        <h2>Données à importer : Compétences </h2>

        {/* Menu déroulant pour sélectionner un fichier de compétences prédéfini */}
        <div style={{ marginTop: '20px' }}>
          <label>Choisir un fichier de compétences pré-enregistré :</label>
          <select onChange={handleFileSelection} value={selectedFile}>
            <option value="">Sélectionner</option>
            <option value="bts-mec">BTS MEC - Enseignement pro</option>
            {/* Vous pouvez ajouter d'autres options ici */}
          </select>

        </div>
        <div style={{ marginTop: '20px' }}>
          <FileUploader label="Compétences" onFileUpload={handleCompetencesUpload} />
        </div>

        <div>
          <h4>Format du fichier Compétences.CSV </h4>
          <p>Colonnes requises : <strong>Compétence</strong>, <strong>Sous-compétence</strong> (optionnel)</p>
          <pre>
            {`Compétence,Sous-compétence
Mathématiques,Algèbre
Mathématiques,Géométrie
Sciences,`}
          </pre>
        </div>
      </div>
      
      {isEvaluationImported && (
        <button onClick={() => navigate('/students')} style={{ marginTop: '20px' }}>
          Voir la Liste des Élèves
        </button>
      )}
      <div style={{ marginTop: '20px' }}>
      <h2>Données à importer : Ancienne évaluation </h2>

        <FileUploader label="ancienne évaluation" onFileUpload={handleImportResults} />
      </div>
      {competences && competences.length > 0 && (
        <div className="selection-section">
          <CompetenceSelector />
        </div>
      )}

      {competences.length > 0 && (
        <button onClick={proceedToStudents} style={{ marginTop: '20px' }}>
          Continuer vers la Liste des Élèves
        </button>       
      )}
      <footer style={{ marginTop: '40px', textAlign: 'center', fontSize: '14px' }}>
        <p>
          Pour me contacter :{" "}
          <a href={`mailto:${emailUser}@${emailDomain}`}>
            {`${emailUser}@${emailDomain}`}
          </a>
        </p>
      </footer>
    </div>
  );
}


export default Home;