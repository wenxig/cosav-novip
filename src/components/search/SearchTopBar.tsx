import React, { useState } from 'react';
import { Box, Button, IconButton, Select, MenuItem, TextField, InputAdornment } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import { cBasePanel, cMainColor, cMainColor2 } from '../../data/ColorDef';

interface SearchTopBarProps {
  selectType?: string;
  backUrl?: string;
  onSearch?: (type: string,text: string) => void;
}

const SearchTopBar: React.FC<SearchTopBarProps> = ({ 
  selectType = 'video', 
  backUrl,
  onSearch
}) => {
  const navigate = useNavigate();
  const [searchType, setSearchType] = useState(selectType);
  const [searchText, setSearchText] = useState('');

  const handleBackClick = () => {
    if (backUrl) {
      navigate(backUrl);
    } else {
      navigate(-1); // 返回上一頁
    }
  };

  const handleSearchTypeChange = (event: any) => {
    setSearchType(event.target.value);
  };

  const handleSearch = () => {
    if (searchText.trim()) {
      const qString = `kw=${searchText.trim()}`;
      if (onSearch) {
        onSearch(searchType,qString);
      }

      setSearchText('');
    }
  };

  const containerHeight = 50;
  const iconSize = 40;
  const windowWidth = document.documentElement.clientWidth;
  
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

        {/* 搜尋類型下拉選單 */}
        <Select
          value={searchType}
          onChange={handleSearchTypeChange}
          sx={{
            height: '36px',
            margin: '0 5px',
            backgroundColor: 'white',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: cMainColor,
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: cMainColor,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: cMainColor,
            },
            '& .MuiSelect-select': {
              padding: '4px 4px',
            }
          }}
        >
          <MenuItem value="video">视频</MenuItem>
          <MenuItem value="album">相簿</MenuItem>
        </Select>
        
        {/* 搜尋輸入框 */}
        <TextField
          placeholder="请输入搜寻关键字"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'black', fontSize: '24px', padding: '0px' }} />
                </InputAdornment>
              ),
            }
          }}
          sx={{
            flex: 1,
            padding: '4px 4px',
            '& .MuiOutlinedInput-root': {
              height: '36px',
              backgroundColor: 'white',
              '& fieldset': {
                borderColor: cMainColor,
              },
              '&:hover fieldset': {
                borderColor: cMainColor,
              },
              '&.Mui-focused fieldset': {
                borderColor: cMainColor,
              },
              '& input::placeholder': {
                color: 'rgba(0, 0, 0, 0.7)',
                opacity: 1,
                fontWeight: 500,
              },
            }
          }}
        />
        
        {/* 搜尋按鈕 */}
        <Button
          onClick={handleSearch}
          sx={{
            height: iconSize,
            padding: '4px 4px',
            width: '60px',
            minWidth: iconSize,
            borderRadius: '5px',
            backgroundColor: cMainColor2,
            color: 'white',
            fontSize: '18px',
            '&:hover': {
              backgroundColor: cMainColor2,
            },
          }}
        >
          搜寻
        </Button>
      </Box>
      {/* 添加佔位元素 */}
      <Box sx={{ height: containerHeight }} />
    </>
  );
};

export default SearchTopBar; 