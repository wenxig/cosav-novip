import React from 'react';
import { Box, Pagination } from '@mui/material';
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
  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      my: 1,
      color: 'white'
    }}>
      <Pagination 
        count={Math.ceil(totalItems / pEachPageCount)} 
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
    </Box>
  );
};

export default CosPagination; 