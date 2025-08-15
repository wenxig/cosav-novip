import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Box } from '@mui/material';
import { cMainColor } from '../../data/ColorDef';

interface BannerItem {
  link: string;
  image: string;
  adv_sale_type: string;
}

interface SwiperAdBannerProps {
  items: BannerItem[];
  width?: number;
  height?: number;
}

const SwiperAdBanner: React.FC<SwiperAdBannerProps> = ({
  items = [],
  width = document.documentElement.clientWidth,
  //height = 300,
}) => {
  let componentWidth = Math.min(width-20,850) ;
  let componentHeight = componentWidth / 850 * 260;

  //保証高度只占畫面的1/3
  if(componentHeight > document.documentElement.clientHeight / 3){
    componentHeight = document.documentElement.clientHeight / 3;
    componentWidth = componentHeight * 850 / 260;
  }

  const handleImageClick = (link: string) => {
    window.open(link, '_blank');
  };

  const adIconButtonStyle = {
    position: 'absolute' as const,
    top: '5px',
    left: '10px',
    zIndex: 10,
    width: '24px',
    height: '24px',
    backgroundColor: cMainColor,
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
    }
  };

  return (
    <Box 
      sx={{ 
        width: componentWidth, 
        height: componentHeight,
        padding: '0 10px',
        transformOrigin: 'center center',
        transition: 'transform 0.3s ease-in-out',
        '& .swiper-pagination-bullet': {
          backgroundColor: 'white',
          opacity: 0.5,
          '&.swiper-pagination-bullet-active': {
            backgroundColor: cMainColor,
            opacity: 1,
          },
        },
        '& .swiper-button-next, & .swiper-button-prev': {
          color: cMainColor,
          '&::after': {
            fontSize: '2rem',
            fontWeight: 'bold',
          },
        },
        '& li': {
          margin: '2px 0',  // 上下間距設為 2px
          padding: '2px 0', // 上下內距設為 2px
        },
      }}
    >
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        style={{ width: componentWidth, height: '100%' }}
      >
        {items.map((item, index) => (
          <SwiperSlide key={index}>
            <Box>
              {
                item.adv_sale_type && item.adv_sale_type !== 'own' && (
                  <Box 
                    component="div"
                    sx={adIconButtonStyle}
                  >
                    AD
                  </Box>
                )
              }
              <Box
                component="img"
                src={item.image}
                alt={`Slide ${index + 1}`}
                onClick={() => handleImageClick(item.link)}
                sx={{
                  width: componentWidth,
                  height: '100%',
                  objectFit: 'scale-down',
                  cursor: 'pointer',
                  backgroundColor: '#000',
                }}
              />
              
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default SwiperAdBanner; 
