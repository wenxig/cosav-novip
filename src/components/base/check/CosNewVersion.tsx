import React from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
} from '@mui/material';
import { cMainColor, cWhite60, cWhite80 } from '../../../data/ColorDef';
import { getSiteSetting } from '../../../data/DataCenter';
import packageJson from '../../../../package.json';

interface CosNewVersionProps {
  open: boolean;
  onCancel: () => void;
}

const CosNewVersion: React.FC<CosNewVersionProps> = ({
  open,
  onCancel=()=>{}
}) => {

  const width = document.documentElement.clientWidth;


  const handleUpdateClick = () => {
    // 另開指定URL
    window.open(downloadUrl, '_blank');
  };

  const siteSettingData = getSiteSetting();
  const currentVersion = packageJson.version;
  const latestVersion = siteSettingData.react_version ?? siteSettingData.version;
  const versionInfo = siteSettingData.react_version_info ?? siteSettingData.version_info;
  const downloadUrl = siteSettingData.download_url;

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
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
            width: width - 60,
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
      {/* 對話主內容的內容 */}
        <DialogContent sx={{ 
          padding: '25px 20px',
          flex: 1,
          overflow: 'auto',
          textAlign: 'center',
        }}>
          
            {/* 1. 圖示 */}
            <img 
              src="/icons/favicon.png" 
              alt="CosAV Icon" 
              style={{ 
                width: '100px', 
                height: '100px',
                borderRadius: '12px'
              }} 
            />

            {/* 2. 標題文字 */}
            <Typography sx={{ 
              color: "white", 
              fontSize: "24px", 
              fontWeight: 800,
              marginBottom: '5px'
            }}>
              更新CosAV
            </Typography>

            {/* 3. 版本資訊文字 */}
            <Typography sx={{ 
              color: cWhite60, 
              fontSize: "12px",
              marginBottom: '5px'
            }}>
              目前版本 {currentVersion}，更新至 {latestVersion}
            </Typography>

            {/* 4. 版本詳細資訊文字 */}
            <Typography sx={{ 
              color: cWhite80, 
              fontSize: "14px",
              textAlign: 'left',
              whiteSpace: 'pre-line',
              marginBottom: '30px',
              lineHeight: '1.4',
              padding: '0px 20px'
            }}>
              {versionInfo}
            </Typography>

            {/* 5. 更新按鈕 */}
            <Button
              variant="contained"
              onClick={handleUpdateClick}
              sx={{
                backgroundColor: cMainColor,
                color: 'white',
                fontSize: '16px',
                fontWeight: 600,
                padding: '12px 32px',
                borderRadius: '8px',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: cMainColor,
                  opacity: 0.9,
                },
                minWidth: '200px'
              }}
            >
              版本更新
            </Button>
            
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default CosNewVersion; 