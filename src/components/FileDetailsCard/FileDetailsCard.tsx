import { MenuItem, Select, Stack, Typography } from "@mui/material";
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

export function FileDetailsCard({
  selectedFiles,
  onBack,
}: {
  selectedFiles: { id: string; text: string }[];
  onBack: () => void;
}) {
  const [selectedId, setSelectedId] = useState<string>(selectedFiles[0]?.id);
  const [selectedFileInfo, setSelectedFileInfo] = useState<FileDetails>();
  const [currentDuration, setCurrentDuration] = useState<number | undefined>(0);
  const [currentSeek, setCurrentSeek] = useState<number | undefined>(0);
  const gptSummaryTriggered = useRef<boolean>();
  const qnaTriggered = useRef<boolean>();
  const actionItemsTriggered = useRef<boolean>();

  useEffect(() => {
    if (selectedId) {
      setCurrentDuration(undefined);
      setCurrentSeek(undefined);
      setSelectedFileInfo(undefined);
      getFileInfo(selectedId, setSelectedFileInfo, () => {});
    }
  }, [selectedId]);

  useEffect(() => {
    if (selectedFileInfo) {
      let shouldMakeCall = false;
      if (!selectedFileInfo.gptSummary) {
        if (!gptSummaryTriggered.current) {
          getFileGptSummary(selectedId);
          gptSummaryTriggered.current = true;
        }
        shouldMakeCall = true;
      }
      if (!selectedFileInfo.qna) {
        if (!qnaTriggered.current) {
          getFileQnA(selectedId);
          qnaTriggered.current = true;
        }
        shouldMakeCall = true;
      }
      if (!selectedFileInfo.actionItem) {
        if (!actionItemsTriggered.current) {
          getFileActionItems(selectedId);
          actionItemsTriggered.current = true;
        }
        shouldMakeCall = true;
      }
      if (shouldMakeCall) {
        getFileInfo(selectedId, setSelectedFileInfo, () => {});
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
        {selectedFileInfo && (
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
              <Summary
                summary={
                  selectedFileInfo.gptSummary || selectedFileInfo.summary
                }
              />
              <Analysis
                qna={selectedFileInfo.qna}
                actionItem={selectedFileInfo.actionItem}
              />
            </Stack>
          </Stack>
        )}
      </Stack>
      <ChatButton selectedIds={selectedFiles.map((f) => f.id)} />
    </>
  );
}
