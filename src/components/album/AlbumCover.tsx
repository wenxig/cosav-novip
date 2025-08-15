import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { cMainColor } from '../../data/ColorDef';

interface AlbumCoverProps {
  albumId: string;
  photoUrl: string;
  pageCount?: string;
  adSec?: number;
}

const AlbumCover: React.FC<AlbumCoverProps> = ({
  albumId,
  photoUrl,
  pageCount,
  adSec = 15,
}) => {
  const navigate = useNavigate();
  const componentWidth = Math.min(840, document.documentElement.clientWidth);
  const componentHeight = (componentWidth * 9) / 16 + 30; // 16:9 的寬高比

  return (
    <Box
      sx={{
        width: componentWidth,
        height: componentHeight,
        backgroundImage: `url(${decodeURIComponent(photoUrl)})`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'repeat',
        margin: '0 auto',
        position: 'relative',
      }}
    >
      <Button
        variant="contained"
        sx={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          fontSize: '20px',
          fontWeight: 'bold',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: cMainColor,
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
          },
        }}
        onClick={() => {
          navigate(`/albumContent/${albumId}`);
        }}
      >
        观看相簿
      </Button>
      {pageCount && (
        <Typography
          sx={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '16px',
            fontWeight: 'bold',
          }}
        >
          {pageCount}.P
        </Typography>
      )}
    </Box>
  );
};

export default AlbumCover; 