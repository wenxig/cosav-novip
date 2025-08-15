import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface CosAccordionProps {
  title: string;
  children?: React.ReactNode;
}

const CosAccordion: React.FC<CosAccordionProps> = ({ title, children }) => {
  return (
    <Accordion
      sx={{
        backgroundColor: 'black',
        color: 'white',
        boxShadow: 'none',
        borderTop: '1px solid white',
        borderBottom: '1px solid white',
        '&:before': {
          display: 'none',
        },
        '&.Mui-expanded': {
          margin: 0,
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{color: 'white'}} />}
        sx={{
          color: 'white',
          padding: '0 16px',
          minHeight: '40px',
          '&.Mui-expanded': {
            minHeight: '40px',
          },
          '& .MuiAccordionSummary-content': {
            margin: '8px 0',
            '&.Mui-expanded': {
              margin: '8px 0',
            },
          },
        }}
      >
        <Typography sx={{ fontWeight: 500 }}>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ padding: '0 16px 16px' }}>
        {children}
      </AccordionDetails>
    </Accordion>
  );
};

export default CosAccordion; 