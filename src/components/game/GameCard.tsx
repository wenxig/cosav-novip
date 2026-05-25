import React from "react";
import { Box, Typography } from "@mui/material";
import { ifGameBaseInfo } from "../../Shared/Api/interface/GameInterface";
import AndroidIcon from "@mui/icons-material/Android";
import AppleIcon from "@mui/icons-material/Apple";
import LanguageIcon from "@mui/icons-material/Language";
import ComputerIcon from "@mui/icons-material/Computer";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import { cMainColor, cWhite80 } from "../../data/ColorDef";

interface CosGridCardProps {
  game: ifGameBaseInfo;
  rank?: number;
  width?: number;
  height?: number;
  backgroundColor?: string;
}

const getPlatformIcons = (types: string | string[]) => {
  const platformTypes = Array.isArray(types) ? types : [types];
  return platformTypes.map((type, index) => {
    switch (type) {
      case "app":
        return (
          <AndroidIcon
            key={index}
            sx={{
              fontSize: "16px",
              color: cWhite80,
              marginLeft: index > 0 ? "2px" : 0,
            }}
          />
        );
      case "ios":
        return (
          <AppleIcon
            key={index}
            sx={{
              fontSize: "16px",
              color: cWhite80,
              marginLeft: index > 0 ? "2px" : 0,
            }}
          />
        );
      case "h5":
        return (
          <LanguageIcon
            key={index}
            sx={{
              fontSize: "16px",
              color: cWhite80,
              marginLeft: index > 0 ? "2px" : 0,
            }}
          />
        );
      case "pc":
        return (
          <ComputerIcon
            key={index}
            sx={{
              fontSize: "16px",
              color: cWhite80,
              marginLeft: index > 0 ? "2px" : 0,
            }}
          />
        );
      case "mob":
        return (
          <PhoneAndroidIcon
            key={index}
            sx={{
              fontSize: "16px",
              color: cWhite80,
              marginLeft: index > 0 ? "2px" : 0,
            }}
          />
        );
      default:
        return null;
    }
  });
};

const GameCard: React.FC<CosGridCardProps> = ({
  game,
  rank,
  width = 250,
  backgroundColor = "black",
}) => {
  const imageHeight = width / 2; // 500x250 → 高度 = 寬度/2
  const titleHeight = imageHeight * 0.4;
  const componentHeight = Math.min(
    imageHeight + titleHeight,
    document.documentElement.clientHeight,
  );

  const containerStyle = {
    width: width,
    height: componentHeight,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    borderRadius: "4px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
    backgroundColor: backgroundColor,
  };

  const imageContainerStyle = {
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
    backgroundPosition: "center",
    borderRadius: "6px",
    width: width,
    height: imageHeight,
    backgroundColor: "black",
  };

  const ranklabelStyle = {
    position: "absolute",
    padding: "2px 4px",
    borderRadius: "4px",
    fontWeight: "bold",
    top: 0,
    left: -4,
    color: "#000",
    display: "flex",
    alignItems: "center",
  };

  const titleContainerStyle = {
    flex: 1,
    height: titleHeight,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 10px",
  };

  return (
    <Box
      sx={containerStyle}
      onClick={() => {
        if (game.mob_link) {
          window.open(game.mob_link, "_blank");
        }
      }}
    >
      {/* 圖片容器 */}
      <Box sx={{ position: "relative", borderRadius: "6px" }}>
        <Box
          sx={{
            backgroundImage: `url('${game.photo}')`,
            ...imageContainerStyle,
          }}
        />

        {/* 排名標籤 */}
        {rank && (
          <Box
            sx={{
              ...ranklabelStyle,
            }}
          >
            <Box
              component="img"
              src={"/icons/ranking.png"}
              alt={`第${rank}名`}
              sx={{
                width: rank === 1 ? 45 : 35,
                height: "auto",
                display: "block",
              }}
            />
            <Typography
              variant="caption"
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)", // 文字水平垂直置中
                fontWeight: "bold",
                color: "#630",
                fontSize: rank === 1 ? "18px" : "14px",
              }}
            >
              {rank}
            </Typography>
          </Box>
        )}
      </Box>

      {/* 標題 */}
      <Box sx={titleContainerStyle}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontWeight: "bold",
              color: "white",
              textAlign: "left",
              fontSize: rank === 1 || !rank ? "20px" : "12px",
            }}
          >
            {game.title}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              fontWeight: "bold",
              color: cMainColor,
              textAlign: "left",
            }}
          >
            {game.category}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>{getPlatformIcons(game.type)}</Box>
      </Box>
    </Box>
  );
};

export default GameCard;
