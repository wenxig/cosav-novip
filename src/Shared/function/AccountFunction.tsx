import PersonIcon from '@mui/icons-material/Person';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockIcon from '@mui/icons-material/Lock';
import AddReactionIcon from '@mui/icons-material/AddReaction';
import { cBlack80 } from '../../data/ColorDef';
import { getUserInfo, setUserInfo } from '../../data/DataCenter';
import { sendAuthLogin } from '../Api/CosApi';

export type InputType = 'account' | 'password' | 'email' | 'inviteCode';

export const getIcon = (type: InputType) => {
    switch (type) {
      case 'account':
        return <PersonIcon sx={{ color: cBlack80, mr: 1 }} />;
      case 'email':
        return <MailOutlineIcon sx={{ color: cBlack80, mr: 1 }} />;
      case 'password':
        return <LockIcon sx={{ color: cBlack80, mr: 1 }} />;
      case 'inviteCode':
        return <AddReactionIcon sx={{ color: cBlack80, mr: 1 }} />;
      default:
        return <PersonIcon sx={{ color: cBlack80, mr: 1 }} />;
    }
}

export const checkAccount = (account: string) => {
    if (!account) {
      return '帐号不可为空';
    }
    if (account.length > 15){
      return '帐号长度最多15个字';
    }
    if (account.length < 4){
      return '帐号长度最少4个字';
    }
    if (account.includes(' ')){
        return '帐号不能包含空格';
    }
    if (account.trim().includes('@')){
        return '帐号不能包含@';
    }
    if (account.includes('.')){
        return '帐号不能包含.';
    }
    /*
    if (!/^[a-zA-Z0-9]+$/.test(account.trim())){
        return '帐号只能包含英文和数字';
    }*/
    return '';
}

export const checkPassword = (password: string) => {
    if (!password) {
      return '密码不可为空';
    }
    if (password.length > 15){
      return '密码长度最多15个字';
    }
    if (password.length < 4){
      return '密码长度最少4个字';
    }
    if (password.includes(' ')){
        return '密码不能包含空格';
    }
    if (password.includes('@')){
        return '密码不能包含@';
    }
    if (password.includes('.')){
        return '密码不能包含.';
    }
    /*
    if (!/^[a-zA-Z0-9]+$/.test(password.trim())){
      return '密码只能包含英文和数字';
    }*/
    
    
    return '';
}

export const checkInviteCode = (inviteCode: string) => {
    if (!inviteCode) {
        return '';
    }
    if (inviteCode.includes(' ')){
        return '邀请码不能包含空格';
    }
    if (inviteCode.trim().includes('@')){
        return '邀请码不能包含@';
    }
    if (inviteCode.includes('.')){
        return '邀请码不能包含.';
      }
    if (!/^[a-zA-Z0-9]+$/.test(inviteCode)){
        return '邀请码只能包含英文和数字';
    }
    return '';
}

export const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return '请输入正确的邮箱格式';
    }
    return '';
};

/**判斷是否已登入 */
export const checkIsLogin = ()=>{
  const user_info = getUserInfo();
  if(!user_info){
      return false;
  }
  if(!user_info.uid || user_info.uid === ''){
      return false;
  }
  return true;
}

/**判斷是否已贊助 */
export const checkIsVip = ()=>{
    if(!checkIsLogin()){
        return false;
    }
    const user_info = getUserInfo();
    
    if(!user_info || !user_info.vip_expire_date){
        return false;
    }

    const expireDate = new Date(user_info.vip_expire_date);
    if( expireDate.getTime() < new Date().getTime()){
        return false;
    }
    return true;
}

export const storeLoginInfo = (account: string, password: string) => {
  const loginInfo = {
    account:account,
    password:password,
    timestamp: new Date().getTime()
  };
  localStorage.setItem('loginInfo', JSON.stringify(loginInfo));
}

export const getLoginInfo = () => {
  const loginInfoStr = localStorage.getItem('loginInfo');
  if (!loginInfoStr) return null;
  
  try {
    return JSON.parse(loginInfoStr);
  } catch (error) {
    console.error('解析登入資訊失敗:', error);
    return null;
  }
}

export const clearLoginInfo = () => {
  localStorage.removeItem('loginInfo');
}

/**記錄最後進入付費對話框時間 */
export const recordLastEnterBillingDialogTime = () => {
  localStorage.setItem('lastEnterBillingDialogTime', new Date().getTime().toString());
}

/**取得最後進入付費對話框時間 */
export const getLastEnterBillingDialogTime = () => {
  return localStorage.getItem('lastEnterBillingDialogTime');
}

/**清除最後進入付費對話框時間 */
export const clearLastEnterBillingDialogTime = () => {
  localStorage.removeItem('lastEnterBillingDialogTime');
}

/**取得最後進入付費對話框時間 */

/**檢查是否已進入付費對話框 */
export const checkIsPay = async () => {
  if(!checkIsLogin()){//未登入
    return;
  }

  /*
  const lastEnterBillingDialogTime = getLastEnterBillingDialogTime();
  if(!lastEnterBillingDialogTime){ 
    console.log('未記錄');
    return;
  }

  const now = new Date().getTime();
  const diff = now - parseInt(lastEnterBillingDialogTime);
  if(diff > 1000 * 60 * 5){//只判斷5分鐘
    clearLastEnterBillingDialogTime();
    console.log('已超過5分鐘');
    return;
  }*/

  await checkLogin();
  return;
}


export const checkLogin = async ()=>{
  const loginInfo = getLoginInfo();
  if(loginInfo){
    const res = await sendAuthLogin(loginInfo.account,loginInfo.password);
    //呼叫API失敗
    if (res.result === 'fail' || !res.data) {
      return;
    }

    //API回傳失敗訊息
    if (!res.data || !res.data.uid) {
      clearLoginInfo();
      return;
    }
    //res.data.vip_expire_date = '2025-07-16 10:00:00';

    // 設置使用者資訊
    setUserInfo(res.data);

    // 更新登入資訊
    storeLoginInfo(loginInfo.account, loginInfo.password);
  }
}

