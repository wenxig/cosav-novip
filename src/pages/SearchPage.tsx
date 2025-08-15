import React, {useState, useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import BaseMotionDiv from "./BaseMotionDiv";
import { useNavigate, useParams } from "react-router-dom";
import { getAlbumList, getVideoList, getVideoRecommend } from "../Shared/Api/CosApi";
import { pEachPageCount, MAX_HISTORY, SEARCH_HISTORY_KEY, API_DEDUPING_INTERVAL } from "../data/ParameterDef";
import CosGridFrame from "../components/CosGridFrame";
import { ifVideoList } from "../Shared/Api/interface/VideoInterface";
import useSWR from "swr";
import { cMainColor } from "../data/ColorDef";
import { ifAlbumList } from "../Shared/Api/interface/AlbumInterface";
import CosPagination from "../components/base/CosPagination";
import SearchTopBar from "../components/search/SearchTopBar";
import CosAccordion from "../components/search/CosAccordion";

export interface ifQueryResult {
  videoList?: ifVideoList;
  albumList?: ifAlbumList;
  totalItems: number;
}

function SearchPage() {
  const navigate = useNavigate();
  const { type,queryStr,page } = useParams();
  const [queryType  , setQueryType] = useState(type||'video');
  const [queryString  , setQueryString] = useState(queryStr||'');
  
  const [currentPage, setCurrentPage] = useState(page?parseInt(page):1);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

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

  // 監聽路由變化，自動滾動到頂部
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'auto'
    });
  }, [type, queryStr, page]);

  useEffect(() => {
    // 從本地存儲讀取搜尋歷史
    try {
      const savedHistory = localStorage.getItem(SEARCH_HISTORY_KEY);
      if (savedHistory) {
        setSearchHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error('讀取搜尋歷史失敗:', error);
    }
  }, []);

  const fetcher = async (): Promise<ifQueryResult | undefined> => {
    // 如果搜尋字串為空，則顯示推薦影片
    if(queryString === ''){ 
      const res = await getVideoRecommend();
      if(res.result === 'success'){
        return {
          videoList: {list:res.data!,lastpage:1,totalCnt:`${res.data!.length}`},
          totalItems:res.data!.length
        };
      }
    }
    let query = queryString;

    // 搜尋影片
    if(queryType === 'video'){
      const res = await getVideoList(query,currentPage-1,pEachPageCount);
      if(res.result === 'success'){
        //setTotalItems(parseInt(res.data!.totalCnt));
        return {videoList: res.data ,totalItems: parseInt(res.data!.totalCnt)};
      }
    }

    // 搜尋相簿
    if(queryType === 'album'){
      const res = await getAlbumList(query,currentPage-1,pEachPageCount);
      if(res.result === 'success'){
        //setTotalItems(parseInt(res.data!.totalCnt));
        return {albumList: res.data ,totalItems: parseInt(res.data!.totalCnt)};
      }
    }
    return undefined;
  };

  const { data, error, isLoading } = useSWR(`SearchList${queryType}&${queryString}&${currentPage}`, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: API_DEDUPING_INTERVAL, //
    revalidateIfStale: false
  });
  
  // 處理頁面變動
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    navigate(`/search/${queryType}/${queryString}/${value}`,{replace:true});
    
  };

  //const windowWidth = document.documentElement.clientWidth;

  const handleSearch = (type: string,text: string) => {
    const qString = text.trim();
    if (!qString) return;//如果搜尋字串為空，則不進行搜尋
    if (`kw=${qString}` === `${queryString}`) return;//如果搜尋字串與上一次相同，則不進行搜尋

    setQueryType(type);
    setQueryString(text);
    setCurrentPage(1);

    navigate(`/search/${type}/${text}/${1}`,{replace:true});

    try {
      setSearchHistory(prevHistory => {
        // 移除重複項
        const filteredHistory = prevHistory.filter(item => item !== text);
        // 添加新項目到開頭
        const newHistory = [text, ...filteredHistory];
        // 限制數量
        const limitedHistory = newHistory.slice(0, MAX_HISTORY);
        // 保存到本地存儲
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(limitedHistory));
        return limitedHistory;
      });
    } catch (error) {
      console.error('保存搜尋歷史失敗:', error);
    }
  };

  const parms = queryString.split("&");
  const kwStr = parms.find(item=>item.startsWith('kw='))?.replace('kw=','');
  const tagStr = parms.find(item=>item.startsWith('tags='))?.replace('tags=','');

  return (
    <BaseMotionDiv>
      <Box
        style={{
          backgroundColor: "black",
          width: windowWidth,
          minHeight: "200%",
          display: "grid",  
          gap: 12,//設定子元件間距
        }}
      >
        <SearchTopBar onSearch={handleSearch}/>

        {
          !queryString&&
            <CosAccordion title="如何搜寻？">
              <Typography>
                搜寻[巨乳+人妻]=显示巨乳且是人妻
              </Typography>
              <Typography>
                搜寻[巨乳-人妻]=显示巨乳但不含人妻
              </Typography>
              <Typography>
                搜寻[巨乳 人妻]=显示巨乳或人妻
              </Typography>
            </CosAccordion>
        }
        <CosAccordion title="搜寻记录">
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            gap: '4px',
            padding: '8px 0'
          }}>
            {searchHistory.map((item, index) => (
              <React.Fragment key={index}>
                <Typography
                  onClick={() => handleSearch(queryType,item)}
                  sx={{
                    border: '1px solid #FFADF2',
                    padding: '2px 4px',
                    color: cMainColor,
                    cursor: 'pointer',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  {item.replace('kw=','')}
                </Typography>
                {index < searchHistory.length - 1 && (
                  <Typography sx={{ color: 'white' }}>,</Typography>
                )}
              </React.Fragment>
            ))}
          </Box>
        </CosAccordion>
        
        {
          queryString&&!isLoading&&
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            gap: '2px',
            padding: '8px 0',
            justifyContent: 'center'
          }}>
            <Typography>搜寻</Typography>
            <Typography sx={{color:'red'}}>{queryType==='video'?'视频':'相簿'}</Typography>
            {
              kwStr&&
              <>
                <Typography>关键字[</Typography>
                <Typography sx={{color:cMainColor}}>{kwStr}</Typography>
                <Typography>]</Typography>
              </>
            }
            {
              tagStr&&
              <>
                <Typography>标签[</Typography>
                <Typography sx={{color:cMainColor}}>{tagStr}</Typography>
                <Typography>]</Typography>
              </>
            }
            <Typography>,共</Typography>
            <Typography>{data?.totalItems}</Typography>
            <Typography>条结果</Typography>
          </Box>
        }

        {
          isLoading&&
            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
              <CircularProgress />
            </Box>
        }


        {
          !isLoading&&queryString===''&&
          <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
            <Typography variant="h5" sx={{color: 'white',fontWeight:'bold'}}>相關推薦</Typography>
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
        {(!error && data && queryString) && (
          <CosPagination
            totalItems={data.totalItems}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
            pEachPageCount={pEachPageCount}
          />
        )}
        
        {/* 增加空間,避免底部導航被蓋住 */}
        <Box sx={{height:20}}></Box>
      </Box>
    </BaseMotionDiv>
  );
}

export default SearchPage;
