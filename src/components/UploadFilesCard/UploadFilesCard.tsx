import { Paper, Stack, Table, TableBody, TableContainer } from "@mui/material";
import { useRef, useState } from "react";
import { uploadFiles } from "../../helpers/fileUpload";
import { UploadFileButton } from "./UploadFileButton";
import { UploadFileItem } from "./UploadFileItem";

export function UploadFilesCard() {
  const [filesData, setFilesData] = useState<
    {
      file: File;
      id: string;
      isLoading: boolean;
      uploadPercent: number;
      uploadedFileInfo?: { assetId: string };
      failed: boolean;
    }[]
  >([]);
  const cancelUploadRef = useRef<(id: string) => void>();

  const triggerUpload = (files: { id: string; file: File }[]) => {
    const { cancelUpload } = uploadFiles({
      files,
      onUploadProgress: (id: string, percent: number) => {
        setFilesData((prevFilesData) =>
          prevFilesData.map((f) => ({
            ...f,
            uploadPercent: f.id === id ? percent : f.uploadPercent,
          }))
        );
      },
      onUploadSuccess: (id: string, data: { assetId: string }) => {
        setFilesData((prevFilesData) =>
          prevFilesData.map((f) => ({
            ...f,
            isLoading: f.id === id ? false : f.isLoading,
            uploadedFileInfo: f.id === id ? data : f.uploadedFileInfo,
          }))
        );
      },
      onUploadFailure: (id: string) => {
        setFilesData((prevFilesData) =>
          prevFilesData.map((f) => ({
            ...f,
            isLoading: f.id === id ? false : f.isLoading,
            failed: f.id === id ? true : f.failed,
          }))
        );
      },
    });
    cancelUploadRef.current = cancelUpload;
  };

  const handleFilesSelect = (_files: File[]) => {
    const files = _files.map((file) => ({
      file,
      id: Math.random().toString(),
    }));
    setFilesData((prevFilesData) => [
      ...prevFilesData,
      ...files.map(({ id, file }) => ({
        id,
        file,
        isLoading: true,
        failed: false,
        uploadedFileInfo: undefined,
        uploadPercent: 0,
      })),
    ]);
    triggerUpload(files);
  };

  const handleFileUploadRetry = (id: string, file: File) => {
    setFilesData((prevFilesData) =>
      prevFilesData.map((f) => ({
        ...f,
        isLoading: f.id === id ? true : f.isLoading,
        failed: f.id === id ? false : f.failed,
        uploadPercent: f.id === id ? 0 : f.uploadPercent,
      }))
    );
    triggerUpload([{ id, file }]);
  };

  const handleFileUploadClose = (id: string) => {
    setFilesData((prevFilesData) => prevFilesData.filter((f) => f.id !== id));
  };

  const handleFileUploadCancel = (id: string) => {
    cancelUploadRef.current?.(id);
  };

  return (
    <Stack
      direction="row"
      gap={2}
      justifyItems="flex-end"
      width="100%"
      alignItems="flex-start"
    >
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableBody>
            {filesData.map((fileData) => (
              <UploadFileItem
                key={fileData.id}
                file={fileData.file}
                failed={fileData.failed}
                isLoading={fileData.isLoading}
                uploadPercent={fileData.uploadPercent}
                uploadedFileInfo={fileData.uploadedFileInfo}
                onCancel={() => handleFileUploadCancel(fileData.id)}
                onRetry={() =>
                  handleFileUploadRetry(fileData.id, fileData.file)
                }
                onClose={() => handleFileUploadClose(fileData.id)}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <UploadFileButton onFilesSelect={handleFilesSelect} />
    </Stack>
  );
}
