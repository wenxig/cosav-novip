import React, { useState } from "react";
import { Box } from "@mui/material";


import BaseMotionDiv from "../BaseMotionDiv";
import CosGradientBox from "../../components/login/CosGradientBox";
import CosInputField from "../../components/login/CosInputField";
import CosForgetPasswordButton from "../../components/login/CosForgetPasswordButton";
import CosButton from "../../components/login/CosButton";
import { useNavigate } from "react-router-dom";
import { cMainColor } from "../../data/ColorDef";
import CosWhiteCardBox from "../../components/login/CosWhiteCardBox";
import { checkAccount, checkPassword, storeLoginInfo } from "../../Shared/function/AccountFunction";
import { sendAuthLogin } from "../../Shared/Api/CosApi";
import { setUserInfo } from "../../data/DataCenter";
import CosMessageAndLoading from "../../components/base/CosMessageAndLoading";
import CosBackButton from "../../components/login/CosBackButton";

function CosLoginPage() {

  const navigate = useNavigate();

  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');

  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState<'error' | 'success' | 'info' | 'warning'>('info');
  const setShowMsg = (msg: string, msgType: 'error' | 'success' | 'info' | 'warning') => {
    setMsg(msg);
    setMsgType(msgType);
  }
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    // 重置錯誤訊息
    setMsg('');
    setIsLoading(true);
    try{
      // 處理登入邏輯
      const accountError = checkAccount(account);
      if (accountError) {
        setShowMsg(accountError, 'error');
        return;
      }

      const passwordError = checkPassword(password);
      if (passwordError) {
        setShowMsg(passwordError, 'error');
        return;
      }

      const res = await sendAuthLogin(account,password);
      //呼叫API失敗
      if (res.result === 'fail' || !res.data) {
        setShowMsg('帐号或密码错误，请稍后重试', 'error');
        return;
      }

      //API回傳失敗訊息
      if (!res.data || !res.data.uid) {
        setShowMsg('帐号或密码错误，请稍后重试', 'error');
        return;
      }

      // 設置使用者資訊
      setUserInfo(res.data);

      // 儲存登入資訊
      storeLoginInfo(account, password);

      // 登入成功
      setShowMsg('登录成功,稍后将自动跳转至前一页面', 'success');

      // 跳轉到我的頁面
      setTimeout(() => {
        setShowMsg('', 'info');
        setIsLoading(false);
        //navigate(`/my`);
        navigate(-1);
      }, 1500);


    }finally{
      setIsLoading(false);
    }
  };

  const handleRegister = () => {
    navigate('/register',{replace:true});
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

          {/* 帳號輸入框 */}
          <CosInputField 
            value={account}
            title="帐号(请勿使用mail)"
            setValue={setAccount}
          />

          {/* 密碼輸入框 */}
          <CosInputField 
            value={password}
            title="密码"
            setValue={setPassword}
            inputType="password"
          />

          {/* 忘記密碼按鈕 */}
          <CosForgetPasswordButton />

          {/* 登入按鈕 */}
          <CosButton
            text="登入帐号"
            onClick={handleLogin}
            background={cMainColor}
          />

          {/* 註冊按鈕 */}
          <CosButton
            text="注册帐号"
            onClick={handleRegister}
          />
        </CosWhiteCardBox>
        {/* 建立一個間距讓元件往上移動 */}
        <Box sx={{height: 50}}/>
      </CosGradientBox>

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

export default CosLoginPage;
