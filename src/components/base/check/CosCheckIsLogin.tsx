import React from 'react';
import { checkIsLogin } from '../../../Shared/function/AccountFunction';
import CosConfirmDialog from '../CosConfirmDialog';
import { useNavigate } from 'react-router-dom';

interface CosCheckIsLoginProps {
  open: boolean;
  onCancel: () => void;
}


const CosCheckIsLogin: React.FC<CosCheckIsLoginProps> = ({
  open,
  onCancel,
}) => {

  const navigate = useNavigate();

  const handleConfirmSubmit = () => {
    onCancel();
    navigate('/login');
  }

  if(!open || checkIsLogin()){
    return null;
  }

  return (
    <CosConfirmDialog
      open={open}
      title="login?"
      content="需进行登录后才可使用该功能"
      onConfirm={handleConfirmSubmit}
      onCancel={onCancel}
      confirmText="登录"
      cancelText="取消"
    />
  );
};

export default CosCheckIsLogin; 