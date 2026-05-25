import { Box } from '@mui/material';
import CosConfirmDialog from '../CosConfirmDialog';

interface CosCheckIsLoginProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  videoTitle?: string;
}

const CosCheckIsDelete: React.FC<CosCheckIsLoginProps> = ({
  open,
  onCancel,
  onConfirm,
  videoTitle,
}) => {
  /*
  useEffect(() => {
    if(open && checkIsLogin()){
      onLoginedAction();
    }
  }, [open,onLoginedAction]);
*/

  if (!open) {
    return null;
  }

  return (
    <CosConfirmDialog
      open={open}
      title="刪除影片"
      content={
        <Box
          sx={{
            maxWidth: '100%',
            overflowWrap: 'anywhere',
            wordBreak: 'break-word',
          }}
        >
          <Box component="span" sx={{ color: '#ff4d4f', fontWeight: 'bold' }}>
            是否删除影片：
          </Box>
          <br />
          {videoTitle}
        </Box>
      }
      onConfirm={onConfirm}
      onCancel={onCancel}
      confirmText="確認刪除"
      cancelText="取消"
    />
  );
};

export default CosCheckIsDelete;
