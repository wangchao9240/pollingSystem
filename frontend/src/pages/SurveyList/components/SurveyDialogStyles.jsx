import {
  Dialog,
  Button,
  Box,
  Typography,
  TextField,
  styled,
} from "@mui/material";

// Dialog components
export const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '12px',
    overflow: 'hidden'
  },
  '& .MuiDialogTitle-root': {
    padding: '20px 24px',
    fontSize: '18px',
    fontWeight: 500,
    borderBottom: '1px solid #e0e0e0',
    backgroundColor: '#fff'
  },
  '& .MuiDialogContent-root': {
    padding: '24px',
    backgroundColor: '#fff'
  },
  '& .MuiDialogActions-root': {
    padding: '16px 24px',
    borderTop: '1px solid #e0e0e0',
    backgroundColor: '#fff'
  },
}));

// Question components
export const QuestionCard = styled(Box)(({ theme }) => ({
  border: '1px solid #e0e0e0',
  borderRadius: '8px',
  marginBottom: '16px',
  overflow: 'hidden',
  backgroundColor: '#fff'
}));

export const QuestionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '12px 16px',
  cursor: 'pointer',
  backgroundColor: '#fff',
  borderBottom: props => props.expanded ? '1px solid #e0e0e0' : 'none',
}));

export const QuestionContent = styled(Box)(({ theme }) => ({
  padding: '16px',
}));

// Form components
export const FormSection = styled(Box)(({ theme }) => ({
  marginBottom: '20px',
}));

export const SectionLabel = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  marginBottom: '20px',
  fontSize: '14px',
  color: '#000',
}));

// Inline form components
export const InlineFormSection = styled(Box)(({ theme }) => ({
  marginBottom: '16px',
  display: 'flex',
  alignItems: 'center',
}));

export const InlineSectionLabel = styled(Typography)(({ theme, width, paddingBottom }) => ({
  fontWeight: 400,
  fontSize: '14px',
  color: '#000',
  padding: paddingBottom ? '0 0 20px 0' : '0',
  width: width || '100px', // 使用传入的宽度或默认值
  flexShrink: 0,
}));

export const InlineFieldContainer = styled(Box)(({ theme }) => ({
  flex: 1,
}));

// Option components
export const OptionInput = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '4px',
    backgroundColor: '#fff',
    '&.Mui-error': {
      '& fieldset': {
        borderColor: theme.palette.error.main,
      }
    }
  },
  '& .MuiOutlinedInput-input': {
    padding: '10px 14px',
  }
}));

export const OptionLabel = styled(Box)(({ theme }) => ({
  display: 'inline-block',
  width: '15px', // Narrower to match the design
  marginRight: '8px',
  fontSize: '14px',
  fontWeight: 400, // Regular weight
}));

// Button components
export const AddButton = styled(Button)(({ theme }) => ({
  color: '#3b82f6',
  fontWeight: 'normal',
  textTransform: 'none',
  padding: '4px 8px',
  fontSize: '14px',
  '&:hover': {
    backgroundColor: 'rgba(59, 130, 246, 0.04)',
  }
}));

export const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: '20px',
  fontWeight: 'normal',
  padding: '6px 16px',
  textTransform: 'none',
}));

// QuestionButton styling for the Add Question button
export const QuestionButton = styled(Button)(({ theme }) => ({
  borderRadius: '20px', 
  backgroundColor: '#f5f5f5',
  borderColor: '#f5f5f5',
  color: '#333',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: '#e0e0e0',
    borderColor: '#e0e0e0',
  }
}));

// Save button specific styling
export const SaveButton = styled(ActionButton)(({ theme }) => ({
  backgroundColor: '#3b82f6',
  color: 'white',
  '&:hover': {
    backgroundColor: '#2563eb',
  }
}));