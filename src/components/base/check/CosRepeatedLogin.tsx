import { clearUserInfo } from '../../../data/DataCenter';
import { checkIsVip } from '../../../Shared/function/AccountFunction';
import CosConfirmDialog from '../CosConfirmDialog';
//import { useNavigate } from 'react-router-dom';

interface CosCheckIsLoginProps {
  open: boolean;
  onClose: () => void;
  redirectUrl?: string;
}


const CosRepeatedLogin: React.FC<CosCheckIsLoginProps> = ({
  open,
  onClose,
  redirectUrl = '/home'
}) => {

  //const navigate = useNavigate();

  const handleClose = async () => {
    //登出
    clearUserInfo();
    onClose();
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }

  /*
  useEffect(() => {
    if(open && checkIsLogin()){
      onLoginedAction();
    }
  }, [open,onLoginedAction]);
*/

  if(!open || checkIsVip()){
    return null;
  }

  return (
    <CosConfirmDialog
      dialogType="info"
      open={open}
      title="重复登录!"
      content="此帐号已在其他地方登录,即将登出帐号"
      onConfirm={handleClose}
      onCancel={handleClose}
      confirmText="确认"
    />
  );
};

export default CosRepeatedLogin; 