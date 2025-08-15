import React from 'react';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AutoAwesomeMotionIcon from '@mui/icons-material/AutoAwesomeMotion';
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';
import CoPresentIcon from '@mui/icons-material/CoPresent';
import { cBasePanel, cMainColor, cDisabledColor } from '../data/ColorDef';
import { useNavigate } from 'react-router-dom';

type bottomNavBarPage = 'home' | 'category' | 'game' | 'my';

interface PageDataItem {
  index: number;
  label: bottomNavBarPage;
  name: string;
  path: string;
  icon: React.ReactNode;
}

const pageData: PageDataItem[] = [
  {
    index: 0,
    label: 'home',
    name: '首页',
    path: '/home',
    icon: <HomeIcon />
  },
  {
    index: 1,
    label: 'category',
    name: '分类',
    path: '/categoriesPage/new',
    icon: <AutoAwesomeMotionIcon />
  },
  {
    index: 2,
    label: 'game',
    name: '遊戲',
    path: '/game',
    icon: <VideogameAssetIcon />
  },
  {
    index: 3,
    label: 'my',
    name: '我的',
    path: '/my',
    icon: <CoPresentIcon />
  }
];

interface BottomNavBarProps {
  page: bottomNavBarPage;
  width?: number;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({
   page,
   width = document.documentElement.clientWidth
}) => {
  const currentPage = pageData.find((item) => item.label === page);
  const navigate = useNavigate();
  
  return (
    <BottomNavigation
      showLabels
      value={currentPage?.index || 0}
      sx={{
        position: 'fixed', 
        bottom: 0, 
        width: '100%',
        height: 65,
        backgroundColor: cBasePanel,
        '& .MuiBottomNavigationAction-root': {
          color: cDisabledColor,
          '&.Mui-selected': {
            color: cMainColor,
          },
        },
      }}
      onChange={(event, newValue) => {
        const selectedPage = pageData.find(item => item.index === newValue);
        if (selectedPage) {
          navigate(selectedPage.path);
        }
      }}
    >
      {pageData.map((item) => (
        <BottomNavigationAction 
          key={item.label}
          value={item.index} 
          label={item.name} 
          icon={item.icon} 
        />
      ))}
    </BottomNavigation>
  );
};

export default BottomNavBar;