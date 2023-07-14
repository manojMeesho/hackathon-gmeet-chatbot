import FileUploadIcon from "@mui/icons-material/FileUpload";
import { Button } from "@mui/material";
import { ChangeEvent } from "react";

const fileExtensions = [".mp3", ".mpeg", ".m4a"];

export function UploadFileButton({
  onFilesSelect,
}: {
  onFilesSelect?: (files: File[]) => void;
}) {
  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    onFilesSelect?.(Array.from(event.target.files || []));
  };

  return (
    <Button variant="contained" component="label">
      <FileUploadIcon />
      <input
        type="file"
        hidden
        multiple
        accept={fileExtensions.join(",")}
        onChange={handleOnChange}
      />
    </Button>
  );
}
