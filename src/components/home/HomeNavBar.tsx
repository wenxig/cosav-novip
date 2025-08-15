import { Box, Typography } from "@mui/material";
import { getCategories } from "../../data/DataCenter";
import FiberNewIcon from '@mui/icons-material/FiberNew';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { cMainColor, cBasePanel } from "../../data/ColorDef";
import { ifCategoryItem } from "../../Shared/Api/interface/CategoriesInterface";
import { useNavigate } from "react-router-dom";

const MyNavButton:React.FC<ifCategoryItem>=(category:ifCategoryItem)=>{
    const navigate = useNavigate();
    const iconSytle = {
        width: 28,
        height: 26,
        color: cMainColor,
        marginBottom: '-4px',
        marginTop: '2px'
    }
    return (
        <Box
            onClick={()=>{
                navigate(`/categoriesPage/${category.CHID}/0`);
            }}
            key={category.CHID}
            sx={{
                flex: 1,
                textAlign: 'center',
                textDecoration: 'none',
                color: '#333',
                padding: '0px',
                margin: '0px',
                minWidth: 0,
                //border: '1px solid rgba(224, 224, 224, 0.15)',
                borderRadius: '4px',
                '&:hover': {
                  backgroundColor: '#e0e0e0',
                  borderRadius: '4px',
                },
            }}
        >
            {category.icon && (
                <Box
                    sx={{
                        width: 24,
                        height: 24,
                        WebkitMaskImage: `url(${category.icon})`,
                        maskImage: `url(${category.icon})`,
                        WebkitMaskSize: 'contain',
                        maskSize: 'contain',
                        WebkitMaskRepeat: 'no-repeat',
                        maskRepeat: 'no-repeat',
                        WebkitMaskPosition: 'center',
                        maskPosition: 'center',
                        backgroundColor: cMainColor,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: '0 auto',
                        padding: '2px 0px',
                    }}
                />
            )}
            {category.iconData==="FiberNewIcon"&&(<FiberNewIcon sx={iconSytle} />)}
            {category.iconData==="LocalFireDepartmentIcon"&&(<LocalFireDepartmentIcon sx={iconSytle} />)}
            <Typography 
                noWrap
                sx={{
                    fontSize: '13px',
                    fontWeight: '800',
                    color: cMainColor,
                    padding: '0px 0px',
                    margin: '0px',
                }}
            >
                {category.name}
            </Typography>
        </Box>
    )
}

interface HomeNavBarProps {
    width?: number;
}



const HomeNavBar: React.FC<HomeNavBarProps> = ({ width = 1024 }) => {
    return (
        <Box
            component="div"
            sx={{
                width: width,
                display: 'flex',
                flexDirection: 'row',
                backgroundColor: cBasePanel,
                borderRadius: '4px',
                padding: '4px',
                margin: '0px',
                overflowX: 'auto',
                boxSizing: 'border-box',
            }}
        >
            {
                getCategories().filter((item:ifCategoryItem) => item.CHID !== "exclusive").map((item:ifCategoryItem) => (  
                    <MyNavButton key={item.CHID} {...item} /> 
                ))
            }
        </Box>
    )
}

export default HomeNavBar;