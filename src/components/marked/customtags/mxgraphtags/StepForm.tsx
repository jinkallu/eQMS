import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';


function StepForm({onClose, onCreate }) {
  const [stepType, setStepType] = useState('Normal'); // Default to Normal

  const handleStepTypeChange = (event) => {
    setStepType(event.target.value);
  };

  return (
    <Modal open={true} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 300,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}
      >
        <h2>Add Next Step</h2>
        <TextField
          select
          label="Step Type"
          value={stepType}
          onChange={handleStepTypeChange}
          variant="outlined"
        >
          <MenuItem value="Normal">Normal</MenuItem>
          <MenuItem value="Condition">Condition</MenuItem>
        </TextField>
        <button onClick={onCreate}>Create Step</button> {/* Close button */}
        <button onClick={onClose}>Cancel</button> {/* Close button */}
        {/* Additional components for the rest of the form */}
      </Box>
    </Modal>
  );
}

export default StepForm;