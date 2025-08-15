import React, { useState } from "react";
import { Box, Checkbox, FormControlLabel, Typography } from "@mui/material";


import BaseMotionDiv from "../BaseMotionDiv";
import { useNavigate } from "react-router-dom";
import CosGradientBox from "../../components/login/CosGradientBox";
import CosWhiteCardBox from "../../components/login/CosWhiteCardBox";
import CosInputField from "../../components/login/CosInputField";
import CosForgetPasswordButton from "../../components/login/CosForgetPasswordButton";
import CosButton from "../../components/login/CosButton";
import {cMainColor3 } from "../../data/ColorDef";
import { checkAccount, checkInviteCode, checkPassword, validateEmail } from "../../Shared/function/AccountFunction";
import { sendAuthRegister } from "../../Shared/Api/CosApi";
import CosBackButton from "../../components/login/CosBackButton";
import CosMessageAndLoading from "../../components/base/CosMessageAndLoading";

type Mode = 'register' | 'register2';

function CosRegistPage() {

  const navigate = useNavigate();

  const [mode, setMode] = useState<Mode>('register');
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [termsChecked, setTermsChecked] = useState(false);
  const [ageChecked, setAgeChecked] = useState(false);
  
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState<'error' | 'success' | 'info' | 'warning'>('info');
  const setShowMsg = (msg: string, msgType: 'error' | 'success' | 'info' | 'warning') => {
    setMsg(msg);
    setMsgType(msgType);
  }
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    // 處理登入邏輯
    navigate('/login',{replace:true});
  };

  /** 第一階段註冊 */
  const handleRegister1 = async () => {
    // 重置錯誤訊息
    setMsg('');
    setIsLoading(true);
    try{
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

      // 檢查密碼與確認密碼是否相同
      if (password !== confirmPassword) {
        setShowMsg('密碼與確認密碼不相同', 'error');
        return;
      }

      // 檢查服務條款
      if (!termsChecked) {
        setShowMsg('請勾選服務條款', 'error');
        return;
      }

      // 檢查年齡確認
      if (!ageChecked) {
        setShowMsg('請確認您已滿18歲', 'error');
        return;
      }
    }finally{
      setIsLoading(false);
    }

    // 如果都通過檢查，進入第二階段註冊
    setMode('register2');

  }

  /** 第二階段註冊 */
  const handleRegister2 = async () => {
    // 重置錯誤訊息
    setMsg('');

    setIsLoading(true);
    try{
      const emailError = validateEmail(email);
      if (emailError) {
        setShowMsg(emailError, 'error');
        return;
      }

      const inviteCodeError = checkInviteCode(inviteCode);
      if (inviteCodeError) {
        setShowMsg(inviteCodeError, 'error');
        return;
      }

    // 如果都通過檢查，執行註冊邏輯
      const res = await sendAuthRegister(account,password,confirmPassword,email,inviteCode);

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
      setShowMsg('注册成功,3秒后跳转至登录页面', 'success');
      
      //回到註冊首頁
      setMode('register');

      //重置輸入資料
      resetInputData()

      // 跳轉到登入頁面
      setTimeout(() => {
        setShowMsg('', 'info');
        navigate(`/login/${account}`,{replace:true});
      }, 3000);
    }finally{
      setIsLoading(false);
    }
  };

  /** 重置除了account外的輸入資料 */
  const resetInputData = () => {
    //重置輸入資料
    setPassword('');
    setConfirmPassword('');
    setEmail('');
    setInviteCode('');
    setTermsChecked(false);
  }

  /** 取消註冊 */
  const handleCancelRegister = () => {
    //重置輸入資料
    setEmail('');
    setInviteCode('');
    setTermsChecked(false);
    setAgeChecked(false);

    setMode('register');
  };

  const handleTermsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTermsChecked(event.target.checked);
  };

  const handleAgeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAgeChecked(event.target.checked);
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
          {
          mode === 'register' && (
            <>
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

              {/* 确认密码輸入框 */}
              <CosInputField 
                value={confirmPassword}
                title="确认密码"
                setValue={setConfirmPassword}
                inputType="password"
              />

              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0 }}>
                {/* 服務條款 Checkbox */}
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={termsChecked}
                      onChange={handleTermsChange}
                    />
                  }
                  label="服务条款"
                  sx={{ alignSelf: 'flex-start', color: 'black', ml: 3 }}
                />

                {/* 年齡確認 Checkbox */}
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={ageChecked}
                      onChange={handleAgeChange}
                    />
                  }
                  label="已满18岁"
                  sx={{ alignSelf: 'flex-start', color: 'black',ml: 3 }}
                />
              </Box>

              {/* 忘記密碼按鈕 */}
              <CosForgetPasswordButton />

              {/* 註冊按鈕 */}
              <CosButton
                text="注册帐号"
                onClick={handleRegister1}
                background={cMainColor3}
              />

              {/* 登入按鈕 */}
              <CosButton
                text="登入帐号"
                onClick={handleLogin}
              />
            </>
          )
        }

        {
          mode === 'register2' && (
            <>
              <Typography variant="h6" sx={{ color: "#000" ,fontSize:18,fontWeight:'bold',textAlign:'center'}}>
                请输入相关资讯
              </Typography>

              <CosInputField 
                value={email}
                title="E-Mail(必填)"
                inputType="email"
                setValue={setEmail}
                showHelperText='※可使用E-Mail找回密码'
              />

              <CosInputField 
                value={inviteCode}
                title="邀请码(选填)"
                inputType="inviteCode"
                setValue={setInviteCode}
                showHelperText='※输入邀请码可获得 [7日体验卡]机会'
              />

              {/* 註冊按鈕 */}
              <CosButton
                text="注册"
                onClick={handleRegister2}
                background={cMainColor3}
              />
              
              {/* 返回註冊按鈕 */}
              <CosButton
                text="取消注册"
                onClick={handleCancelRegister}
              />
              
            </>
          )
        }

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

export default CosRegistPage;
