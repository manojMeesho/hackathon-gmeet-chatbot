import {
  IconButton,
  Popover,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { MouseEvent, useState } from "react";
import DoneIcon from "@mui/icons-material/Done";

export function SpeakerLabel({
  color,
  label,
  originalLabel,
  onEditComplete,
}: {
  label?: string;
  originalLabel: string;
  color: string;
  onEditComplete?: (label: string, newLabel: string) => void;
}) {
  const [inputVal, setInputVal] = useState(label);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleDoneClick = () => {
    if (!inputVal) {
      return;
    }
    onEditComplete?.(originalLabel, inputVal);
    handleClose();
  };

  return (
    <>
      <Typography
        aria-describedby={id}
        sx={{ whiteSpace: "nowrap", alignItems: "flex-start" }}
        component="span"
        color={color}
        onClick={handleClick}
      >
        {label}
      </Typography>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Stack direction="row">
          <TextField
            size="small"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
          />
          <IconButton onClick={handleDoneClick}>
            <DoneIcon />
          </IconButton>
        </Stack>
      </Popover>
    </>
  );
}
