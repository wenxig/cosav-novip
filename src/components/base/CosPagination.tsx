import React, { useState } from 'react';
import { Box, Pagination, TextField, Button } from '@mui/material';
import { cMainColor } from '../../data/ColorDef';

interface CosPaginationProps {
  totalItems: number;
  currentPage: number;
  handlePageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
  pEachPageCount?: number;
}

const CosPagination: React.FC<CosPaginationProps> = ({
  totalItems,
  currentPage,
  handlePageChange,
  pEachPageCount = 20
}) => {
  const totalPages = Math.ceil(totalItems / pEachPageCount);
  const [inputPage, setInputPage] = useState<string>('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // 只允許數字
    if (/^\d*$/.test(value)) {
      setInputPage(value);
    }
  };

  const handleJumpToPage = () => {
    const pageNumber = parseInt(inputPage);
    if (pageNumber > 0 && pageNumber <= totalPages) {
      // 模擬 Pagination 的 onChange 事件
      const mockEvent = {} as React.ChangeEvent<unknown>;
      handlePageChange(mockEvent, pageNumber);
      setInputPage(''); // 清空輸入框
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleJumpToPage();
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center',
      my: 1,
      color: 'white',
      gap: 1
    }}>
      <Pagination 
        count={totalPages} 
        page={currentPage} 
        onChange={handlePageChange}
        variant="outlined"
        sx={{
          '& .MuiPaginationItem-root': {
            color: 'white',
            borderColor: 'rgba(255, 255, 255, 0.3)',
          },
          '& .Mui-selected': {
            backgroundColor: `${cMainColor} !important`,
            color: 'white !important',
            borderColor: `${cMainColor} !important`,
            '&:hover': {
              backgroundColor: `${cMainColor} !important`,
            },
          },
          '& .MuiPaginationItem-ellipsis': {
            color: 'white',
          },
          '& .MuiPaginationItem-icon': {
            color: 'white',
          },
        }}
      />
      
      {/* 頁碼跳轉功能 */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        mt: 1
             }}>
         <span style={{ color: 'rgba(255, 255, 255, 0.9)' }}>页码</span>
         <TextField
          size="small"
          placeholder={`1-${totalPages}`}
          value={inputPage}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          sx={{
            width: '80px',
            '& .MuiOutlinedInput-root': {
              color: 'white',
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.3)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.5)',
              },
              '&.Mui-focused fieldset': {
                borderColor: cMainColor,
              },
            },
                         '& .MuiInputBase-input': {
               color: 'white',
               textAlign: 'center',
               '&::placeholder': {
                 color: 'rgba(255, 255, 255, 0.5)',
                 opacity: 1,
                 textAlign: 'center',
               },
             },
          }}
        />
        <Button
          variant="outlined"
          size="small"
          onClick={handleJumpToPage}
          disabled={!inputPage || parseInt(inputPage) <= 0 || parseInt(inputPage) > totalPages}
                     sx={{
             color: cMainColor,
             borderColor: 'rgba(255, 255, 255, 0.3)',
             '&:hover': {
               borderColor: cMainColor,
               backgroundColor: 'rgba(255, 255, 255, 0.1)',
             },
             '&:disabled': {
               color: 'rgba(255, 255, 255, 0.3)',
               borderColor: 'rgba(255, 255, 255, 0.1)',
             },
           }}
         >
          跳转
         </Button>
      </Box>
    </Box>
  );
};

export default CosPagination; 