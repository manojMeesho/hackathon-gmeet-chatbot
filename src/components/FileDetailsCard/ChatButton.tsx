import { Box, Button } from "@mui/material";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import { useState } from "react";
import ChatBot from "../ChatBot/ChatBot";

export function ChatButton({ selectedIds }: { selectedIds: string[] }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Box sx={{ position: "fixed", bottom: 50, right: 50 }}>
        <Button variant="contained" onClick={() => setOpen(!open)}>
          <ChatBubbleIcon />
        </Button>
      </Box>
      {open && (
        <Box sx={{ position: "fixed", bottom: 100, right: 100 }}>
          <ChatBot selectedIds={selectedIds} />
        </Box>
      )}
    </>
  );
}
