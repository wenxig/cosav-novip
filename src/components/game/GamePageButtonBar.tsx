import React from 'react';
import { Box, Button } from '@mui/material';
import { cBasePanel, cMainColor } from '../../data/ColorDef';
import { ifGameCategories } from '../../Shared/Api/interface/GameInterface';

interface CategoriesPageButtonBarProps {
  gameCategories: ifGameCategories[];
  cid?: string;
  onCategoryChange?: (newChid: string) => void;
}

const GamePageButtonBar: React.FC<CategoriesPageButtonBarProps> = ({
  gameCategories,
  cid='0',
  onCategoryChange
}) => {
  // 找到當前選中的類別
  //const selectedCategory = gameCategories.find(item => item.category_id === cid);

  const windowWidth = document.documentElement.clientWidth;


  const containerStyle = {
    display: 'flex', 
    flexDirection: 'row', 
    flexWrap: 'nowrap', 
    backgroundColor: cBasePanel,
    overflowX: 'auto',
    msOverflowStyle: 'none', // 隱藏 IE 和 Edge 的滾動條
    scrollbarWidth: 'none', // 隱藏 Firefox 的滾動條
    '&::-webkit-scrollbar': {
      display: 'none', // 隱藏 Webkit 瀏覽器的滾動條
    },
    '&::-webkit-scrollbar-thumb': {
      display: 'none', // 隱藏 Webkit 瀏覽器的滾動條滑塊
    },
    '&::-webkit-scrollbar-track': {
      display: 'none', // 隱藏 Webkit 瀏覽器的滾動條軌道
    },
    WebkitOverflowScrolling: 'touch',
  }
  // 按鈕樣式
  const buttonStyle = {
    color: 'white',
    borderRadius: '4px',
    textTransform: 'none',
    fontWeight: 'bold',
    fontSize: '16px',
    minWidth: 'auto', // 移除最小寬度限制
    padding: '4px 8px', // 減小內邊距
    margin: '0 4px', // 添加小邊距
    whiteSpace: 'nowrap', 
  }
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: windowWidth ,mb:1}}>
      {/* 第一個橫向容器 - 主類別按鈕 */}
      <Box sx={containerStyle}>
        {gameCategories.map((item) => (
          <Button
            key={item.category_id}
            variant="text"
            onClick={() => onCategoryChange && onCategoryChange(item.category_id)}
            sx={{
              ...buttonStyle,
              backgroundColor: item.category_id === cid ? cMainColor : 'transparent',
            }}
          >
            {item.category_name}
          </Button>
        ))}
      </Box>

    </Box>
  );
};

export default GamePageButtonBar; 