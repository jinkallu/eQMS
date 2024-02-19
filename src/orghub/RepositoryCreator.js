import React, { useState } from 'react';
import useCreateRepository from '../shared/CHooks/useCreateRepository';

const RepositoryCreator = () => {
  const [repositoryName, setRepositoryName] = useState('');
  const { createRepository, loading } = useCreateRepository();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const newRepository = await createRepository(projectId, repositoryName);
      console.log("New repository created:", newRepository);
    } catch (error) {
      console.error("Error creating repository:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Repository Name:
          <input
            type="text"
            value={repositoryName}
            onChange={(e) => setRepositoryName(e.target.value)}
            required
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Creating Repository..." : "Create Repository"}
        </button>
      </form>
    </div>
  );
};

export default RepositoryCreator;
