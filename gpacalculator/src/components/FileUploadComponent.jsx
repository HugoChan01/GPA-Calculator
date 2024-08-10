import React, { useCallback, useState } from 'react';

function FileUpload({ onFileUpload }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = useCallback((event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      if (selectedFile.type === 'application/pdf' || selectedFile.type === 'text/plain') {
        setFile(selectedFile);
        setError(null);
        onFileUpload(selectedFile);
      } else {
        setFile(null);
        setError('Please upload a PDF or TXT file.');
      }
    }
  }, [onFileUpload]);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
  }, []);

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];

    if (droppedFile) {
      if (droppedFile.type === 'application/pdf' || droppedFile.type === 'text/plain') {
        setFile(droppedFile);
        setError(null);
        onFileUpload(droppedFile);
      } else {
        setError('Please upload a PDF or TXT file.');
      }
    }
  }, [onFileUpload]);

  return (
    <div 
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{
        border: '2px dashed #cccccc',
        borderRadius: '4px',
        padding: '20px',
        textAlign: 'center',
        cursor: 'pointer'
      }}
    >
      <input
        type="file"
        onChange={handleFileChange}
        accept=".pdf,.txt"
        style={{ display: 'none' }}
        id="file-upload"
      />
      <label htmlFor="file-upload" style={{ cursor: 'pointer' }}>
        {file ? `File selected: ${file.name}` : 'Click or drag and drop to upload your transcript (PDF or TXT)'}
      </label>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default FileUpload;