import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  Paper,
  IconButton,
} from "@mui/material";
import useSWR from "swr";
import { useNavigate } from "react-router-dom";
import BaseMotionDiv from "./BaseMotionDiv";
import { setCategories, setGameCategories, setSiteSetting, setUserInfo } from "../data/DataCenter";
import { getGameCategories, getSiteSetting ,getVideoCategories, getVideoCategoriesSub, sendAuthLogin} from "../Shared/Api/CosApi";
import CosAdIFrame from "../components/CosAdIFrame";
import CloseIcon from "@mui/icons-material/Close";
import { cMainColor } from "../data/ColorDef";
import { ifCategoryItem } from "../Shared/Api/interface/CategoriesInterface";
import { API_DEDUPING_INTERVAL, pInitCountDownSec } from "../data/ParameterDef";
import { clearLoginInfo, getLoginInfo, storeLoginInfo } from "../Shared/function/AccountFunction";
import { ifSiteSetting } from "../Shared/Api/interface/SiteInterface";
import packageJson from '../../package.json';
import CosNewVersion from "../components/base/check/CosNewVersion";

interface InitDataResponse {
  success: boolean;
  message: string;
  isHaveNewVersion?: boolean;
  initFailed?: boolean;
}

const InitData: React.FC = () => {
  const navigate = useNavigate();

  const checkLogin = async ()=>{
    const loginInfo = getLoginInfo();
    if(loginInfo){
      const res = await sendAuthLogin(loginInfo.account,loginInfo.password);
      //呼叫API失敗
      if (res.result === 'fail' || !res.data) {
        return;
      }

      //API回傳失敗訊息
      if (!res.data || !res.data.uid) {
        clearLoginInfo();
        return;
      }

      // 設置使用者資訊
      setUserInfo(res.data);

      // 更新登入資訊
      storeLoginInfo(loginInfo.account, loginInfo.password);
    }
  }


  const checkIsHaveNewVersion = async (siteData:ifSiteSetting)=>{
    const currentVersion = siteData.react_version ?? siteData.version;
    const packageVersion = packageJson.version;

    console.log(currentVersion, packageVersion);

    if(packageVersion === currentVersion){
      return false;
    }

    const nowVersionParts = packageVersion.split('.');
    const currentVersionParts = currentVersion.split('.');

    for (let i = 0; i < nowVersionParts.length; i++) {
        const nowPart = parseInt(nowVersionParts[i]);
        const currentPart = parseInt(currentVersionParts[i]);
        console.log(nowPart, currentPart);

        if (nowPart > currentPart) {
            return false;
        }
        if(nowPart < currentPart){
          return true;
        }
    }

    return true;

  }

  //初始化資料
  const fetcher = async (): Promise<InitDataResponse> => {
    //初始setting資料
    const siteData = await getSiteSetting();
    if(siteData.result === 'fail' || !siteData.data){
      return { success: false, message: siteData.message! };
    }
    setSiteSetting(siteData.data);

    //判斷版本是否需要更新
    const isHaveNewVersion = await checkIsHaveNewVersion(siteData.data);
    if(isHaveNewVersion){
      console.log("有新版本，請更新");
      return { success: false, isHaveNewVersion: true, message: "有新版本，请更新", };
    }

    //初始video categories資料
    const categoriesData = await getVideoCategories();
    if(categoriesData.result === 'fail' || !categoriesData.data){
      return { success: false, message: categoriesData.message!,};
    }
    
    const categories = categoriesData.data;
    //初始video categories sub資料
    categories.forEach(async (category:ifCategoryItem) => {
      if(category.has_sub){
        const subCategoriesData = await getVideoCategoriesSub(category.CHID);
        if(subCategoriesData.result === 'success' && subCategoriesData.data){
          category.subCategories = subCategoriesData.data;
        }   
      }
    });
    setCategories(categories);

    //初始game categories資料
    const gameCategoriesData = await getGameCategories();
    if(gameCategoriesData.result === 'fail' || !gameCategoriesData.data){
      return { success: false, message: gameCategoriesData.message!,};
    }
    setGameCategories(gameCategoriesData.data);

    //初始game top 10資料
    //const gameTop10Data = await getGameTop10();
    //if(gameTop10Data.result === 'fail' || !gameTop10Data.data){
    //  return { success: false, message: gameTop10Data.message! };
    //}
    //setGameTop10(gameTop10Data.data);

    await checkLogin();

    //初始完成
    return { success: true, message: "初始化成功", };
  };

  const { data, error, isLoading } = useSWR("initData", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: API_DEDUPING_INTERVAL, // 1小時 = 3600000毫秒
    revalidateIfStale: false
  });

  const [countdown, setCountdown] = useState(pInitCountDownSec);
  const [status, setStatus] = useState("资料初始中，请稍候");
  const [showCloseButton, setShowCloseButton] = useState(false);

  useEffect(() => {
    if (data?.success) {
      handleClose()
    }
  }, [data]);

  const handleClose = () => {
    navigate("/home");
  };

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000000",
  };

  const paperStyle = {
    padding: "15px",
    maxWidth: "400px",
    width: "90%",
    textAlign: "center" as const,
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
    backgroundColor: "#000000",
    color: "#ffffff",
  };

  const loadingStyle = {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: "15px",
  };

  const closeButtonStyle = {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    backgroundColor: cMainColor,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "#ffffff",
    transition: "transform 0.2s",
    "&:hover": {
      transform: "scale(1.1)",
    },
  };

  const progressStyle = {
    width: "30px",
    height: "30px",
    color: 'white',
    "& .MuiCircularProgress-circle": {
      strokeWidth: 3,
    },
  };

  const progressContainerStyle = {
    position: "relative" as const,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const progressTextStyle = {
    position: "absolute" as const,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const ads = useMemo(() => {
    return (
      <div>
      </div>
    );
  }, []); // 空依賴數組確保只執行一次

  const showIniting = () => {
    return (
      <Paper sx={paperStyle}>
        <Box sx={loadingStyle}>
          <CircularProgress sx={progressStyle} />
          <Typography variant="h6" sx={{ color: "#ffffff", fontSize: "16px" }}>
            {status}
          </Typography>
        </Box>
      </Paper>
    );
  };

  const showError = () => {
    return (
      <Typography color="error" variant="h6" sx={{padding: "20px",fontSize: "26px"}}>
        發生錯誤：{error.message}
      </Typography>
    );
  };

  const showNewVersion = () => {
    return (
      <Typography color="error" variant="h6" sx={{padding: "20px",fontSize: "26px"}}>
        有新版本，請更新
      </Typography>
    );
  };

  const showSuccess = () => {
    return (
      <Paper sx={paperStyle}>
        <Box sx={loadingStyle}>
          {showCloseButton ? (
            <IconButton onClick={handleClose} sx={closeButtonStyle} aria-label="close" >
              <CloseIcon />
            </IconButton>
          ) : (
            <Box sx={progressContainerStyle}>
              <CircularProgress
                variant="determinate"
                value={countdown * (100 / pInitCountDownSec)}
                thickness={3}
                disableShrink={true}
                sx={progressStyle}
              />
              <Box sx={progressTextStyle}>
                <Typography
                  component="div"
                  fontSize={18}
                  sx={{
                    color: cMainColor,
                    fontWeight: "bold",
                    transition: 'all 0.25s ease-in-out',
                  }}
                >
                  {countdown}
                </Typography>
              </Box>
            </Box>
          )}
          <Typography
            variant="h5"
            sx={{
              color: cMainColor,
              fontWeight: "bold",
              whiteSpace: "pre-line",
              fontSize: "16px",
            }}
          >
            {status}
          </Typography>
        </Box>
      </Paper>
    );
  };

  return (
    <BaseMotionDiv>
      <Box sx={{height:10}}/>
      <Box sx={containerStyle}>
        {isLoading && showIniting()}
        {error && showError()}
        {!isLoading && !data?.isHaveNewVersion && showSuccess()}
        {data?.isHaveNewVersion && showNewVersion()}
        {ads}
        {
          data && data?.isHaveNewVersion && 
          <CosNewVersion open={true} onCancel={()=>{}} />
        }
      </Box>
    </BaseMotionDiv>
  );
};

export default InitData;
