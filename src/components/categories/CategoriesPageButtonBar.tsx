import React from 'react';
import { Box, Button } from '@mui/material';
import { ifCategoryItem } from '../../Shared/Api/interface/CategoriesInterface';
import { cBasePanel, cMainColor } from '../../data/ColorDef';

interface CategoriesPageButtonBarProps {
  categoryItems: ifCategoryItem[];
  chid: string;
  sub_chid?: string;
  onCategoryChange?: (newChid: string, newSubChid: string) => void;
}

const CategoriesPageButtonBar: React.FC<CategoriesPageButtonBarProps> = ({
  categoryItems,
  chid,
  sub_chid = '',
  onCategoryChange
}) => {
  // 找到當前選中的類別
  const selectedCategory = categoryItems.find(item => item.CHID === chid);

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
    padding: '4px 10px', // 減小內邊距
    margin: '0 4px', // 添加小邊距
    whiteSpace: 'nowrap', 
  }
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: windowWidth ,mb:1}}>
      {/* 第一個橫向容器 - 主類別按鈕 */}
      <Box sx={containerStyle}>
        {categoryItems.map((item) => (
          <Button
            key={item.CHID}
            variant="text"
            onClick={() => onCategoryChange && onCategoryChange(item.CHID, '0')}
            sx={{
              ...buttonStyle,
              backgroundColor: item.CHID === chid ? cMainColor : 'transparent',
            }}
          >
            {item.name}
          </Button>
        ))}
      </Box>

      {/* 第二個橫向容器 - 子類別按鈕 */}
      {selectedCategory?.subCategories && selectedCategory.subCategories.length > 0 && (
        <Box sx={containerStyle}>
          {/* "全部" 按鈕 */}
          <Button
            variant={!sub_chid || sub_chid === '0' ? "contained" : "text"}
            onClick={() => onCategoryChange && onCategoryChange(chid, '0')}
            sx={{
              ...buttonStyle,
              backgroundColor: !sub_chid || sub_chid === '0' ? cMainColor : 'transparent',
            }}
          >
            全部
          </Button>
          
          {/* 子類別按鈕 */}
          {selectedCategory.subCategories.map((item) => (
            <Button
              key={item.CHID}
              variant={item.CHID === sub_chid ? "contained" : "text"}
              onClick={() => onCategoryChange && onCategoryChange(chid, item.CHID)}
              sx={{
                ...buttonStyle,
                backgroundColor: item.CHID === sub_chid ? cMainColor : 'transparent',
              }}
            >
              {item.name}
            </Button>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default CategoriesPageButtonBar; 