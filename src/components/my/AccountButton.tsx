import React from "react";
import { Button, Typography, SvgIconProps, Box } from "@mui/material";
import { cWhite60, cMainColor, cMainColor3 } from "../../data/ColorDef";

interface AlbumContentButtonProps {
  icon: React.ReactElement<SvgIconProps>;
  text: string;
  isEnable?: boolean;
  onClick?: () => void;
}

const AccountButton: React.FC<AlbumContentButtonProps> = ({
  icon,
  text,
  isEnable = false,
  onClick,
}) => {
  const maxWidth = document.documentElement.clientWidth;
  const buttonWidth = (maxWidth - 70) / 4;

  // 按鈕通用樣式
  const buttonStyle = {
    width: buttonWidth,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 0.5,
  };

  const iconStyle = {
    width: "30px",
    height: "30px",
  };

  const fontStyle = {
    fontSize: "13px",
    fontWeight: "bold",
    color: cWhite60,
    whiteSpace: "nowrap",
    overflow: "visible",
    textOverflow: "ellipsis",
    width: "100%",
    textAlign: "center",
  };

  return (
    <Button onClick={onClick} sx={buttonStyle}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(45deg,${cMainColor}, ${cMainColor3})`,
          borderRadius: 3,
          p: 1,
        }}
      >
        {React.cloneElement(icon, { sx: { ...icon.props.sx, ...iconStyle } })}
      </Box>

      <Typography sx={fontStyle}>{text}</Typography>
    </Button>
  );
};

export default AccountButton;
