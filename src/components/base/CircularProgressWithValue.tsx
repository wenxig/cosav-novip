import * as React from "react";
import CircularProgress, {
  CircularProgressProps,
} from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { cMainColor } from "../../data/ColorDef";

function CircularProgressWithLabel(
  props: CircularProgressProps & { nowProgress: number; maxProgress: number ,size? : number}
) {
  const progressStyle = {
    color: cMainColor,
    margin: "4px",
    "& .MuiCircularProgress-circle": {
      strokeWidth: 3,
    },
  };
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        size={props.size || 30}
        variant="determinate"
        value={(props.nowProgress / props.maxProgress) * 100}
        thickness={3}
        disableShrink={true}
        sx={progressStyle}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="caption"
          component="div"
          sx={{ color: 'white',fontWeight:'bold' }}
        >{`${Math.round(props.nowProgress)}`}</Typography>
      </Box>
    </Box>
  );
}

interface CircularProgressWithValueProps {
  nowProgress?: number;
  maxProgress?: number;
  size?: number;
}

const CircularProgressWithValue: React.FC<CircularProgressWithValueProps> = ({
  nowProgress = 10,
  maxProgress = 10,
  size = 30,
}) => {
  return (
    <CircularProgressWithLabel
      nowProgress={nowProgress}
      maxProgress={maxProgress}
      size={size}
    />
  );
};

export default CircularProgressWithValue;
