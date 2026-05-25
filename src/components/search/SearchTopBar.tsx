import React, { useState } from "react";
import { Box, Button, IconButton, Select, MenuItem } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import { useLocation, useNavigate } from "react-router-dom";
import { cBasePanel, cMainColor, cMainColor3 } from "../../data/ColorDef";
import { tempData } from "../../Shared/function/AccountFunction";

interface SearchTopBarProps {
  selectType?: string;
  backUrl?: string;
  onSearch?: (type: string, text: string) => void;
}

const SearchTopBar: React.FC<SearchTopBarProps> = ({ selectType = "video", backUrl, onSearch }) => {
  const navigate = useNavigate();
  //const location = useLocation();
  const [searchType, setSearchType] = useState(selectType);
  const [searchText, setSearchText] = useState("");

  //const nowHistoryLength = window.history.length;

  const handleBackClick = () => {
    navigate(tempData.searchBackUrl);
    /*if (backUrl) {
      navigate(backUrl);
    } else {
      //navigate(-1); // 返回上一頁
      // 檢查是否有從前一頁傳來的路徑
      if(window.history.length > nowHistoryLength){
        // 檢查是否有從前一頁傳來的路徑
        const from = location.state?.from;
        if (from) {
          // 有記錄的來源頁面，導航回去
          navigate(from);
        } else {
          // 沒有記錄，使用預設路徑
          navigate(-1);
        }
      }else{
        navigate("/home");
      }
    }*/
  };

  const handleSearchTypeChange = (event: any) => {
    setSearchType(event.target.value);
  };

  const handleSearch = () => {
    if (searchText.trim()) {
      const qString = `kw=${searchText.trim()}`;
      if (onSearch) {
        onSearch(searchType, qString);
      }

      setSearchText("");
    }
  };

  const containerHeight = 50;
  const iconSize = 38;
  const windowWidth = document.documentElement.clientWidth;

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: windowWidth,
          height: containerHeight,
          backgroundColor: cBasePanel,
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          padding: "5px 10px",
          boxSizing: "border-box",
        }}
      >
        {/* 返回按鈕 - 靠左對齊 */}
        <IconButton
          onClick={handleBackClick}
          sx={{
            color: cMainColor,
            padding: "8px",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            border: `1px solid ${cMainColor}`, // 整體外框
            borderRadius: "6px",
            overflow: "hidden", // 讓子元素緊貼
            height: "36px",
            backgroundColor: cBasePanel, // 外層背景
            marginRight: "8px",
          }}
        >
          {/* 下拉選單 */}
          <Select
            value={searchType}
            onChange={handleSearchTypeChange}
            sx={{
              height: "100%",
              minWidth: "80px",
              backgroundColor: cBasePanel,
              borderRight: `1px solid ${cMainColor}`, // 與輸入框分隔線
              borderRadius: 0, // 移除圓角
              color: "white",
              "& .MuiOutlinedInput-notchedOutline": { border: "none" }, // 移除內建邊框
              "& .MuiSelect-select": {
                padding: "0 8px",
              },
              "& .MuiSvgIcon-root": {
                // ← 控制箭頭顏色
                color: "white",
              },
            }}
          >
            <MenuItem value="video">视频</MenuItem>
            <MenuItem value="album">相簿</MenuItem>
          </Select>

          {/* 搜尋輸入框 */}
          <Box
            sx={{
              flex: 1,
              position: "relative",
              display: "flex",
              alignItems: "center",
            }}
          >
            <SearchIcon
              sx={{
                position: "absolute",
                left: "10px",
                color: cMainColor,
                fontSize: "20px",
                pointerEvents: "none",
              }}
            />
            <input
              type="text"
              placeholder="请输入搜寻关键字"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              style={{
                width: "100%",
                height: "100%",
                border: "none", // 移除內框
                outline: "none",
                padding: "0 8px 0 32px", // 預留 icon 空間
                fontSize: "16px",
                backgroundColor: cBasePanel,
                color: "white",
              }}
            />
          </Box>
        </Box>

        {/* 搜尋按鈕 */}
        <Button
          onClick={handleSearch}
          sx={{
            height: iconSize,
            padding: "4px 4px",
            width: "65px",
            minWidth: iconSize,
            borderRadius: "5px",
            backgroundColor: cMainColor3,
            color: "white",
            fontSize: "16px",
            "&:hover": {
              backgroundColor: cMainColor3,
            },
          }}
        >
          搜寻
        </Button>
      </Box>
      {/* 添加佔位元素 */}
      <Box sx={{ height: containerHeight }} />
    </>
  );
};

export default SearchTopBar;
