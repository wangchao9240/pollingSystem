import React from 'react';
import { Box, Typography } from '@mui/material';
import NoDataIcon from './NoDataIcon';

const EmptyTable = ({ 
  message = "No Result found",
  height = "300px",
  iconWidth = 80,
  iconHeight = 100,
  iconColor = '#333'
}) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height={height}
      width="100%"
      sx={{
        backgroundColor: '#f9f9f9',
        borderRadius: '4px',
        py: 6
      }}
    >
      <NoDataIcon 
        width={iconWidth} 
        height={iconHeight} 
        color={iconColor} 
      />
      <Typography 
        color="text.primary" 
        variant="h6" 
        sx={{ 
          mt: 2,
          fontWeight: 'medium'
        }}
      >
        {message}
      </Typography>
    </Box>
  );
};

export default EmptyTable;