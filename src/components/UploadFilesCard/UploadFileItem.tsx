import {
  Box,
  Button,
  CircularProgress,
  Fab,
  Stack,
  TableCell,
  TableRow,
  TextField,
} from "@mui/material";
import ReplayIcon from "@mui/icons-material/Replay";
import DoneIcon from "@mui/icons-material/Done";
import CloudOffIcon from "@mui/icons-material/CloudOff";
import { useState } from "react";
import { triggerGenerateTranscript } from "../../helpers/fileUpload";

export const convertBytesToMb = (size: number) => {
  const sizeInMb = (size / 1000000).toFixed(1);
  return `${sizeInMb}MB`;
};

export function UploadFileItem({
  file,
  isLoading,
  failed,
  uploadPercent,
  uploadedFileInfo,
  onClose,
  onCancel,
  onRetry,
}: {
  file: File;
  isLoading: boolean;
  failed: boolean;
  uploadPercent: number;
  uploadedFileInfo?: { assetId: string };
  onClose?: () => void;
  onRetry?: () => void;
  onCancel?: () => void;
}) {
  const success = !!uploadedFileInfo;
  const color = success ? "success" : failed ? "error" : "warning";
  const [tag, setTag] = useState("");

  const handleDone = () => {
    triggerGenerateTranscript(uploadedFileInfo?.assetId, tag, file.size, () => {
      onClose?.();
    });
  };

  return (
    <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
      <TableCell align="left">{file.name}</TableCell>
      <TableCell align="left">{convertBytesToMb(file.size)}</TableCell>
      <TableCell align="left">
        <Box sx={{ position: "relative" }}>
          <Fab color={color} size="small">
            {success ? (
              <DoneIcon />
            ) : failed ? (
              <ReplayIcon onClick={onRetry} />
            ) : (
              <CloudOffIcon onClick={onCancel} />
            )}
          </Fab>
          {isLoading && !!uploadPercent && (
            <CircularProgress
              variant="determinate"
              value={uploadPercent}
              size={48}
              thickness={5}
              color="success"
              sx={{
                position: "absolute",
                top: -4,
                left: -4,
                zIndex: 1,
              }}
            />
          )}
        </Box>
      </TableCell>
      {success && (
        <TableCell>
          <Stack direction="row" gap={1}>
            <TextField
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              label="Enter Tag"
              variant="outlined"
              size="small"
            />
            {tag && (
              <Button variant="contained" size="small" onClick={handleDone}>
                <DoneIcon />
              </Button>
            )}
          </Stack>
        </TableCell>
      )}
    </TableRow>
  );
}
