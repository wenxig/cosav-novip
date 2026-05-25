import { Box, Typography } from "@mui/material";
import { getCategories } from "../../data/DataCenter";
import { cMainColor } from "../../data/ColorDef";
import { ifCategoryItem } from "../../Shared/Api/interface/CategoriesInterface";
import { useNavigate } from "react-router-dom";

const MyNavButton: React.FC<ifCategoryItem> = (category: ifCategoryItem) => {
  const navigate = useNavigate();
  const customIcons: Record<string, string> = {
    cos: "/icons/cos.png",
    hot: "/icons/hot.png",
    new: "/icons/new.png",
    "8": "/icons/fc2.png",
    "2": "/icons/av.png",
    "1": "/icons/doujin.png",
  };
  const iconUrl = customIcons[category.CHID] || category.icon || category.photo || undefined;
  return (
    <Box
      onClick={() => {
        navigate(`/categoriesPage/${category.CHID}/0`);
      }}
      key={category.CHID}
      sx={{
        width: "100%",
        height: "100%",
        textAlign: "center",
        borderRadius: "8px",
        backgroundColor: "#090909ff",
        borderColor: cMainColor,
        borderWidth: "1px",
        borderStyle: "solid",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        "&:hover": {
          backgroundColor: "#f5f5f5",
        },
      }}
    >
      <Typography
        noWrap
        sx={{
          fontSize: "13px",
          fontWeight: "700",
          color: cMainColor,
          marginTop: "6px",
          paddingLeft: "12px",
        }}
      >
        {category.name}
      </Typography>

      {iconUrl && (
        <Box
          sx={{
            width: 32,
            height: 32,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "8px",
          }}
        >
          <img
            src={iconUrl}
            alt={category.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        </Box>
      )}
    </Box>
  );
};

interface HomeNavBarProps {
  width?: number;
}

const HomeNavBar: React.FC<HomeNavBarProps> = ({ width = 1024 }) => {
  return (
    <Box
      component="div"
      sx={{
        width: width,
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))", // 每排 3 個
        gap: "12px", // 間距
        borderRadius: "8px",
        boxSizing: "border-box",
        padding: "12px",
      }}
    >
      {getCategories()
        .filter((item: ifCategoryItem) => item.CHID !== "exclusive")
        .map((item: ifCategoryItem) => (
          <MyNavButton key={item.CHID} {...item} />
        ))}
    </Box>
  );
};

export default HomeNavBar;
