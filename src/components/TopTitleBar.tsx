import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { cBasePanel, cMainColor } from '../data/ColorDef';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface TopTitleBarProps {
  title: string;
  backUrl?: string;
  onBackClick?: () => void;
}

const TopTitleBar: React.FC<TopTitleBarProps> = ({ 
  title = '', 
  backUrl,
  onBackClick = () => {}
}) => {
  const navigate = useNavigate();

  const containerHeight = 60;

  const windowWidth = document.documentElement.clientWidth;
  
  // 處理返回按鈕點擊
  const handleBackClick = () => {
    onBackClick();
    if (backUrl) {
      navigate(backUrl);
    } else {
      navigate(-1); // 返回上一頁
    }
  };
  
  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: windowWidth,
          height: containerHeight,
          backgroundColor: cBasePanel,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          padding: '5px 10px',
          boxSizing: 'border-box',
        }}
      >
        {/* 返回按鈕 - 靠左對齊 */}
        <IconButton 
          onClick={handleBackClick}
          sx={{
            color: cMainColor,
            padding: '8px',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            }
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        
        {/* 標題文字 - 置中處理 */}
        <Typography
          variant="h6"
          sx={{
            color: 'white',
            fontWeight: 'bold',
            flex: 1,
            textAlign: 'center',
            margin: '0 10px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {title}
        </Typography>
        
        {/* 右側空白元素，保持標題置中 */}
        <Box sx={{ width: 40 }} />
      </Box>

      {/* 添加佔位元素 */}
      <Box sx={{ height: containerHeight }} />
    </>
  );
};

export default TopTitleBar; 