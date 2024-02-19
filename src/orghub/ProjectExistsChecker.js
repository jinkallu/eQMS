import React, { useState } from 'react';
import useProjectExists from '../shared/CHooks/useProjectExists';

const ProjectExistsChecker = () => {
  const [projectName, setProjectName] = useState('');
  const { projectExists, loading } = useProjectExists(projectName);

  const handleChange = (e) => {
    setProjectName(e.target.value);
  };

  return (
    <div>
      <input
        type="text"
        value={projectName}
        onChange={handleChange}
        placeholder="Enter project name"
      />
      {loading ? (
        <p>Loading...</p>
      ) : projectExists === null ? null : projectExists ? (
        <p>The project "{projectName}" exists.</p>
      ) : (
        <p>The project "{projectName}" does not exist.</p>
      )}
    </div>
  );
};

export default ProjectExistsChecker;
