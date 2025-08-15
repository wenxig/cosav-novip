import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";


import BaseMotionDiv from "./BaseMotionDiv";
import BottomNavBar from "../components/BottomNavBar";
import LogoSearchBar from "../components/LogoSearchBar";
import { useNavigate, useParams } from "react-router-dom";
import SwiperAdBanner from "../components/home/SwiperAdBanner";
import { getGameCategories, getSiteSetting, setGameTop10 } from "../data/DataCenter";
import GamePageButtonBar from "../components/game/GamePageButtonBar";
import useSWR from "swr";
import { ifGameList } from "../Shared/Api/interface/GameInterface";
import GameTop10List from "../components/game/GameTop10List";
import GameList from "../components/game/GameList";
import { getGameList, getGameTop10 } from "../Shared/Api/CosApi";
import CosPagination from "../components/base/CosPagination";
import { API_DEDUPING_INTERVAL, pEachPageCountGame } from "../data/ParameterDef";

function GamePage() {
  const { cid, page } = useParams();
  const [currentCid, setCurrentCid] = useState(cid || '0');
  const [currentPage, setCurrentPage] = useState(parseInt(page||'1'));

  const navigate = useNavigate();
  const selectedCategory = getGameCategories().find(item => item.category_id === currentCid);

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

  const fetcher = async (): Promise<ifGameList | undefined> => {
    //初始game top 10資料
    if(currentCid === "0"){
      const gameTop10Data = await getGameTop10();
      if(gameTop10Data.result === 'success' && gameTop10Data.data){
        setGameTop10(gameTop10Data.data);
      }
    }
    
    //
    const gameList = await getGameList(`ct=${currentCid}`, currentPage-1,pEachPageCountGame);
    if(gameList.result === 'success'){
      return gameList.data;
    }
    return undefined;
  };

  const { data, error, isLoading } = useSWR(`GetGameList${currentCid}&${currentPage}`, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: API_DEDUPING_INTERVAL * 2,
    revalidateIfStale: false
  });

  useEffect(() => {
    // 滾動到頁面頂部
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  // 處理類別變動
  const handleCategoryChange = (newCid: string) => {
    setCurrentCid(newCid);
    setCurrentPage(1); // 重置頁碼
    navigate(`/game/${newCid}/${currentPage}`);
  };

  // 處理頁面變動
  const handlePageChange = (_event: React.ChangeEvent<unknown>, newPage: number) => {
    setCurrentPage(newPage);
    navigate(`/game/${currentCid}/${newPage}`);
    // 滾動到頁面頂部
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  //const windowWidth = document.documentElement.clientWidth;

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
        <SwiperAdBanner items={getSiteSetting().game_banners} />
        <GamePageButtonBar 
          gameCategories={getGameCategories()} 
          cid={currentCid} 
          onCategoryChange={handleCategoryChange}
        />

        
        

        {
          isLoading &&
            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
              <CircularProgress />
              <Typography>載入中...</Typography>
            </Box>
        }

        {
          error &&
            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
              <Typography>載入失敗</Typography>
            </Box>
        }

        {
          (!isLoading && data) &&
            <>
              {/* 遊戲Top10列表 */}
              {currentCid === "0" &&
                <GameTop10List />
              }
              {/* 遊戲列表 */}
              <GameList gameList={data} title={`${selectedCategory?.category_name}遊戲列表`} />
              {/* 頁面控制器 */}
              <CosPagination
                totalItems={parseInt(data.totalCnt) || 0}
                currentPage={currentPage}
                handlePageChange={handlePageChange}
                pEachPageCount={pEachPageCountGame}
              />
            </>
            
        }

        {/* 增加空間,避免底部導航被蓋住 */}
        <Box sx={{height:110}}></Box>
        
        <BottomNavBar page={'game'} />
        

        

      </Box>
    </BaseMotionDiv>
  );
}

export default GamePage;
