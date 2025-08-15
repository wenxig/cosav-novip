import React, { useState } from "react";
import { Box, Typography } from "@mui/material";

import BaseMotionDiv from "../BaseMotionDiv";
import CosGradientBox from "../../components/login/CosGradientBox";
import CosInputField from "../../components/login/CosInputField";
import CosButton from "../../components/login/CosButton";
import CosWhiteCardBox from "../../components/login/CosWhiteCardBox";
import { cMainColor } from "../../data/ColorDef";
import { sendAuthForget } from "../../Shared/Api/CosApi";
import { validateEmail } from "../../Shared/function/AccountFunction";
import CosBackButton from "../../components/login/CosBackButton";
import CosMessageAndLoading from "../../components/base/CosMessageAndLoading";

function CosForgetPwdPage() {
  const [email, setEmail] = useState('');

  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState<'error' | 'success' | 'info' | 'warning'>('info');
  const setShowMsg = (msg: string, msgType: 'error' | 'success' | 'info' | 'warning') => {
    setMsg(msg);
    setMsgType(msgType);
  }
  const [isLoading, setIsLoading] = useState(false);


  const handleToggleConfirmPassword = async () => {
    // 檢查E-MAIL是否有效
    const emailError = validateEmail(email);
    if (emailError !== '') {
      setShowMsg(emailError, 'error');
      return;
    }

    setIsLoading(true);
    try {
      const res = await sendAuthForget(email);

      //呼叫API失敗
      if (res.result !== 'success' || !res.data) {
        setShowMsg('发送失败，请稍后重试', 'error');
        return;
      }

      //API回傳失敗訊息
      if (res.data.status.includes('fail')) {
        setShowMsg(res.data.msg.join(','), 'error');
        return;
      }

      //API回傳成功訊息
      setShowMsg('发送成功', 'success');
    } catch (error) {
      setShowMsg('发送失败，请稍后重试', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BaseMotionDiv>
      <CosGradientBox>
        <Box
          component="img"
          src="/icons/120.png"
          alt="logo"
          sx={{
            width: 100,
            height: 100,
          }}
        />
        <CosWhiteCardBox>
          <CosBackButton />
          
          {/* E-MAIL輸入框 */}
          <CosInputField 
            value={email}
            title="请输入Email(非帳號)"
            setValue={setEmail}
            inputType="email"
          />

          <Typography variant="h6" sx={{ color: "#000" ,fontSize:16,textAlign:'center'}}>
            请输入注册时的Email，系统将会发送密码至您的Email信箱
          </Typography>

          {/* 登入按鈕 */}
          <CosButton
            text="发送"
            onClick={handleToggleConfirmPassword}
            background={cMainColor}
          />

        </CosWhiteCardBox>
        {/* 建立一個間距讓元件往上移動 */}
        <Box sx={{height: 50}}/>
      </CosGradientBox>

      {/* 訊息與載入中遮罩 */}
      <CosMessageAndLoading
        isloading={isLoading}
        msgType={msgType}
        msg={msg}
        onClose={()=>{
          setShowMsg('', 'info');
        }}
      />
    </BaseMotionDiv>
  );
}

export default CosForgetPwdPage;
