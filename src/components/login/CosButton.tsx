import React from 'react';
import { Button } from '@mui/material';
import { cMainColor } from '../../data/ColorDef';

interface CosButtonProps {
  text: string;
  background?: string;
  onClick: () => void;
  disabled?: boolean;
}

const CosButton: React.FC<CosButtonProps> = ({ 
  text, 
  onClick, 
  background = 'transparent',
  disabled = false
}) => {
  return (
    <Button
      onClick={onClick}
      fullWidth
      variant={background === 'transparent' ? 'text' : 'contained'}
      disabled={disabled}
      sx={{
        backgroundColor: background,
        color: background === 'transparent' ? cMainColor : 'white',
        textTransform: 'none',
        borderRadius: '20px',
        padding: '4px px',
        fontSize: '18px',
        fontWeight: 'bold',
        '&:hover': {
          backgroundColor: background,
          opacity: 0.9,
        },
        '&.Mui-disabled': {
          backgroundColor: '#e0e0e0',
          color: '#9e9e9e',
        },
      }}
    >
      {text}
    </Button>
  );
};

export default CosButton; 