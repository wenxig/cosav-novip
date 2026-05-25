import React from 'react';
import { Box, Button } from '@mui/material';
import { cMainColor } from '../../data/ColorDef';

type SponsorTabType = 'monthly' | 'download';

interface SponsorTabsProps {
  activeTab: SponsorTabType;
  onChange: (tab: SponsorTabType) => void;
}

function SponsorTabs({ activeTab, onChange }: SponsorTabsProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        backgroundColor: '#2b2b2b',
      }}
    >
      <Button
        onClick={() => onChange('monthly')}
        sx={{
          flex: 1,
          borderRadius: '4px',
          color: 'white',
          fontSize: '18px',
          backgroundColor:
            activeTab === 'monthly' ? `${cMainColor}` : 'transparent',
        }}
      >
        包月方案
      </Button>

      {/*
      <Button
        onClick={() => onChange('download')}
        sx={{
          flex: 1,
          borderRadius: '4px',
          color: 'white',
          fontSize: '18px',
          backgroundColor:
            activeTab === 'download' ? `${cMainColor}` : 'transparent',
        }}
      >
        影片下载券
      </Button>
      */}
    </Box>
  );
}

export default SponsorTabs;
