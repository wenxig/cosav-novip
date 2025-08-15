import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";

import { dataCenter, getSiteSetting } from "../data/DataCenter";

import BaseMotionDiv from "./BaseMotionDiv";
import CosAdIFrame from "../components/CosAdIFrame";
import SwiperAdBanner from "../components/home/SwiperAdBanner";
import CosCategoriesBoard from "../components/home/CosCategoriesBoard";
import SizedDialog from "../components/SizedDialog";
import HomeNavBar from "../components/home/HomeNavBar";
import BottomNavBar from "../components/BottomNavBar";
import LogoSearchBar from "../components/LogoSearchBar";
import { ifIndexPageSection } from "../Shared/Api/interface/SiteInterface";

const Home = () => {
  //const windowWidth = Math.min(document.documentElement.clientWidth, document.documentElement.clientHeight);
  const [windowWidth, setWindowWidth] = useState(document.documentElement.clientWidth);
  const [open, setOpen] = useState(dataCenter.shouldShowAd);
  const [open2, setOpen2] = useState(dataCenter.shouldShowAd);

  useEffect(() => {
    // 進入畫面時先滾動到頁面頂部
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

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
  
  const closeDialog = () => {
    setOpen(false);
  }

  const closeDialog2 = () => {
    setOpen2(false);
    dataCenter.shouldShowAd = false;
  }

  const siteSetting = getSiteSetting();

  return (
    <BaseMotionDiv>
      <Box
        style={{
          backgroundColor: "black",
          width: windowWidth,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          paddingBottom: "110px"
        }}
      >
        <Box
          style={{
            display: "grid",
            gap: 12,
            flex: 1
          }}
        >
          <LogoSearchBar width={windowWidth}/>
          {/* <SwiperAdBanner width={windowWidth} items={siteSetting.header_banner}/> */}
          <HomeNavBar width={windowWidth}/>


          {
            siteSetting.index_page.map((item:ifIndexPageSection,index:number)=>{
              return(
                <CosCategoriesBoard key={index} width={windowWidth} data={item}/>
              )
            })
          }
        </Box>
        
        <Box sx={{height: 80}}></Box>
        <BottomNavBar page={'home'} />
        
      </Box>
    </BaseMotionDiv>
  );
}

export default Home;
