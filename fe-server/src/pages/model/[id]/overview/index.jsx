import { Box, Card, TextField, Typography } from "@mui/material";
import { convertTimestamp } from "../../../../utils/dateUtils";

export default function ModelOverview({ modelInfo }) {
  console.log("modelInfo", modelInfo);
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        gap: "24px",
      }}
    >
      {/* Info */}
      <Card
        variant="outlined"
        sx={{ display: "flex", flexDirection: "column", padding: "24px" }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <Typography sx={{ fontSize: "24px", fontWeight: "600" }}>
            Model Details
          </Typography>
          <Typography>Basic information about this irrigation model</Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            mt: "24px",
          }}
        >
          <TextField
            id="outlined-suffix-shrink"
            label="Name"
            fullWidth
            defaultValue={modelInfo.name}
            variant="outlined"
            size="medium"
          />
          <TextField
            id="outlined-suffix-shrink"
            label="Created"
            fullWidth
            defaultValue={convertTimestamp(modelInfo.creation_timestamp)}
            variant="outlined"
            size="medium"
          />
          <TextField
            id="outlined-suffix-shrink"
            label="Last Updated"
            fullWidth
            defaultValue={convertTimestamp(modelInfo.last_updated_timestamp)}
            variant="outlined"
            size="medium"
          />
        </Box>
      </Card>
      {/* Description */}
      <Card
        variant="outlined"
        sx={{ display: "flex", flexDirection: "column", padding: "24px" }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <Typography sx={{ fontSize: "24px", fontWeight: "600" }}>
            Description
          </Typography>
          <Typography color="primary">
            Detailed description of this irrigation model
          </Typography>
        </Box>
        <Box sx={{ mt: "24px" }}>
          <TextField
            fullWidth
            id="outlined-multiline-flexible"
            label="Description"
            defaultValue={modelInfo.description}
            multiline
            maxRows={4}
          />
        </Box>
      </Card>
    </Box>
  );
}
