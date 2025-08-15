import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  IconButton,
  Box,
  Typography,
  Button,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { cBasePanel, cMainColor, cWhite80 } from '../../data/ColorDef';
import { API_DEDUPING_INTERVAL } from '../../data/ParameterDef';
import useSWR from 'swr';
import { ifVideoList } from '../../Shared/Api/interface/VideoInterface';
import { getVideoList } from '../../Shared/Api/CosApi';
import CosGridFrame from '../CosGridFrame';

interface CosVideoCollectionProps {
  open: boolean;
  title?: string;
  group_id: string;
  onCancel: () => void;
}

export interface ifQueryResult {
  videoList?: ifVideoList;
  totalItems?: number;
}

const CosVideoCollection: React.FC<CosVideoCollectionProps> = ({
  group_id,
  open,
  onCancel=()=>{},
}) => {

  const [currentPage, setCurrentPage] = useState(1);
  const width = document.documentElement.clientWidth;

  const fetcher = async (): Promise<ifQueryResult | undefined> => {
    
    const res = await getVideoList(`group_id=${group_id}`,0,50);
    if(res.result === 'success'){
      //setTotalItems(parseInt(res.data!.totalCnt));
      return {
        videoList: res.data,
        totalItems: parseInt(res.data!.totalCnt)
      };
    }
    return undefined;
  };

  const { data, error, isLoading } = useSWR(`GetVideoGroupList${group_id}&${currentPage}`, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: API_DEDUPING_INTERVAL, 
    revalidateIfStale: false
  });

  // 按鈕通用樣式
  const buttonStyle = {
    backgroundColor: cBasePanel,
    color: 'rgba(255, 255, 255, 0.6)', // white60
    border: '1px solid',
    borderRadius: 1,
    textTransform: 'none',
    minWidth: '30px',
    width: '100px',
    py: 0.5,
    px: 1,
    '&:hover': {
      backgroundColor: 'rgba(51, 51, 51, 0.7)',
    },
    '& .MuiSvgIcon-root': {
      fontSize: 12,
    },
    '& .MuiButton-startIcon': {
      marginRight: 0.5, // 縮小圖標和文字之間的間距
    },
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Dialog
      open={open}
      onClose={(_event, reason) => {
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
          return;
        }
        onCancel();
      }}
      slotProps={{
        paper: {
          sx: {
            backgroundColor: 'transparent',
            color: 'white',
            width: width,
            height: '85%',
            borderRadius: '12px',
            margin: 0,
            maxWidth: '100%',
            display: 'flex',
            flexDirection: 'column',
          }
        }
      }}
      sx={{
        '& .MuiDialog-container': {
          padding: 0,
        },
        '& .MuiDialog-paper': {
          margin: 0,
        }
      }}
    >
      {/* 對話主內容 */}
      <Box
        sx={{
          borderRadius: '12px',
          backgroundColor: 'rgb(45, 45, 45)',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* 對話主內容的標題 */}
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: '4px 12px',
          flexShrink: 0,
        }}>
          <Typography sx={{ color: "white", fontSize:"20px",fontWeight: 800}}>
            续集列表
          </Typography>
          
          <IconButton
            edge="end"
            color="inherit"
            onClick={onCancel}
            aria-label="close"
            sx={{ color: cWhite80}}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        {isLoading&&<CircularProgress />}

        {/* 對話主內容的內容 */}
        {(!isLoading&&!error&&data&&data.videoList)&&
          <DialogContent sx={{ 
            padding: '20px 0px',
            flex: 1,
            overflow: 'auto',
          }}>
            <DialogContentText sx={{ 
              color: cWhite80,
              textAlign: 'left',
              padding: '10px 20px',
              fontSize: '22px',
              display: 'flex',
              gap: 2,
            }}>
              <Button
                variant="contained"
                onClick={() => handlePageChange(1)}
                sx={{
                  ...buttonStyle,
                  borderColor: currentPage === 1 ? cMainColor : cBasePanel,
                  borderWidth: currentPage === 1 ? '2px' : '1px',
                }}
              >
                <Typography variant="caption" sx={{fontSize: 14,color: cMainColor,fontWeight: 600}}>
                  1-50
                </Typography>
              </Button>
              {
                (!error&&data&&data.totalItems&&data.totalItems>50)&&
                <Button
                  variant="contained"
                  onClick={() => handlePageChange(2)}
                  sx={{
                    ...buttonStyle,
                    borderColor: currentPage === 2 ? cMainColor : cBasePanel,
                    borderWidth: currentPage === 2 ? '2px' : '1px',
                  }}
                >
                  <Typography variant="caption" sx={{fontSize: 14,color: cMainColor,fontWeight: 600}}>
                    51-100
                  </Typography>
                </Button>
              }
            </DialogContentText>

            <DialogContentText sx={{ 
              color: cWhite80,
              textAlign: 'center',
              padding: '0px 20px'
            }}>
              {/* 影片列表 */}
              {
              (!error&&data&&data.videoList)&&
                <CosGridFrame
                  width={width - 40}
                  items={data.videoList.list!}
                  column={2}
                />
              }
              
            </DialogContentText>
          </DialogContent>
        }
      </Box>
    </Dialog>
  );
};

export default CosVideoCollection; 