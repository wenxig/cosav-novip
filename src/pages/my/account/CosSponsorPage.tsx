import React, { useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { cMainColor, cWhite60 } from "../../../data/ColorDef";
import TopTitleBar from "../../../components/TopTitleBar";
import BaseMotionDiv from "../../BaseMotionDiv";
import useSWR from "swr";
import { getAuthSponsorLists } from "../../../Shared/Api/CosApi";
import { ifSponsorList } from "../../../Shared/Api/interface/AuthInterface";
import { pEachPageCount } from "../../../data/ParameterDef";
import CosPagination from "../../../components/base/CosPagination";
import { useNavigate, useParams } from "react-router-dom";
//import { checkIsPay } from "../../../Shared/function/AccountFunction";

function CosSponsorPage() {

  const { page } = useParams();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(page ? parseInt(page) : 1);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    navigate(`/my/sponsor/${page}`,{replace:true});
  };

  const fetcher = async (): Promise<ifSponsorList | undefined> => {
    //checkIsPay();
    const res = await getAuthSponsorLists(currentPage - 1, pEachPageCount);
    if(res.result === 'success'){
      return res.data;
    }
    return undefined;
  };

  const { data, error, isLoading } = useSWR('sponsorList', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 1000 * 60, // 1分鐘
    revalidateIfStale: false
  });

  return (
    <BaseMotionDiv>
      <Box
        style={{
          backgroundColor: "black",
          width: document.documentElement.clientWidth,
          minHeight: "200%",
          display: "grid",  
          gap: 12,
        }}
      >
        <TopTitleBar title="贊助紀錄" />
        
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          gap: 2,
          padding: '0 15px'
        }}>
          {
          isLoading&&
            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
              <CircularProgress />
            </Box>
          }

          {/* 贊助紀錄 */}
          {(!error && data && data.lists) &&
            data.lists.map((item: any, index: number) => (
              <Box key={index}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 1
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography sx={{ color: 'white' }}>
                      {item.CID_name}
                    </Typography>
                    <Typography sx={{ color: cMainColor }}>
                      ¥ {item.amount}
                    </Typography>
                  </Box>
                  <Typography sx={{ 
                    color: item.status === "失敗" ? "red" : "lightGreen"
                  }}>
                    {item.status}
                  </Typography>
                </Box>

                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <Typography sx={{ color: cWhite60 }}>
                    付費方式: {item.pid_name}
                  </Typography>
                  <Typography sx={{ color: cWhite60 }}>
                    {item.ctime}
                  </Typography>
                </Box>

                {index < data.lists.length - 1 && (
                  <Box sx={{ 
                    borderBottom: '1px dashed #666',
                    marginTop: 2
                  }} />
                )}
              </Box>
            ))
          }
        </Box>

        {/* 頁面控制器 */}
        {(!error && data) && (
          <CosPagination
            totalItems={parseInt(data.totalCnt)}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
            pEachPageCount={pEachPageCount}
          />
        )}
      </Box>
    </BaseMotionDiv>
  );
}

export default CosSponsorPage;
