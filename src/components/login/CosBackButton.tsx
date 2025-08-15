import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { cMainColor } from '../../data/ColorDef';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { useNavigate } from 'react-router-dom';

interface CosBackButtonProps {
  backupUrl?: string;
}

const CosBackButton: React.FC<CosBackButtonProps> = ({ 
  backupUrl
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backupUrl) {
      navigate(backupUrl);
    } else {
      navigate(-1);
    }
  };

  return (
    <Box 
      sx={{ 
        width: 85, 
        display: 'flex', 
        alignItems: 'center', 
        backgroundColor: '#f8f9fa',
        borderRadius: 10,
        boxShadow: '1px 1px 1px #c5c6c7',
        mb: 2
      }}
    >
      <IconButton onClick={handleBack} sx={{ color: cMainColor }}>
        <KeyboardArrowLeftIcon /><Typography sx={{ color: 'black' }}>返回</Typography>
      </IconButton>
      
    </Box>
  );
};

export default CosBackButton; 