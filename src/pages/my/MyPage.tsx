import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";


import BaseMotionDiv from "../BaseMotionDiv";
import BottomNavBar from "../../components/BottomNavBar";
import LogoSearchBar from "../../components/LogoSearchBar";
import MainFunction from '../../components/my/MainFunction';
import OfficialGroup from "../../components/my/OfficialGroup";
import VersionText from "../../components/my/VersionText";
import AccountButtonList from "../../components/my/AccountButtonList";
import AccountInfo from "../../components/my/AccountInfo";

function MyPage() {


 //const windowWidth = document.documentElement.clientWidth;
 const [windowWidth, setWindowWidth] = useState(document.documentElement.clientWidth);

 useEffect(() => {
    window.addEventListener('resize', () => {
      setWindowWidth(document.documentElement.clientWidth);
    });
    return () => {
      window.removeEventListener('resize', () => {
        setWindowWidth(document.documentElement.clientWidth);
      });
    };
  }, []);

  useEffect(() => {
    // 滾動到頁面頂部
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  return (
    <BaseMotionDiv>
      <Box
        style={{
          backgroundColor: "black",
          width: windowWidth,
          minHeight: "100%",
          display: "grid",  
          gap: 10,
        }}
      >
        <LogoSearchBar/>

        <AccountInfo/>
        <AccountButtonList/>
        <MainFunction/>

        <OfficialGroup/>
        <VersionText/>



        {/* 增加空間,避免底部導航被蓋住 */}
        <Box sx={{height:80}}></Box>
        
        <BottomNavBar page={'my'} />

      </Box>
    </BaseMotionDiv>
  );
}

export default MyPage;
