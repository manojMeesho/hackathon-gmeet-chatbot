import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { getAllFiles } from "../../helpers/files";
import { convertBytesToMb } from "../UploadFilesCard/UploadFileItem";
import { errorToast } from "../../helpers/toast";

export function FileListCard({
  ids,
  onRun,
}: {
  ids: { id: string; text: string }[];
  onRun: (ids: { id: string; text: string }[]) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [fileList, setFileList] = useState<
    {
      id: string;
      size: number;
      assetId: string;
      name: string;
      fileUrl: string;
      status: string;
      tag: string;
    }[]
  >([]);

  const [selectedIds, setSelectedIds] =
    useState<{ id: string; text: string }[]>(ids);

  const handleCheckboxChange = (
    e: ChangeEvent<HTMLInputElement>,
    id: string,
    text: string
  ) => {
    if (e.target.checked) {
      setSelectedIds((prevValue) => [...prevValue, { id, text }]);
      return;
    }
    setSelectedIds((prevValue) => prevValue.filter((i) => i.id !== id));
  };

  const triggerFetchList = () => {
    setIsLoading(true);
    getAllFiles(
      (data: any) => {
        setFileList(data);
        setIsLoading(false);
      },
      () => {
        setIsLoading(false);
        errorToast("Failed to get files");
      }
    );
  };

  useEffect(() => {
    triggerFetchList();
    const intervalRef = window.setInterval(() => {
      triggerFetchList();
    }, 10000);
    return () => {
      window.clearInterval(intervalRef);
    };
  }, []);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>
              {!!selectedIds.length && (
                <Button onClick={() => onRun(selectedIds)} variant="contained">
                  RUN
                </Button>
              )}
            </TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Tag</TableCell>
            <TableCell>Size</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {fileList.map((fileItem) => {
            const isTranscriptGenerated = fileItem.status === "completed";
            return (
              <TableRow
                key={fileItem.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <Checkbox
                    disabled={!isTranscriptGenerated}
                    checked={selectedIds.some((i) => i.id === fileItem.id)}
                    onChange={(e) =>
                      handleCheckboxChange(e, fileItem.id, fileItem.name)
                    }
                  />
                </TableCell>
                <TableCell>
                  {isTranscriptGenerated ? (
                    <Link
                      component="button"
                      variant="body2"
                      onClick={() =>
                        onRun([{ id: fileItem.id, text: fileItem.name }])
                      }
                    >
                      {fileItem.name}
                    </Link>
                  ) : (
                    fileItem.name
                  )}
                </TableCell>
                <TableCell>{fileItem.tag}</TableCell>
                <TableCell>
                  {fileItem.size && convertBytesToMb(fileItem.size)}
                </TableCell>
                <TableCell>{fileItem.status}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
