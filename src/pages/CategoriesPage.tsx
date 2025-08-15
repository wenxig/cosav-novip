import React, {useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import BaseMotionDiv from "./BaseMotionDiv";
import { useNavigate, useParams } from "react-router-dom";
import CategoriesPageButtonBar from "../components/categories/CategoriesPageButtonBar";
import { getCategories } from "../data/DataCenter";
import TopSearchBar from "../components/LogoSearchBar";
import BottomNavBar from "../components/BottomNavBar";
import { getAlbumList, getVideoList } from "../Shared/Api/CosApi";
import { API_DEDUPING_INTERVAL, pEachPageCount } from "../data/ParameterDef";
import CosGridFrame from "../components/CosGridFrame";
import { ifVideoList } from "../Shared/Api/interface/VideoInterface";
import useSWR from "swr";
import { ifAlbumList } from "../Shared/Api/interface/AlbumInterface";
import CosPagination from "../components/base/CosPagination";

export interface ifQueryResult {
  videoList?: ifVideoList;
  albumList?: ifAlbumList;
  totalItems?: number;
}

function CategoriesPage() {
  const { chid, sub_chid , page} = useParams();
  const navigate = useNavigate();
  //const [currentChid, setCurrentChid] = useState(chid || 'new');
  //const [currentSubChid, setCurrentSubChid] = useState(sub_chid || '0');
  //const [currentPage, setCurrentPage] = useState(page ? parseInt(page) : 1);
  const currentChid = chid || 'new';
  const currentSubChid = sub_chid || '0';
  const currentPage =page ? parseInt(page) : 1;
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
  //const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    // 滾動到頁面頂部
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);
  
  const categories = getCategories();
  const fetcher = async (): Promise<ifQueryResult | undefined> => {
    const selectedCategory = categories.find(item => item.CHID === currentChid);
    if(currentChid === 'cos'){
      const res = await getAlbumList("",currentPage - 1,pEachPageCount);
      if(res.result === 'success'){
        //setTotalItems(parseInt(res.data!.totalCnt));
        return {
          albumList: res.data,
          totalItems: parseInt(res.data!.totalCnt)
        };
      }
    }else if(selectedCategory?.has_sub === false){
      const res = await getVideoList(selectedCategory.queryStr!,currentPage-1,pEachPageCount);
      if(res.result === 'success'){
        //setTotalItems(parseInt(res.data!.totalCnt));
        console.log(selectedCategory.queryStr,res.data?.list);
        return {
          videoList: res.data,
          totalItems: parseInt(res.data!.totalCnt)
        };
      }
    }else{
      const res = await getVideoList(`ct=${currentSubChid==='0'?currentChid:currentSubChid}`,currentPage-1,pEachPageCount);
      if(res.result === 'success'){
        //setTotalItems(parseInt(res.data!.totalCnt));
        console.log(`ct=${currentSubChid==='0'?currentChid:currentSubChid}`,res.data?.list);
        return {
          videoList: res.data,
          totalItems: parseInt(res.data!.totalCnt)
        };
      }
    }
    return undefined;
  };

  const { data, error, isLoading } = useSWR(`GetVideoList${currentChid}&${currentSubChid}&${currentPage}`, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: API_DEDUPING_INTERVAL, 
    revalidateIfStale: false
  });

  // 處理類別變動
  const handleCategoryChange = (newChid: string, newSubChid: string) => {
    //setCurrentPage(1); // 重置頁碼
    //if(newSubChid !== currentSubChid){
      //setCurrentSubChid(newSubChid);
    //}
    //if(newChid !== currentChid){
      //setCurrentChid(newChid);
    //}
    
    navigate(`/categoriesPage/${newChid}/${newSubChid}/${1}`);
  };
  
  // 處理頁面變動
  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    //setCurrentPage(value);
    navigate(`/categoriesPage/${currentChid}/${currentSubChid}/${value}`);
  };

  

  return (
    <BaseMotionDiv>
      <Box
        style={{
          backgroundColor: "black",
          width: windowWidth,
          minHeight: "100%",
          display: "grid",  
          gap: 12,//設定子元件間距
        }}
      >
        <TopSearchBar/>
        <CategoriesPageButtonBar 
          categoryItems={categories} 
          chid={currentChid} 
          sub_chid={currentSubChid}
          onCategoryChange={handleCategoryChange}
        />
        {
          isLoading&&
            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
              <CircularProgress />
            </Box>
        }

        {/* 影片列表 */}
        {
        (!error&&data&&data.videoList)&&
          <CosGridFrame
            items={data.videoList.list!}
            column={2}
          />
        }

        {/* 相簿列表 */}
        {(!error&&data&&data.albumList)&&
          <CosGridFrame
            albums={data.albumList.list!}
            column={2}
          />
        }
        
        {/* 頁面控制器 */}
        {(!error && data) && (
          <CosPagination
            totalItems={data.totalItems || 0}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
            pEachPageCount={pEachPageCount}
          />
        )}
        
        {/* 增加空間,避免底部導航被蓋住 */}
        <Box sx={{height:60}}></Box>
        {/* 底部導航 */}
        <BottomNavBar page={'category'} />
      </Box>
    </BaseMotionDiv>
  );
}

export default CategoriesPage;
