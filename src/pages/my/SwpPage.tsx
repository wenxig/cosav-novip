import React, {useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import BaseMotionDiv from "../BaseMotionDiv";
import useSWR from "swr";

import { getSwp } from "../../Shared/Api/CosApi";
import { ifSiteSwgApiResponse } from "../../Shared/Api/interface/SiteInterface";
import TopTitleBar from "../../components/TopTitleBar";
import { useParams } from "react-router-dom";
import { API_DEDUPING_INTERVAL } from "../../data/ParameterDef";

const SwpData = [
  {
    page: 'advertise',
    title: '刊登广告',
  },
  {
    page: 'faq',
    title: '常见问题',
  },
  {
    page: 'privacy',
    title: '隐私政策&使用者条款',
  },
]
function SwpPage() {
  const { page } = useParams();

  const swpTitle = SwpData.find(item => item.page === page)?.title || ''

  const fetcher = async (): Promise<ifSiteSwgApiResponse> => {
    return await getSwp(page!);
  };

  // 獲取影片資訊
  const { data, error, isLoading } = useSWR(`swg ${page}`, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: API_DEDUPING_INTERVAL * 2, // 1小時 = 3600000毫秒
    revalidateIfStale: false
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // 加載中只顯示轉圈圈
  if (isLoading) {
    return (
      <BaseMotionDiv>
        <TopTitleBar title={swpTitle} />
        <Box
          style={{
            backgroundColor: "black",
            width: "100%",
            minHeight: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress size={60} thickness={4} sx={{ color: "white" }} />
        </Box>
      </BaseMotionDiv>
    );
  }

  // 錯誤顯示
  if (error || !data || !data.data) {
    
    return (
      <BaseMotionDiv>
        <TopTitleBar title={swpTitle} />
        <Box
          style={{
            backgroundColor: "black",
            width: "100%",
            minHeight: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h6" sx={{ color: "white" }}>
            載入失敗: {error}
          </Typography>
        </Box>
      </BaseMotionDiv>
    );
  }

  const maxWidth = document.documentElement.clientWidth;

  return (
    <BaseMotionDiv>
      <Box
        style={{
          backgroundColor: "black",
          width: maxWidth,
          minHeight: "100%",
          display: "grid",  
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TopTitleBar title={swpTitle} />
        <Box 
          sx={{
            width: maxWidth - 40,
            padding: '10px 20px',
            '& img': {
              maxWidth: '100%',
              height: 'auto'
            },
            '& a': {
              color: 'blue',
              textDecoration: 'underline'
            },
            '& div': {
              margin: '10px 0',
              fontSize: '22px',
              lineHeight: '1.5',
            }
          }}
        >
          <div dangerouslySetInnerHTML={{ __html: data.data }} />
        </Box>
      </Box>
    </BaseMotionDiv>
  );
}

export default SwpPage;
