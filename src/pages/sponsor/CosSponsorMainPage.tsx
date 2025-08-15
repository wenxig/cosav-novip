import React, { useState, useEffect } from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { cMainColor } from "../../data/ColorDef";
import TopTitleBar from "../../components/TopTitleBar";
import BaseMotionDiv from "../BaseMotionDiv";
import useSWR from "swr";
import { getOrderPlan } from "../../Shared/Api/CosApi";
import { ifOrderPlan } from "../../Shared/Api/interface/OrderInterface";
import SponsorCaseDialog from "../../components/sponsor/SponsorCaseDialog";
import { checkIsPay } from "../../Shared/function/AccountFunction";

function CosSponsorMainPage() {

  const [open, setOpen] = useState(false);
  const [selectedPKey, setSelectedPKey] = useState<string>("");

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


  const fetcher = async (): Promise<ifOrderPlan | undefined> => {
    console.log("fetcher");
    const res = await getOrderPlan();
    if(res.result === 'success'){
      return res.data;
    }
    return undefined;
  };

  const { data, error, isLoading } = useSWR('sponsorMain', fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 0, // 設為0表示不進行去重
    revalidateIfStale: true,
    revalidateOnMount: true,
    refreshInterval: 0, // 不自動刷新
    refreshWhenHidden: false,
    refreshWhenOffline: false
  });

  //const width = document.documentElement.clientWidth;

  const handlePlanClick = (pkey: string) => {
    setSelectedPKey(pkey);
    setOpen(true);
  }


  return (
    <BaseMotionDiv>
      <Box
        style={{
          backgroundColor: "black",
          width: windowWidth,
          minHeight: "200%",
          display: "grid",  
          gap: 12,
        }}
      >
        <TopTitleBar title="贊助方案" onBackClick={()=> checkIsPay()}/>
        {isLoading && <Box sx={{width: windowWidth * 0.8, margin: '0 auto'}}><CircularProgress /></Box>}

        {(!error && data && data.pay_benefits) &&
          <Box
            sx={{
              width: windowWidth * 0.8,
              color: 'white',
              textAlign: 'left',
              fontSize: '18px',
              whiteSpace: 'pre-line',
              padding: '15px 15px'
            }}
            dangerouslySetInnerHTML={{ 
              __html: data.pay_benefits
                .map(benefit => benefit.replace(/\n/g, '<br>'))
                .join('<br>') || '' 
            }}
          />
        }
        
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          gap: 5,
          padding: '0 15px',
          maxWidth: '500px',
          width: windowWidth * 0.8,
          margin: '0 auto'
        }}>
          {(!error && data && data.payment_case) &&
            data.payment_case.map((item: any, index: number) => (
              <Box 
                key={index}
                sx={{
                  position: 'relative',
                  //backgroundColor: 'white',
                  backgroundColor: `#${item['background-color']}` || 'white',
                  borderRadius: '12px',
                  padding: '15px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1.5,
                  border: `5px solid #${item['border-color'] || '#000'}`,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                {/* 左上角圖示 */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: -25,
                    left: -25,
                    width: 50,
                    height: 50,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                  }}
                >
                  <img 
                    src={item.icon} 
                    alt={item.name}
                    style={{
                      width: '70%',
                      height: '70%',
                      objectFit: 'contain'
                    }}
                  />
                </Box>

                {/* 方案名稱 */}
                <Typography 
                  sx={{ 
                    color: 'black',
                    fontSize: '26px',
                    fontWeight: 'bold',
                  }}
                >
                  {item.name}
                </Typography>

                {/* 折扣資訊 */}
                <Box
                  sx={{
                    color: 'black',
                    textAlign: 'center',
                    fontSize: '14px'
                  }}
                  dangerouslySetInnerHTML={{ __html: item.discount_str }}
                />

                {/* 方案描述 */}
                <Box
                  sx={{
                    color: 'black',
                    textAlign: 'center',
                    fontSize: '14px'
                  }}
                  dangerouslySetInnerHTML={{ __html: item.description }}
                />

                {/* 購買按鈕 */}
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    backgroundColor: 'black',
                    color: cMainColor,
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.8)'
                    }
                  }}
                  onClick={() => handlePlanClick(item.pay_key)}
                >
                  立即购买
                </Button>
              </Box>
            ))
          }
        </Box>

        <SponsorCaseDialog
          open={open}
          onConfirm={() => {}}
          onCancel={() => setOpen(false)}
          pfunc={data?.payment_func || []}
          note={data?.precautions || []}
          selectedPKey={selectedPKey}
        />
      </Box>

      <Box sx={{height:40}}></Box>
    </BaseMotionDiv>
  );
}

export default CosSponsorMainPage;
