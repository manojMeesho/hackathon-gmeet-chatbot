import { Box, CircularProgress, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";

export function Analysis({
  qna,
  actionItem,
}: {
  qna?: string;
  actionItem?: string;
}) {
  const qAndAs = qna?.split("\n");
  const actionItems = actionItem?.split("\n");
  return (
    <Box sx={{ p: 2, overflow: "auto", width: "100%" }}>
      <Typography p={2} bgcolor={grey[300]} fontWeight={600}>
        ANALYSIS
      </Typography>
      <Box my={2}>
        <Typography fontWeight={600}>Q and A</Typography>
        {!qAndAs?.length ? (
          <Box sx={{ display: "flex" }}>
            <CircularProgress />
          </Box>
        ) : (
          qAndAs?.map((l) => <Typography key={l}>{l}</Typography>)
        )}
      </Box>
      <Box my={2}>
        <Typography fontWeight={600}>Action Items</Typography>
        {!actionItems?.length ? (
          <Box sx={{ display: "flex" }}>
            <CircularProgress />
          </Box>
        ) : (
          actionItems?.map((l) => <Typography key={l}>{l}</Typography>)
        )}
      </Box>
    </Box>
  );
}
