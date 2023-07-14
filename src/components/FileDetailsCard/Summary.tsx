import { Box, Button, Stack, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { grey } from "@mui/material/colors";
import { sendSlackMessage } from "../../helpers/chat";

export function Summary({ summary }: { summary: string }) {
  const lines = summary.split("\n");

  return (
    <Box sx={{ p: 2, overflow: "auto", width: "100%" }}>
      <Stack direction="row">
        <Typography p={2} bgcolor={grey[300]} fontWeight={600} flexGrow={1}>
          SUMMARY
        </Typography>
        <Button
          size="small"
          variant="outlined"
          onClick={() => sendSlackMessage(summary)}
        >
          <SendIcon />
        </Button>
      </Stack>
      <Box my={2}>
        <Typography fontWeight={600}>AI SUMMARY</Typography>
        {lines.map((l) => (
          <Typography key={l}>{l}</Typography>
        ))}
      </Box>
    </Box>
  );
}
