import { checkIsVip } from '../../../Shared/function/AccountFunction';
import CosConfirmDialog from '../CosConfirmDialog';
import { useNavigate } from 'react-router-dom';

interface CosCheckIsLoginProps {
  open: boolean;
  onCancel: () => void;
}


const CosCheckIsVip: React.FC<CosCheckIsLoginProps> = ({
  open,
  onCancel,
}) => {

  const navigate = useNavigate();

  const handleConfirmSubmit = () => {
    onCancel();
    navigate('/sponsor');
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
      open={open}
      title="赞助成为VIP?"
      content="此功能需成为VIP后才能使用"
      onConfirm={handleConfirmSubmit}
      onCancel={onCancel}
      confirmText="赞助"
      cancelText="取消"
    />
  );
};

export default CosCheckIsVip; 