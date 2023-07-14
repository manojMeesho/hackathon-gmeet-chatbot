import { Container, Stack } from "@mui/material";
import { UploadFilesCard } from "./components/UploadFilesCard/UploadFilesCard";
import { FileListCard } from "./components/FileListCard/FileListCard";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { FileDetailsCard } from "./components/FileDetailsCard/FileDetailsCard";

export function App() {
  const [selectedIds, setSelectedIds] = useState<
    { id: string; text: string }[]
  >([]);
  const [view, setView] = useState<"list" | "detail">("list");

  const handleRun = (ids: { id: string; text: string }[]) => {
    setSelectedIds(ids);
    setView("detail");
  };

  return (
    <Container
      sx={{ bgcolor: "ButtonHighlight", height: "100vh" }}
      maxWidth="xl"
    >
      <Stack alignItems="center" sx={{ p: 2 }} gap={2}>
        {view === "list" && (
          <>
            <UploadFilesCard />
            <FileListCard onRun={handleRun} ids={selectedIds} />
          </>
        )}
        {view === "detail" && (
          <FileDetailsCard
            selectedFiles={selectedIds}
            onBack={() => setView("list")}
          />
        )}
      </Stack>
      <Toaster
        toastOptions={{
          success: {
            style: {
              background: "green",
              color: "white",
            },
          },
          error: {
            style: {
              background: "red",
              color: "white",
            },
          },
        }}
      />
    </Container>
  );
}
