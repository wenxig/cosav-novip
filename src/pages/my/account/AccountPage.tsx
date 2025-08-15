import React, { useEffect, useState } from "react";
import { Box, Button, Typography} from "@mui/material";

import TopTitleBar from "../../../components/TopTitleBar";
import { useNavigate } from "react-router-dom";
import BaseMotionDiv from "../../BaseMotionDiv";
import { ifAuthFavoriteAlbum, ifAuthFavoriteVideo } from "../../../Shared/Api/interface/AuthInterface";
import PasswordIcon from '@mui/icons-material/Password';
import LogoutIcon from '@mui/icons-material/Logout';
import { cMainColor } from "../../../data/ColorDef";
import CosConfirmDialog from "../../../components/base/CosConfirmDialog";
import { clearUserInfo } from "../../../data/DataCenter";

export interface ifQueryResult {
  videoList?: ifAuthFavoriteVideo;
  albumList?: ifAuthFavoriteAlbum;
  totalItems: number;
}

function AccountPage() {

  const navigate = useNavigate();

  const [windowWidth, setWindowWidth] = useState(document.documentElement.clientWidth);

  useEffect(() => {
    window.addEventListener('resize', () => {
      setWindowWidth(document.documentElement.clientWidth);
    });
    return () => {
      window.removeEventListener('resize', () => {
        setWindowWidth(document.documentElement.clientWidth);
      });
    };
  }, []);

  const iconStyle = {
    width: 30,
    height: 30,
  }
  const iconButtonStyle = {
    width: windowWidth - 40,
    height: 60,
    justifyContent: 'flex-start',
    gap: 1,
    color: 'white',
    border: '1px solid #666666',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    padding: '0 20px',
    textTransform: 'none'
  }


  const [open, setOpen] = useState(false);
  const handleConfirmSubmit = () => {
    clearUserInfo();
    navigate('/my');
  }
  const handleCancel = () => {
    setOpen(false);
  }
  
  return (
    <BaseMotionDiv>
      <Box
        style={{
          backgroundColor: "black",
          width: windowWidth,
          minHeight: "200%",
          display: "grid",  
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,//設定子元件間距
        }}
      >
        <TopTitleBar title="帐号资讯" />

        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          width: '100%'
        }}>
          <Button
            startIcon={<PasswordIcon sx={iconStyle} />}
            sx={iconButtonStyle}
            fullWidth
            onClick={() => navigate('/my/account/changePassword')}
          >
            <Typography sx={{ fontSize: 20 }}>更改密码</Typography>
          </Button>

          <Button
            startIcon={<LogoutIcon sx={{...iconStyle,color:cMainColor}} />}
            sx={{...iconButtonStyle,width:200,}}
            onClick={() => setOpen(true)}
          >
            <Typography sx={{ fontSize: 20,color:cMainColor }}>退出登录</Typography>
          </Button>
        </Box>

        
        <CosConfirmDialog
          open={open}
          title="logout?"
          content="是否确认登出帐号?"
          onConfirm={handleConfirmSubmit}
          onCancel={handleCancel}
          confirmText="登出"
          cancelText="取消"
        />
      </Box>
    </BaseMotionDiv>
  );
}

export default AccountPage;
