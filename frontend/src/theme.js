import { createTheme } from '@mui/material/styles';

// Add to your existing theme configuration
const theme = createTheme({
  // Your existing theme settings
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root.Mui-error': {
            '& fieldset': {
              borderColor: 'red',
            }
          },
          '& .MuiFormHelperText-root.Mui-error': {
            color: 'red',
            marginLeft: '0',
            fontSize: '0.7rem',
          }
        }
      }
    }
  }
});