import React, { useState } from 'react';
import { Box, Typography, TextField, Select, MenuItem, Button, FormControl, IconButton } from '@mui/material';
import { clearFeedbackVideoData, getFeedbackVideoData, getUserInfo } from '../../data/DataCenter';
import { cMainColor, cWhite60, cWhite80 } from '../../data/ColorDef';
import BaseMotionDiv from '../BaseMotionDiv';
import TopTitleBar from '../../components/TopTitleBar';
import RefreshIcon from '@mui/icons-material/Refresh';
import { cBasePanel } from '../../data/ColorDef';
import { sendSiteFeedback } from '../../Shared/Api/CosApi';
import CosMessageAndLoading, { CosMsgType } from '../../components/base/CosMessageAndLoading';
import CosConfirmDialog from '../../components/base/CosConfirmDialog';

interface ifItem{
  id:string,
  name:string,
  value:string,
} 

const feedbackTypeList : ifItem[] = [
  {id:'1', name:'一般问题', value:'General'},
  {id:'2', name:'账号问题', value:'Account'},
  {id:'3', name:'影片播放问题', value:'Player'},
  {id:'4', name:'充值问题', value:'Amount'},
  {id:'5', name:'广告询问', value:'Advertising'},
  {id:'6', name:'违反规定问题', value:'Violations'},
]
  
const feedbackTelecomList : ifItem[] = [
  {id:'1', name:'中国移动', value:'中国移动'},
  {id:'2', name:'中国联通', value:'中国联通'},
  {id:'3', name:'中国电信', value:'中国电信'},
  {id:'4', name:'其他', value:'其他'},
]

const FeedbackPage: React.FC = () => {

  const maxWidth = document.documentElement.clientWidth;
  const [feedbackType, setFeedbackType] = useState<string>('');
  const [telecom, setTelecom] = useState<string>('');
  const [phoneModel, setPhoneModel] = useState('');
  const [content, setContent] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [randomCode, setRandomCode] = useState(Math.floor(Math.random() * 9000) + 1000);
  //選取的檔案路徑，用於顯示預覽圖片
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  //選取的檔案，用於提交時上傳
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState<CosMsgType>('info');
  const setShowMsg = (msg: string, msgType: CosMsgType) => {
    setMsg(msg);
    setMsgType(msgType);
  }
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // 滾動到頁面最下方的函數
  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  };
 

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  //const keyboardVisible = useSimpleKeyboardDetector();

  


  const handleSubmit = async () => {
    if(!feedbackType || feedbackType === ''){
      setShowMsg('请选择分类', 'error');
      return;
    }
    if(!telecom || telecom === ''){
      setShowMsg('请选择使用的电信', 'error');
      return;
    }
    if(content.length === 0){
      setShowMsg('请输入留言内容', 'error');
      return;
    }
    if(verificationCode.length === 0){
      setShowMsg('请输入验证码', 'error');
      return;
    }
    if(verificationCode !== randomCode.toString()){
      setShowMsg('验证码错误', 'error');
      return;
    }
    if(phoneModel.length === 0){
      setShowMsg('请输入手机品牌与型号', 'error');
      return;
    }

    setShowConfirmDialog(true);
  };

  const handleConfirmSubmit = async () => {
    setShowConfirmDialog(false);
    setIsLoading(true);
    setMsg('');

    const temp_feedbackVideoData = getFeedbackVideoData();

    try {
      const res = await sendSiteFeedback(
        feedbackType!,
        getUserInfo()!.email,
        getUserInfo()!.username,
        content,
        temp_feedbackVideoData.videoId,
        temp_feedbackVideoData.line,
        temp_feedbackVideoData.videoUrl,
        temp_feedbackVideoData.reason,
        telecom!,
        phoneModel,
        selectedFile,
        temp_feedbackVideoData.player
      );

      //呼叫API失敗
      if (res.result !== 'success' || !res.data) {
        setShowMsg('发送失败，请稍后重试', 'error');
        return;
      }

      clearFeedbackVideoData();

      if(res.data.status === 'ok'){
        setShowMsg('发送成功', 'success');
      }else{
        setShowMsg('发送失败，请稍后重试', 'error');
      }

      resetForm();
    } catch (err) {
        console.error('提交失敗:', err);
    }finally{
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setContent('');
    setVerificationCode('');
    refreshVerificationCode();
    setPhoneModel('');
    setTelecom('');
    setFeedbackType('');
    setSelectedImage(null);
    setSelectedFile(null);
  }

  const refreshVerificationCode = () => {
    setRandomCode(Math.floor(Math.random() * 9000) + 1000);
  };

  const boxWidth = maxWidth - 30;
  const labelWidth = boxWidth * 0.25;

  const labelStyle = {
    width: labelWidth,
    textAlign: 'right',
    color: cWhite80,
  };

  const inputStyle = {
    fontSize: '16px',
    minHeight: '40px',
    color: 'white',
    backgroundColor: cBasePanel,
    borderRadius: '10px',
    border: `1px solid ${cMainColor}`,
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: cMainColor,
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: cMainColor,
    },
    '& .MuiInputBase-input': {
      color: 'white',
    },
    '& .MuiSelect-select': {
      color: 'white',
    },
    '& .MuiSelect-icon': {
      color: cMainColor,
    }
  };
  const readonlyStyle = {
    fontSize: '16px',
    minHeight: '40px',
    color: 'white',
    backgroundColor: cBasePanel,
    borderRadius: '10px',
    border: `1px solid ${cWhite60}`,
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: cWhite60,
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: cWhite60,
    },
    '& .MuiInputBase-input': {
      color: 'white',
    },
    '& .MuiSelect-select': {
      color: 'white',
    },
    '& .MuiSelect-icon': {
      color: cWhite60,
    }
  };

  return (
    <BaseMotionDiv>
      <TopTitleBar 
        title="意見回饋" 
        onBackClick={() => {
          clearFeedbackVideoData();
        }}
      />
      <Box sx={{ width: maxWidth , }}>
        <Box sx={{ 
          width: boxWidth,
          margin: "10px 15px",
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}>
          {/* 分類 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography sx={labelStyle}>分类:</Typography>
            <FormControl fullWidth>
              <Select
                value={feedbackType}
                onChange={(e) => setFeedbackType(e.target.value)}
                sx={inputStyle}
              >
                {feedbackTypeList.map((item) => (
                  <MenuItem key={item.id} value={item.value}>{item.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* 信箱 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography sx={labelStyle}>信箱:</Typography>
            <TextField
              fullWidth
              value={getUserInfo()!.email}
              slotProps={{ input: { readOnly: true } }}
              sx={readonlyStyle}
            />
          </Box>

          {/* 帳號 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography sx={labelStyle}>帐号:</Typography>
            <TextField
              fullWidth
              value={getUserInfo()!.username}
              slotProps={{ input: { readOnly: true } }}
              sx={readonlyStyle}
            />
          </Box>

          {/* 使用的電信 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography sx={labelStyle}>使用的<br/>电信:</Typography>
            <FormControl fullWidth>
              <Select
                value={telecom}
                onChange={(e) => setTelecom(e.target.value)}
                sx={inputStyle}
              >
                {feedbackTelecomList.map((item) => (
                  <MenuItem key={item.id} value={item.value}>{item.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* 手機品牌與型號 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography sx={labelStyle}>手机品牌<br/>与型号:</Typography>
            <TextField
              fullWidth
              value={phoneModel}
              onChange={(e) => setPhoneModel(e.target.value)}
              sx={inputStyle}
            />
          </Box>

          {/* 檔案選擇 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1}}>
            <Typography sx={labelStyle}>上传图片:</Typography>
            <Box
              sx={{
                flex: 1,
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '40px',
                backgroundColor: cBasePanel,
                borderRadius: '10px',
                border: `1px solid ${cMainColor}`,
                color: 'white',
                cursor: 'pointer',
                overflow: 'hidden',
                '&:hover': {
                  backgroundColor: `${cBasePanel}99`,
                }
              }}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  cursor: 'pointer'
                }}
              />
              {selectedImage ? (
                <Box
                  component="img"
                  src={selectedImage}
                  alt="預覽圖片"
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <Typography sx={{ color: cWhite80 }}>
                  点击选择图片
                </Typography>
              )}
            </Box>
          </Box>

          {/* 提示文字 */}
          <Typography sx={{ color: 'red', fontSize: '14px' }}>
            ※请详细填写相关资讯，以利客服后续协助处理。
          </Typography>

          {/* 留言內容 */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography>留言内容</Typography>
            <TextField
              multiline
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={scrollToBottom}
              sx={{ backgroundColor: 'white' }}
            />
          </Box>

          {/* 驗證碼 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: 1,
              padding: '8px',
              minWidth: '180px',
              backgroundColor: cBasePanel,
              borderRadius: '10px',
              border: `1px solid ${cMainColor}`,
            }}>
              <Box sx={{ 
                display: 'flex',
                gap: '4px',
                alignItems: 'center',
                
              }}>
                {randomCode.toString().split('').map((digit, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: '30px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'white',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      fontSize: '20px',
                      fontWeight: 'bold',
                      color: cMainColor
                    }}
                  >
                    {digit}
                  </Box>
                ))}
              </Box>
              <IconButton 
                onClick={refreshVerificationCode}
                sx={{ 
                  color: cMainColor,
                  padding: '8px',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Box>
            <TextField
              fullWidth
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              onFocus={scrollToBottom}
              placeholder="请输入验证码"
              sx={inputStyle}
            />
          </Box>

          {/* 送出按鈕 */}
          <Button
            onClick={handleSubmit}
            sx={{
              backgroundColor: cMainColor,
              color: 'white',
              margin: '20px auto',
              width: '200px',
              '&:hover': {
                backgroundColor: cMainColor,
                opacity: 0.8
              }
            }}
          >
            送出
          </Button>
        </Box>
      </Box>
      <Box sx={{ width: maxWidth , height: 350,  }}>
      </Box>
      <CosMessageAndLoading
        isloading={isLoading}
        msgType={msgType}
        msg={msg}
        onClose={()=>{
          setMsg('');
        }}
      />

      <CosConfirmDialog
        open={showConfirmDialog}
        title="確認提交"
        content="確定要提交此意見回饋嗎？"
        onConfirm={handleConfirmSubmit}
        onCancel={() => setShowConfirmDialog(false)}
        confirmText="確定提交"
        cancelText="取消"
      />
    </BaseMotionDiv>
  );
};

export default FeedbackPage; 

