import {
  Button,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  styled,
  TextField,
  FormControl,
  Menu as MuiMenu,
  MenuItem as MuiMenuItem,
} from "@mui/material"

// Table components
export const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  maxHeight: 440,
}));

export const StyledTable = styled(Table)(({ theme }) => ({
  borderCollapse: 'separate',
  borderSpacing: '0',
}));

export const StyledTableHead = styled(TableHead)(({ theme }) => ({
  '& .MuiTableCell-head': {
    backgroundColor: '#e5e7eb',
    fontWeight: 600,
    fontSize: '1rem',
  }
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: '#f9fafb',
  },
}));

// Button components
export const ActionButton = styled(Button)({
  borderRadius: '20px',
  textTransform: 'none',
  fontSize: '0.9rem',
  padding: '5px 15px',
  border: '1px solid #e0e0e0',
  backgroundColor: '#ffffff',
  color: '#000000',
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
  '&:hover': {
    backgroundColor: '#f5f5f5',
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
  }
});

// Search button style
export const SearchButton = styled(Button)({
  backgroundColor: '#3b82f6',
  color: 'white',
  borderRadius: '100px',
  padding: '8px 24px',
  fontSize: '14px',
  textTransform: 'none',
  fontWeight: 'normal',
  '&:hover': {
    backgroundColor: '#2563eb',
  },
});

// Add button style
export const AddButton = styled(Button)({
  borderRadius: '100px',
  padding: '10px 24px',
  textTransform: 'none',
  fontSize: '1rem',
  backgroundColor: '#f1f5f9', // Light gray background
  color: '#000000',
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: '#e2e8f0',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
  },
});

// Form components
export const SearchContainer = styled('div')({
  display: 'flex',
  margin: '24px 0',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: '16px',
});

// Search input group style
export const SearchInputGroup = styled('div')({
  display: 'flex',
  gap: '16px',
  flex: '1',
  maxWidth: '75%',
});

// Search button group style
export const SearchButtonGroup = styled('div')({
  display: 'flex',
  gap: '12px',
  marginLeft: 'auto',
});

// Search field style
export const SearchField = styled(TextField)({
  flex: 1,
  maxWidth: '33%',
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#e0e0e0',
      borderWidth: '1px',
    },
  },
  '& .MuiOutlinedInput-input': {
    padding: '10px 14px',
    '&::placeholder': {
      color: '#9ca3af',
      opacity: 1,
    },
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#e0e0e0',
  },
});

// Status selector style
export const StatusSelect = styled(FormControl)({
  flex: 1,
  maxWidth: '33%',
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#e0e0e0',
      borderWidth: '1px',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#9ca3af',
  },
  '& .MuiSelect-select': {
    padding: '10px 14px',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#e0e0e0',
  },
});

// Date field style
export const DateField = styled(TextField)({
  flex: 1,
  maxWidth: '33%',
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#e0e0e0',
      borderWidth: '1px',
    },
  },
  '& .MuiOutlinedInput-input': {
    padding: '10px 14px',
    '&::placeholder': {
      color: '#9ca3af',
      opacity: 1,
    },
  },
  '& .MuiInputLabel-shrink': {
    color: '#9ca3af',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#e0e0e0',
  },
});

// Add custom menu component style
export const StyledMenu = styled(MuiMenu)(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 8,
    minWidth: 180,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    padding: '8px 0',
  },
  '& .MuiList-root': {
    padding: '0',
  }
}));

export const StyledMenuItem = styled(MuiMenuItem)({
  padding: '12px 24px',
  fontSize: '16px',
  color: '#333',
  '&:hover': {
    backgroundColor: '#f8f9fa',
  },
  '& svg': {
    fontSize: '20px',
    color: '#777',
    marginRight: '16px',
  },
});