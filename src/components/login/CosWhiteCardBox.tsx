import React from 'react';
import Box from '@mui/material/Box';


interface CosWhiteCardBoxProps {
  children: React.ReactNode;
}



const CosWhiteCardBox: React.FC<CosWhiteCardBoxProps> = ({ children }) => {
  const windowWidth = document.documentElement.clientWidth;
  //const navigate = useNavigate();

  /*
  const handleBack = () => {
    navigate(-1);
  };*/

  return (
    <Box
    sx={{
      backgroundColor: 'white',
      borderRadius: 10,
      width: windowWidth * 0.75,
      maxWidth: 400,
      minHeight: 100,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'left',
      justifyContent: 'center',
      padding: 3,
      gap: 2,
    }}
    >
      {/* 返回按鈕 */}
      {/*
      <Box 
        sx={{ 
          width: 85, 
          display: 'flex', 
          alignItems: 'center', 
          backgroundColor: '#f8f9fa',
          borderRadius: 10,
          boxShadow: '1px 1px 1px #c5c6c7',
        }}>
        <IconButton onClick={handleBack} sx={{ color: cMainColor }}>
          <KeyboardArrowLeftIcon />
        </IconButton>
        <Typography sx={{ color: 'black' }}>返回</Typography>
      </Box>
      */}
      {children}
    </Box>
  );
};

export default CosWhiteCardBox; 