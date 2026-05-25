import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { cMainColor } from '../../data/ColorDef';

interface MonthlyPlansProps {
  data: any;
  windowWidth: number;
  onPlanClick: (pkey: string) => void;
}

function MonthlyPlans({ data, windowWidth, onPlanClick }: MonthlyPlansProps) {
  const payKeyStyles: Record<
    string,
    {
      borderColor: string;
      backgroundGradient: string;
      buttonColor: string;
      buttonHover: string;
    }
  > = {
    cos_m6: {
      borderColor: '#555',
      backgroundGradient: 'linear-gradient(135deg, #000 70%, #666 100%)',
      buttonColor: '#666',
      buttonHover: '#666',
    },
    cos_m12: {
      borderColor: '#cf9e34',
      backgroundGradient: 'linear-gradient(135deg, #000 70%, #cf9e34 100%)',
      buttonColor: '#9e6e33',
      buttonHover: '#cf9e34',
    },
    cos_m1: {
      borderColor: '#ae6a54',
      backgroundGradient: 'linear-gradient(135deg, #000 70%, #ae6a54 100%)',
      buttonColor: '#ae6a54',
      buttonHover: '#ae6a54',
    },
    cos_m3: {
      borderColor: '#555',
      backgroundGradient: 'linear-gradient(135deg, #000 70%, #666 100%)',
      buttonColor: '#666',
      buttonHover: '#666',
    },
  };

  return (
    <>
      {data?.pay_benefits && (
        <Box
          sx={{
            width: windowWidth * 0.8,
            color: 'white',
            textAlign: 'left',
            fontSize: '18px',
            whiteSpace: 'pre-line',
            padding: '15px 15px',
            margin: '0 auto',
          }}
          dangerouslySetInnerHTML={{
            __html:
              data.pay_benefits
                .map((benefit: string) => benefit.replace(/\n/g, '<br>'))
                .join('<br>') || '',
          }}
        />
      )}

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 5,
          padding: '0 15px',
          maxWidth: '500px',
          width: windowWidth * 0.8,
          margin: '0 auto',
        }}
      >
        {data?.payment_case?.map((item: any, index: number) => {
          const styleByPayKey = payKeyStyles[item.pay_key] || {};
          const borderColor =
            styleByPayKey.borderColor || item['border-color'] || '#000';
          const backgroundColor =
            styleByPayKey.backgroundGradient ||
            item['background-color'] ||
            'black';

          return (
            <Box
              key={index}
              sx={{
                position: 'relative',
                background: backgroundColor,
                borderRadius: '12px',
                padding: '15px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1.5,
                border: `5px solid ${borderColor}`,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            >
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
                    objectFit: 'contain',
                  }}
                />
              </Box>

              <Typography
                sx={{
                  color: 'white',
                  fontSize: '26px',
                  fontWeight: 'bold',
                }}
              >
                {item.name}
              </Typography>

              <Box
                sx={{
                  color: 'white',
                  textAlign: 'center',
                  fontSize: '14px',
                  '& *': {
                    color: `${cMainColor} !important`,
                  },
                }}
                dangerouslySetInnerHTML={{ __html: item.discount_str }}
              />

              <Box
                sx={{
                  color: 'white',
                  textAlign: 'center',
                  fontSize: '14px',
                }}
                dangerouslySetInnerHTML={{ __html: item.description }}
              />

              <Button
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: styleByPayKey.buttonColor || '#aaa',
                  color: 'white',
                  '&:hover': {
                    backgroundColor:
                      styleByPayKey.buttonHover || 'rgba(71, 71, 71, 1)',
                  },
                }}
                onClick={() => onPlanClick(item.pay_key)}
              >
                立即购买
              </Button>
            </Box>
          );
        })}
      </Box>
    </>
  );
}

export default MonthlyPlans;
