import React, { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import TopTitleBar from "../../components/TopTitleBar";
import BaseMotionDiv from "../BaseMotionDiv";
import useSWR from "swr";
import { getOrderPlan } from "../../Shared/Api/CosApi";
import { ifOrderPlan } from "../../Shared/Api/interface/OrderInterface";
import SponsorCaseDialog from "../../components/sponsor/SponsorCaseDialog";
import { checkIsPay } from "../../Shared/function/AccountFunction";
import SponsorTabs from "../../components/sponsor/SponsorTabs";
import MonthlyPlans from "../../components/sponsor/MonthlyPlans";
import DownloadTicketPlans from "../../components/sponsor/DownloadTicketPlans";
import { useLocation } from "react-router-dom";

type SponsorTabType = "monthly" | "download";

function CosSponsorMainPage() {
  const [open, setOpen] = useState(false);
  const [selectedPKey, setSelectedPKey] = useState<string>("");
  const [activeTab, setActiveTab] = useState<SponsorTabType>("monthly");
  const [windowWidth, setWindowWidth] = useState(document.documentElement.clientWidth);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(document.documentElement.clientWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const fetcher = async (): Promise<ifOrderPlan | undefined> => {
    const res = await getOrderPlan();
    if (res.result === "success") {
      return res.data;
    }
    return undefined;
  };

  const { data, error, isLoading } = useSWR("sponsorMain", fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 0,
    revalidateIfStale: true,
    revalidateOnMount: true,
    refreshInterval: 0,
    refreshWhenHidden: false,
    refreshWhenOffline: false,
  });

  const handlePlanClick = (pkey: string) => {
    setSelectedPKey(pkey);
    setOpen(true);
  };

  useEffect(() => {
    if (location.state?.tab === "download") {
      setActiveTab("download");
    }
  }, [location.state]);

  return (
    <BaseMotionDiv>
      <Box
        sx={{
          backgroundColor: "black",
          width: windowWidth,
          minHeight: "200%",
          display: "grid",
          gap: 1.5,
        }}
      >
        <TopTitleBar title="贊助方案" onBackClick={() => checkIsPay()} />

        <SponsorTabs activeTab={activeTab} onChange={setActiveTab} />
        {isLoading && (
          <Box sx={{ width: windowWidth * 0.8, margin: "0 auto" }}>
            <CircularProgress />
          </Box>
        )}

        {/** 月费方案 */}
        {!isLoading && !error && activeTab === "monthly" && (
          <MonthlyPlans data={data} windowWidth={windowWidth} onPlanClick={handlePlanClick} />
        )}

        {/** 下载券 */}
        {/*!isLoading && activeTab === 'download' &&
          <DownloadTicketPlans 
            data={data!}
            windowWidth={windowWidth}
            onPlanClick={handlePlanClick}
          />
        */}

        {/** 购买方案弹窗 */}
        <SponsorCaseDialog
          open={open}
          onConfirm={() => {}}
          onCancel={() => setOpen(false)}
          pfunc={data?.payment_func || []}
          note={data?.precautions || []}
          selectedPKey={selectedPKey}
        />
      </Box>

      <Box sx={{ height: 40 }} />
    </BaseMotionDiv>
  );
}

export default CosSponsorMainPage;
