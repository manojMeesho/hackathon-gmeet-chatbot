import { Box, Stack, Typography } from "@mui/material";
import { UtterancesEntity } from "../../types";
import PersonIcon from "@mui/icons-material/Person";
import { grey } from "@mui/material/colors";
import { SpeakerLabel } from "./SpeakerLabel";

export function Transcripts({
  utterances,
  currentDuration,
  onWordClick,
  onSpeakerEdit,
  speakerMeta,
}: {
  speakerMeta?: { [key: string]: string };
  utterances?: UtterancesEntity[] | null;
  currentDuration: number;
  onWordClick?: (duration?: number) => void;
  onSpeakerEdit?: (label: string, newLabel: string) => void;
}) {
  const duration = currentDuration * 1000;
  return (
    <Box sx={{ p: 2, overflow: "auto", width: "100%" }}>
      <Typography p={2} bgcolor={grey[300]} fontWeight={600}>
        TRANSCRIPT
      </Typography>
      {utterances?.map((u) => {
        const isUtteranceBetween = duration >= u.start && duration <= u.end;
        return (
          <Box key={u.start}>
            <Stack direction="column" gap={1} my={2}>
              <Stack direction="row" alignItems="center" gap={0.5}>
                <PersonIcon
                  onClick={() => onWordClick?.(u.start / 1000)}
                  color={isUtteranceBetween ? "warning" : "action"}
                />
                <SpeakerLabel
                  color={isUtteranceBetween ? "tomato" : "text.primary"}
                  label={speakerMeta?.[u.speaker] || u.speaker}
                  onEditComplete={onSpeakerEdit}
                  originalLabel={u.speaker}
                />
              </Stack>
              <Box ml={4}>
                {u.words?.map((w) => {
                  const isWordBetween =
                    isUtteranceBetween &&
                    duration >= w.start &&
                    duration <= w.end;
                  return (
                    <Typography
                      key={w.start}
                      component="span"
                      color={isWordBetween ? "tomato" : "text.primary"}
                      onClick={() => onWordClick?.(w.start / 1000)}
                    >
                      {`${w.text} `}
                    </Typography>
                  );
                })}
              </Box>
            </Stack>
          </Box>
        );
      })}
    </Box>
  );
}
