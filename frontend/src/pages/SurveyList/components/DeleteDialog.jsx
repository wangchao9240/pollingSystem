import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import { SearchButton } from "../../../components/CustomizeComponent";
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';

// Styled components for the dialog
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
    maxWidth: '500px',
    width: '100%'
  },
}));

const CancelButton = styled(Button)(({ theme }) => ({
  color: '#666',
  borderRadius: '20px',
  padding: '8px 24px',
  fontSize: '14px',
  textTransform: 'none',
  fontWeight: 'normal',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
}));

const DeleteDialog = ({ open, handleClose, handleDelete }) => {
  return (
    <StyledDialog 
      open={open} 
      onClose={handleClose}
      fullWidth
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" fontWeight={500}>
          Delete
        </Typography>
        <IconButton 
          edge="end" 
          color="inherit" 
          onClick={handleClose}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </Box>
      
      <DialogContent sx={{ p: 0, pb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Confirm to delete this survey?
        </Typography>
        <Typography variant="body1" color="text.primary">
          This action cannot be undone.
        </Typography>
      </DialogContent>
      
      <DialogActions sx={{ p: 0, justifyContent: 'flex-end', position: 'relative' }}>
        <CancelButton onClick={handleClose}>
          Cancel
        </CancelButton>
        <SearchButton onClick={handleDelete} autoFocus>
          Delete
        </SearchButton>
      </DialogActions>
    </StyledDialog>
  );
}

export default React.memo(DeleteDialog);