import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { getSiteSetting } from '../../data/DataCenter';

const OfficialGroup: React.FC = () => {
  const width = document.documentElement.clientWidth;
  const socialData = getSiteSetting().social_media;

  const handleClick = (link: string) => {
    window.open(link, '_blank');
  };

  if(!socialData || socialData.length === 0){
    return null;
  }

  return (
    <Box sx={{
      width: width - 20,
      display: 'flex', 
      flexDirection: 'column', 
      gap: 2,
      color: 'white',
      alignItems: 'center',
      padding: '0 10px',
      mt: 4
    }}>
      <Typography sx={{fontSize:18,fontWeight:'bold'}}>官方讨论群</Typography>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
        {socialData.map((item, index) => (
          <IconButton
            key={index}
            onClick={() => handleClick(item.link)}
            sx={{
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              }
            }}
          >
            <img 
              src={item.icon} 
              alt={`social-icon-${index}`}
              style={{
                width: 40,
                height: 40,
                objectFit: 'contain',
                borderRadius: '50%'
              }}
            />
          </IconButton>
        ))}
      </Box>
    </Box>
  );
};

export default OfficialGroup; 