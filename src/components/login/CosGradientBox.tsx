import React from "react";
import Box from "@mui/material/Box";
interface LoginBaseBoxProps {
  children: React.ReactNode;
}

const CosGradientBox: React.FC<LoginBaseBoxProps> = ({ children }) => {
  const windowWidth = document.documentElement.clientWidth;

  return (
    <Box
      sx={{
        width: windowWidth,
        height: "100vh",
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        background: `
          linear-gradient(to bottom, rgba(255, 150, 230, 0.6), rgba(59, 49, 49, 0.8)),
          url("/icons/120.png")
        `,
        backgroundSize: "contain",
        backgroundPosition: "top",
        backgroundRepeat: "no-repeat",
      }}
    >
      {children}
    </Box>
  );
};

export default CosGradientBox;
