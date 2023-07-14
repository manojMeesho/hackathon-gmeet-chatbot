import {
  Box,
  CircularProgress,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { AudioPlayer } from "./AudioPlayer";
import { Nav } from "./Nav";
import { useEffect, useRef, useState } from "react";
import {
  changeSpeaker,
  getFileInfo,
  getFileGptSummary,
  getFileQnA,
  getFileActionItems,
} from "../../helpers/files";
import { FileDetails } from "../../types";
import { Transcripts } from "./Transcripts";
import { Summary } from "./Summary";
import { Analysis } from "./Analysis";
import { ChatButton } from "./ChatButton";
import { Rating } from "./Rating";
import { errorToast } from "../../helpers/toast";

export function FileDetailsCard({
  selectedFiles,
  onBack,
}: {
  selectedFiles: { id: string; text: string }[];
  onBack: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string>(selectedFiles[0]?.id);
  const [selectedFileInfo, setSelectedFileInfo] = useState<FileDetails>();
  const [currentDuration, setCurrentDuration] = useState<number | undefined>(0);
  const [currentSeek, setCurrentSeek] = useState<number | undefined>(0);
  const gptSummaryTriggered = useRef<boolean>();
  const qnaTriggered = useRef<boolean>();
  const actionItemsTriggered = useRef<boolean>();

  const triggerFetchFile = () => {
    setIsLoading(true);
    getFileInfo(
      selectedId,
      (data: any) => {
        setSelectedFileInfo(data);
        setIsLoading(false);
      },
      () => {
        setIsLoading(false);
        errorToast("Failed to get file details");
      }
    );
  };

  useEffect(() => {
    if (selectedId) {
      setCurrentDuration(undefined);
      setCurrentSeek(undefined);
      setSelectedFileInfo(undefined);
      triggerFetchFile();
    }
  }, [selectedId]);

  const failedSummaryCall = () => {
    errorToast("Failed to get summary");
    setSelectedFileInfo(
      (prevValue) =>
        ({
          ...prevValue,
          gptSummary: "Failed to get summary",
        } as any)
    );
  };

  const failedQnACall = () => {
    errorToast("Failed to get Q and A");
    setSelectedFileInfo(
      (prevValue) =>
        ({
          ...prevValue,
          qnaTriggered: "Failed to get Q and A",
        } as any)
    );
  };

  const failedActionItemCall = () => {
    errorToast("Failed to get Action items");
    setSelectedFileInfo(
      (prevValue) =>
        ({
          ...prevValue,
          actionItem: "Failed to get action items",
        } as any)
    );
  };

  useEffect(() => {
    if (selectedFileInfo) {
      let shouldMakeCall = false;
      if (!selectedFileInfo.gptSummary) {
        if (!gptSummaryTriggered.current) {
          getFileGptSummary(selectedId, failedSummaryCall);
          gptSummaryTriggered.current = true;
        }
        shouldMakeCall = true;
      }
      if (!selectedFileInfo.qna) {
        if (!qnaTriggered.current) {
          getFileQnA(selectedId, failedQnACall);
          qnaTriggered.current = true;
        }
        shouldMakeCall = true;
      }
      if (!selectedFileInfo.actionItem) {
        if (!actionItemsTriggered.current) {
          getFileActionItems(selectedId, failedActionItemCall);
          actionItemsTriggered.current = true;
        }
        shouldMakeCall = true;
      }
      if (shouldMakeCall) {
        getFileInfo(selectedId, setSelectedFileInfo, () => {
          errorToast("Polling for file failed");
        });
      }
    }
  }, [selectedFileInfo]);

  const handleSpeakerEdit = (label: string, newLabel: string) => {
    const speakerMeta: any = {
      ...selectedFileInfo?.speakerMeta,
      [label]: newLabel,
    };
    setSelectedFileInfo(
      (prevVal) =>
        ({
          ...prevVal,
          speakerMeta,
        } as any)
    );
    changeSpeaker(selectedId, speakerMeta);
  };

  return (
    <>
      <Stack direction="column" justifyItems="flex-start" width="100%">
        <Nav onBack={onBack} />
        <Select
          sx={{ mt: 2 }}
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
        >
          {selectedFiles.map((s) => (
            <MenuItem key={s.id} value={s.id}>
              {s.text}
            </MenuItem>
          ))}
        </Select>
        {isLoading ? (
          <Box sx={{ margin: "auto", my: 10 }}>
            <CircularProgress />
          </Box>
        ) : (
          selectedFileInfo && (
            <Stack direction="column" p={3} gap={2}>
              <Typography
                fontWeight="bold"
                fontSize="14px"
                lineHeight="20px"
                color="tomato"
              >
                {selectedFiles.find((s) => s.id === selectedId)?.text}
              </Typography>
              <AudioPlayer
                resourceUrl={selectedFileInfo.resourceUrl}
                onProgress={(val?: number) => {
                  setCurrentDuration(val);
                  setCurrentSeek(undefined);
                }}
                currentSeek={currentSeek || 0}
              />
              <Rating
                sentimentAnalysis={selectedFileInfo.sentiment_analysis_results}
                utterances={selectedFileInfo.utterances}
                speakerMeta={selectedFileInfo.speakerMeta}
                highlights={selectedFileInfo.auto_highlights_result?.results}
              />
              <Stack direction="row" maxHeight="550px">
                <Transcripts
                  utterances={selectedFileInfo.utterances}
                  currentDuration={currentDuration || 0}
                  onWordClick={(val?: number) => {
                    setCurrentDuration(undefined);
                    setCurrentSeek(val);
                  }}
                  onSpeakerEdit={handleSpeakerEdit}
                  speakerMeta={selectedFileInfo.speakerMeta}
                />
                <Summary summary={selectedFileInfo.gptSummary || ""} />
                <Analysis
                  qna={selectedFileInfo.qna}
                  actionItem={selectedFileInfo.actionItem}
                />
              </Stack>
            </Stack>
          )
        )}
      </Stack>
      <ChatButton selectedIds={selectedFiles.map((f) => f.id)} />
    </>
  );
}
