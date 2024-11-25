// src/components/FileUploader.js

import React from 'react';

function FileUploader({ label, onFileUpload }) {
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      onFileUpload(e.target.files[0]);
    }
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileChange} />
    </div>
  );
}

export default FileUploader;
