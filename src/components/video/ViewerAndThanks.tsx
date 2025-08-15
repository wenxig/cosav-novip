import React from 'react';
import { Box, Typography, Link } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { cMainColor } from '../../data/ColorDef';

interface ViewerAndThanksProps {
  viewer?: string;
  thank_vendor_text?: string;
  thank_vendor_url?: string;
}

const ViewerAndThanks: React.FC<ViewerAndThanksProps> = ({
  viewer = 0,
  thank_vendor_text,
  thank_vendor_url,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        my: 0.5,
      }}
    >
      {/* 觀看人數 */}
      <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
        <VisibilityIcon sx={{ fontSize: 12, mr: 0.5, color: 'white' }} />
        <Typography variant="body2" sx={{ color: 'white',fontSize: 12 }}>
          {viewer}
        </Typography>
      </Box>

      {/* 播放提示 */}
      <Typography variant="body2" sx={{ color: cMainColor, textAlign: 'center' ,  fontSize: 12, }}>
        若无法播放,请尝试更换播放器或线路
      </Typography>

      {/* 感謝提供者 */}
      {thank_vendor_text && (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ color: 'white', fontSize: 12 }}>
            感謝
          </Typography>
          {thank_vendor_url ? (
            <Link
              href={thank_vendor_url}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ 
                color: 'primary.main', 
                ml: 0.5, 
                mr: 0.5,
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                }
              }}
            >
              {thank_vendor_text}
            </Link>
          ) : (
            <Typography variant="body2" sx={{ color: 'white', fontSize: 12 ,mx: 0.5}}>
              {thank_vendor_text}
            </Typography>
          )}
          <Typography variant="body2" sx={{ color: 'white',fontSize: 12 }}>
            提供
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ViewerAndThanks; 