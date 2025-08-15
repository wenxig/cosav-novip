import React, {useEffect, useState } from "react";
import { Box, Button, Typography} from "@mui/material";

import TopTitleBar from "../../../components/TopTitleBar";
import BaseMotionDiv from "../../BaseMotionDiv";
import { ifAuthFavoriteAlbum, ifAuthFavoriteVideo } from "../../../Shared/Api/interface/AuthInterface";
import { cBasePanel, cMainColor } from "../../../data/ColorDef";
import CosInputField from "../../../components/login/CosInputField";
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import CosMessageAndLoading from "../../../components/base/CosMessageAndLoading";
import { sendAuthChangePassword } from "../../../Shared/Api/CosApi";

export interface ifQueryResult {
  videoList?: ifAuthFavoriteVideo;
  albumList?: ifAuthFavoriteAlbum;
  totalItems: number;
}

function ChangePasswordPage() {

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [checkNewPassword, setCheckNewPassword] = useState('');


  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState<'error' | 'success' | 'info' | 'warning'>('info');
  const setShowMsg = (msg: string, msgType: 'error' | 'success' | 'info' | 'warning') => {
    setMsg(msg);
    setMsgType(msgType);
  }
  const [isLoading, setIsLoading] = useState(false);

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

  //const width = document.documentElement.clientWidth;

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

  const handleChangePassword = async () => {
    if(oldPassword === ''){
      setShowMsg('请输入旧密码', 'error');
      return;
    }

    if(newPassword === ''){
      setShowMsg('请输入新密码', 'error');
      return;
    }

    if(checkNewPassword === ''){
      setShowMsg('请输入确认新密码', 'error');
      return;
    }

    if(newPassword !== checkNewPassword){
      setShowMsg('新密码与确认新密码不一致', 'error');
      return;
    }

    setIsLoading(true);
    try{
      
      const res = await sendAuthChangePassword(oldPassword,newPassword,checkNewPassword);

      if(res.result === 'fail' || !res.data){
        setShowMsg(res.message || '修改失败,请稍后再试', 'error');
      }else if(res.data?.type.includes('fail')){
        setShowMsg(res.data?.msg.join(',') || '修改失败,请稍后再试', 'error');
      }else{
        setShowMsg('修改成功', 'success');
      }
      
    }catch(error){
      setShowMsg('修改失败,请稍后再试', 'error');
    }finally{
      setIsLoading(false);
    }
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
        }}
      >
        <TopTitleBar title="变更密码" />

        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
          width: windowWidth - 60,
          padding: '20px 30px'
        }}>
          {/* 密碼輸入框 */}
          <CosInputField 
            value={oldPassword}
            title="请输入旧密码"
            setValue={setOldPassword}
            inputType="password"
            backgroundColor={cBasePanel}
            fontColor={cMainColor}
          />

          {/* 密碼輸入框 */}
          <CosInputField 
            value={newPassword}
            title="请输入新密码"
            setValue={setNewPassword}
            inputType="password"
            backgroundColor={cBasePanel}
            fontColor={cMainColor}
          />

          {/* 密碼輸入框 */}
          <CosInputField 
            value={checkNewPassword}
            title="确认新密码"
            setValue={setCheckNewPassword}
            inputType="password"
            backgroundColor={cBasePanel}
            fontColor={cMainColor}
          />


          <Button
            startIcon={<ChangeCircleIcon sx={iconStyle} />}
            sx={{...iconButtonStyle,backgroundColor:cMainColor,width:200}}
            fullWidth
            onClick={handleChangePassword}
          >
            <Typography sx={{ fontSize: 20 }}>修改密码</Typography>
          </Button>
        </Box>


        <CosMessageAndLoading
          isloading={isLoading}
          msgType={msgType}
          msg={msg}
          onClose={()=>{
            setShowMsg('', 'info');
          }}
        />


      </Box>
    </BaseMotionDiv>
  );
}

export default ChangePasswordPage;
