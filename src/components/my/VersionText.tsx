import React from 'react';
import { Box, Typography } from '@mui/material';
import packageJson from '../../../package.json';

const VersionText: React.FC = () => {
  const width = document.documentElement.clientWidth;

  return (
    <Box sx={{ 
      width: width - 20,
      display: 'flex',
      justifyContent: 'flex-end',
      mt: 2,
    }}>
      <Typography sx={{
        fontSize: 14,
        fontWeight: 'bold',
        color: 'white'
      }}>
        目前版本: {packageJson.version}
      </Typography>
    </Box>
  );
};

export default VersionText; 