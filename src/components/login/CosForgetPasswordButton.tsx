
import {  Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CosForgetPasswordButton: React.FC = () => {
  //const windowWidth = document.documentElement.clientWidth;
  const navigate = useNavigate();

  return (
    <Button
      sx={{
        color: 'black',
        fontWeight: 'bold',
        textTransform: 'none',
      }}
      onClick={() => navigate('/forgetPwd')}
    >
      Forget Password?
    </Button>
  );
};

export default CosForgetPasswordButton; 