import React from 'react';
import { Box, Typography, Button } from '@mui/material';
//import { useNavigate } from 'react-router-dom';
import { ifVideoDetail } from '../../Shared/Api/interface/VideoInterface';
import { cBasePanel, cMainColor2 } from '../../data/ColorDef';


interface PlayerAndLineSelectBarProps {
  /**
   * 視頻數據
   */
  data: ifVideoDetail | undefined;
  
  /**
   * 播放器ID，只會有1或2
   */
  playerId: number;
  
  /**
   * 線路索引
   */
  lineIndex: number;
  
  /**
   * 背景顏色，預設為 black
   */
  backgroundColor?: string;
  
  /**
   * 文字顏色，預設為 white
   */
  textColor?: string;
  
  /**
   * 播放器切換回調函數
   */
  onPlayerChange?: (newPlayerId: number) => void;
  
  /**
   * 線路切換回調函數
   */
  onLineChange?: (newLineIndex: number) => void;
}

/**
 * 播放器和線路選擇欄
 * 
 * @param props 元件屬性
 * @returns 播放器和線路選擇欄元件
 */
const PlayerAndLineSelectBar: React.FC<PlayerAndLineSelectBarProps> = ({
  data,
  playerId,
  lineIndex,
  backgroundColor = 'black',
  textColor = 'white',
  onPlayerChange,
  onLineChange
}) => {
  //const navigate = useNavigate();
  if (!data) {
    return null;
  }
  
  // 處理播放器切換
  const handlePlayerChange = (newPlayerId: number) => {
    if (onPlayerChange) {
      onPlayerChange(newPlayerId);
    }
  };
  
  // 處理線路切換
  const handleLineChange = (newLineIndex: number) => {
    if (onLineChange) {
      onLineChange(newLineIndex);
    }
  };
  
  // 處理VIP線路切換
  const handleVipLineChange = (newVipLineIndex: number) => {
    if (onLineChange) {
      onLineChange(newVipLineIndex);
    }
  };
  
  
  return (
    <Box 
      sx={{ 
        width: '100%', 
        backgroundColor: backgroundColor,
        display: 'flex',
        justifyContent: 'space-between', // 使用 space-between 讓兩個 Box 分別靠左和靠右
        alignItems: 'center',
        overflowX: 'auto',
        '&::-webkit-scrollbar': {
          display: 'none' // 隱藏捲動軸
        },
        msOverflowStyle: 'none', // IE 和 Edge
        scrollbarWidth: 'none' // Firefox
      }}
    >
      {/* 播放器 Box - 靠左 */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {/* 播放器標籤 */}
        <Typography
          sx={{
            ml: 1,
            color: textColor,
            fontSize: '1rem',
            fontWeight: 'bold',
            whiteSpace: 'nowrap'
          }}
        >
          播放器:
        </Typography>
        
        {/* 播放器選擇按鈕 */}
        <Box sx={{ display: 'flex', mr: 2 }}>
          {[1, 2].map((id) => (
            <Button
              key={`player-${id}`}
              variant="contained"
              sx={{
                minWidth: '20px',
                width: '25px',
                height: '25px',
                mx: 0.5,
                backgroundColor: playerId === id ? cMainColor2 : cBasePanel,
                color: 'white',
                border: '2px solid white',
                '&:hover': {
                  backgroundColor: playerId === id ? cMainColor2 : cBasePanel,
                  opacity: 0.9
                }
              }}
              onClick={() => handlePlayerChange(id)}
            >
              {id}
            </Button>
          ))}
        </Box>
      </Box>
      
      {/* 線路 Box - 靠右 */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
        {/* 線路標籤 */}
        <Typography
          sx={{
            color: textColor,
            fontSize: '1rem',
            fontWeight: 'bold',
            whiteSpace: 'nowrap'
          }}
        >
          线路:
        </Typography>
        
        {/* 一般線路按鈕 */}
        {data?.video_url && data.video_url.map((_: string, index: number) => (
          <Button
            key={`line-${index}`}
            variant="contained"
            sx={{
              minWidth: '20px',
              width: '25px',
              height: '25px',
              mx: 0.5,
              backgroundColor: lineIndex === index ? cMainColor2 : cBasePanel,
              color: 'white',
              border: '2px solid white',
              '&:hover': {
                backgroundColor: lineIndex === index ? cMainColor2 : cBasePanel,
                opacity: 0.9
              }
            }}
            onClick={() => handleLineChange(index)}
          >
            {index + 1}
          </Button>
        ))}
        
        {/* VIP線路按鈕 */}
        {data?.video_url_vip && data.video_url_vip.map((_: string, index: number) => (
          <Button
            key={`vip-line-${index}`}
            variant="contained"
            sx={{
              minWidth: '40px',
              width: '30px',
              height: '25px',
              mx: 0.5,
              backgroundColor: lineIndex === (data?.video_url?.length || 0) + index ? cMainColor2 : cBasePanel,
              border: '2px solid white',
              '&:hover': {
                backgroundColor: lineIndex === (data?.video_url?.length || 0) + index ? cMainColor2 : cBasePanel,
                opacity: 0.9
              }
            }}
            onClick={() => handleVipLineChange((data?.video_url?.length || 0) + index)}
          >
            {index + 3}
          </Button>
        ))}
      </Box>
    </Box>
  );
};

export default PlayerAndLineSelectBar; 