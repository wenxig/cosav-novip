import React from 'react';
import { Box, Typography } from '@mui/material';
import CosVideoPlayerAd from './CosVideoPlayerAd';
import { cWhite80 } from '../../data/ColorDef';

interface CosVideoPlayerProps {
  posterUrl?: string;
  message?: string;
  adSec?: number;
}

const CosVideoPlayer: React.FC<CosVideoPlayerProps> = ({
  posterUrl = "https://api.cosplayeringoodfunk.cc/media/videos/tmb/18490/0.jpg?v=1743229224",
  message = "此影片為VIP專屬，請先加入VIP",
  adSec = 15,
}) => {

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '100%',
        position: 'relative',
        paddingTop: '56.25%', // 16:9 寬高比 (9/16 = 0.5625)
        backgroundColor: 'black',
        backgroundImage: `url(${posterUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // 半透明黑色背景
        }}
      >
        <Typography
          sx={{
            color: '#FBD592',
            fontSize: '28px',
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          ✦VIP抢先观看✦
        </Typography>

        <Typography
          sx={{
            color: '#FBD592',
            fontSize: '20px',
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          此影片為VIP專屬，請先加入VIP
        </Typography>

        <Typography
          sx={{
            color: cWhite80,
            fontSize: '16px',
            textAlign: 'center',
            maxWidth: '80%',
          }}
        >
          {message}
        </Typography>

        <Box sx={{ height: '10px' }} />

        <Typography
          sx={{
            color: 'white',
            fontSize: '16px',
            textAlign: 'center',
          }}
        >
          或点击下方立即解锁观看
        </Typography>

        <Typography
          sx={{
            color: 'white',
            fontSize: '20px',
            textAlign: 'center',
          }}
        >
          ↓↓↓
        </Typography>
      </Box>
      
      <CosVideoPlayerAd adSec={adSec} />
    </Box>
  );
};

export default CosVideoPlayer; 