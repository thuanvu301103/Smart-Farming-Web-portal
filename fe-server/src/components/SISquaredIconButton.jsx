import { IconButton,useTheme  } from "@mui/material";

export default function SISquaredIconButton(props) {
  const theme = useTheme();
  return  (
  <IconButton size="small" 
        {...props}
        sx={{
          width: "32px",
          height: "32px",
          borderRadius: "0.375rem",
          border: "1px solid",
          borderColor: theme.palette.mode === "dark" ? "#3D444D" : "#A5A5A5",
          ...props.sx,
        }} {...props} />
      )
}
