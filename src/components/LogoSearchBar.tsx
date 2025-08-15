import React from 'react';
import { Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { cBasePanel, cMainColor } from '../data/ColorDef';

interface LogoSearchBarProps {
  searchPagePath?: string;
  sponsorPagePath?: string;
  width?: number;
}

const LogoSearchBar: React.FC<LogoSearchBarProps> = ({ 
  searchPagePath = '/search/video', 
  sponsorPagePath = '/sponsor',
  width = document.documentElement.clientWidth
}) => {
  const navigate = useNavigate();

  const containerHeight = 55;
  const iconSize = 40;
  const sponsorIconSize = 30;

  const windowWidth = width;
  
  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 999,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: windowWidth,
          height: containerHeight,
          backgroundColor: cBasePanel,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          padding: '0px 10px',
          boxSizing: 'border-box',
        }}
      >
        {/* 第一個元素：favicon 圖片 */}
        <Box
          component="img"
          src="/icons/favicon.png"
          alt="Logo"
          sx={{
            height: iconSize,
            borderRadius: '5px',
            width: iconSize,
          }}
        />
        
        {/* 第二個元素：搜尋按鈕 */}
        <Button
          variant="outlined"
          onClick={() => navigate(searchPagePath)}
          sx={{
            flex: 1,
            height: '36px',
            margin: '0 10px',
            borderRadius: '5px',
            backgroundColor: 'white',
            border: `1px solid ${cMainColor}`,
            color: cMainColor,
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#f5f5f5',
              border: `1px solid ${cMainColor}`,
            },
          }}
        >
          搜尋
        </Button>
        
        {/* 第三個元素：贊助按鈕 */}
        <Button
          onClick={() => navigate(sponsorPagePath)}
          sx={{
            width: sponsorIconSize,
            height: sponsorIconSize + 5,
            minWidth: sponsorIconSize + 5,
            borderRadius: '50%',
            backgroundColor: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
            '&:hover': {
              backgroundColor: '#f5f5f5',
            },
          }}
        >
          <Box
            component="img"
            src="/icons/sponsor.png"
            alt="Sponsor"
            sx={{
              height: sponsorIconSize,
              width: sponsorIconSize,
            }}
          />
        </Button>
      </Box>
      {/* 添加佔位元素 */}
      <Box sx={{ height: containerHeight + 10 }} />
    </>
  );
};

export default LogoSearchBar; 