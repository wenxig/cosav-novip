import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { cBasePanel } from '../../data/ColorDef';
import CosAdIFrame from '../CosAdIFrame';
import CircularProgressWithValue from '../base/CircularProgressWithValue';

interface CosVideoPlayerAdProps {
  adSec?: number;
}

const CosVideoPlayerAd: React.FC<CosVideoPlayerAdProps> = ({
  adSec = 0,
}) => {
  const [countdown, setCountdown] = useState(adSec);

  // 建立秒數倒數的計時器
  useEffect(() => {
    if(adSec <= 0){
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 0.25;
      });
    }, 250);

    return () => {
      clearInterval(timer);
    };
  }, [adSec]);

  // 廣告區域
  const adBoxStyle = {
    position:'absolute',
    top:0,
    left:0,
    width:'100%',
    height:'100%',
    textAlign:'center',
    zIndex: 10
  }

  // 廣告文字區域
  const adTextBarStyle = {
    backgroundColor:cBasePanel,
    width:'100%',
    display: 'flex',
    justifyContent: 'center',    
    alignItems: 'center',    
  }

  return (
    <>
      {countdown > 0 && (
        <Box sx={adBoxStyle}>
          <Box sx={adTextBarStyle}>
            <Typography variant="h6" sx={{color:'white'}}>
              广告播放中，加入VIP可略过广告
            </Typography>
            <CircularProgressWithValue nowProgress={countdown} maxProgress={adSec}/>
          </Box>
        </Box>
      )}
    </>
  );
};

export default CosVideoPlayerAd; 