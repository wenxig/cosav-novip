import React from 'react';
import Box from '@mui/material/Box';
interface LoginBaseBoxProps {
  children: React.ReactNode;
}



const CosGradientBox: React.FC<LoginBaseBoxProps> = ({ children }) => {
  const windowWidth = document.documentElement.clientWidth;

  return (
    <Box
      sx={{
        width: windowWidth,
        height: '100vh',
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        background: 'linear-gradient(to bottom, rgba(255, 150, 230, 1),rgb(59, 49, 49))',
      }}
    >
      {children}
    </Box>
  );
};

export default CosGradientBox; 