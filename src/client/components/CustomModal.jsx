import React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: {
    xs: '90%',   // 90% width on extra-small screens
    sm: '80%',    // 80% width on small screens
    md: 800,     // 800px width on medium screens and up
  },
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: {
    xs: 2,    // Padding of 2 on extra-small screens
    sm: 3,    // Padding of 3 on small screens
    md: 4,    
  },
  borderRadius: "10px",
  overflow: "auto",
  maxHeight: "99vh",
};

const CustomModal = ({ open, onClose, title, children }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {title}
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          {children}
        </Typography>
      </Box>
    </Modal>
  );
};

export default CustomModal;
