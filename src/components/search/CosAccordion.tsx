import React from "react";
import { Accordion, AccordionSummary, AccordionDetails, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { cBasePanel } from "../../data/ColorDef";

interface CosAccordionProps {
  title: string;
  children?: React.ReactNode;
}

const CosAccordion: React.FC<CosAccordionProps> = ({ title, children }) => {
  return (
    <Accordion
      sx={{
        backgroundColor: cBasePanel,
        color: "white",
        boxShadow: "none",
        mx: "8px",
        borderRadius: "10px",

        "&:before": {
          display: "none",
        },
        "&.Mui-expanded": {
          margin: " 0 8px ",
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
        sx={{
          color: "white",
          padding: "0 16px",
          minHeight: "40px",
          "&.Mui-expanded": {
            minHeight: "40px",
          },
          "& .MuiAccordionSummary-content": {
            margin: "8px 0",
            "&.Mui-expanded": {
              margin: "8px 0",
            },
          },
        }}
      >
        <Typography sx={{ fontWeight: 500 }}>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ padding: "0 16px 16px", mx: "8px" }}>{children}</AccordionDetails>
    </Accordion>
  );
};

export default CosAccordion;
