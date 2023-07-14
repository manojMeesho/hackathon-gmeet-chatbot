import { Box, Chip, Stack, Typography, alpha } from "@mui/material";
import {
  ResultsEntity,
  SentimentAnalysisResultsEntity,
  UtterancesEntity,
} from "../../types";
import { green, red, yellow } from "@mui/material/colors";

const colorMap: any = {
  NEUTRAL: "info",
  POSITIVE: "success",
  NEGATIVE: "error",
};

const getSpeakerDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${minutes}m ${secs}s`;
};

export function Rating({
  sentimentAnalysis,
  utterances,
  speakerMeta,
  highlights,
}: {
  sentimentAnalysis?: SentimentAnalysisResultsEntity[] | null;
  utterances?: UtterancesEntity[] | null;
  speakerMeta?: { [label: string]: string };
  highlights?: ResultsEntity[] | null;
}) {
  const sentimentObj = sentimentAnalysis?.reduce((acc, data) => {
    acc[data.sentiment] = (acc[data.sentiment] || 0) + 1;
    return acc;
  }, {} as any);
  const totalOccurances = Object.values(sentimentObj).reduce(
    (acc: number, cur) => {
      acc = (acc as number) + (cur as number);
      return acc;
    },
    0
  );

  const speakerDurationMap = utterances?.reduce((acc, cur) => {
    const diff = cur.end - cur.start;
    acc[cur.speaker] = (acc[cur.speaker] || 0) + diff / 1000;
    return acc;
  }, {} as any);
  const totalSeconds = Object.values(speakerDurationMap).reduce(
    (acc: number, cur) => {
      acc = (acc as number) + (cur as number);
      return acc;
    },
    0
  );

  const rating =
    (sentimentObj.POSITIVE * 10) /
    (sentimentObj.POSITIVE + sentimentObj.NEGATIVE);
  const ratingColor =
    rating > 7.5 ? green[500] : rating > 5 ? yellow[500] : red[500];
  return (
    <Stack direction="row" gap={5}>
      <Box my={2}>
        <Typography fontWeight={600}>SENTIMENTS</Typography>
        {Object.keys(sentimentObj).map((key) => {
          const percent = ((sentimentObj[key] * 100) / totalOccurances).toFixed(
            2
          );
          return (
            <Chip
              sx={{ m: 0.5 }}
              label={`${key}: ${percent}%`}
              color={colorMap[key]}
              variant="outlined"
              key={key}
            />
          );
        })}
      </Box>
      <Box my={2}>
        <Typography fontWeight={600}>SPEAKER ANALYSIS</Typography>
        {Object.keys(speakerDurationMap).map((key) => {
          const seconds = +speakerDurationMap[key];
          const percent = seconds / totalSeconds;
          const speakerName = speakerMeta?.[key] || key;
          return (
            <Chip
              key={key}
              label={`${speakerName}: ${getSpeakerDuration(seconds)}`}
              variant="outlined"
              sx={{ m: 0.5, bgcolor: alpha("#00FF00", percent) }}
            />
          );
        })}
      </Box>
      <Box my={2}>
        <Typography fontWeight={600}>RATING:</Typography>
        <Chip
          label={Math.floor(rating)}
          variant="outlined"
          sx={{ m: 0.5, bgcolor: ratingColor }}
        />
      </Box>
      <Box my={2}>
        <Typography fontWeight={600}>HIGHLIGHTS</Typography>
        {highlights
          ?.filter?.((_h, i) => i < 5)
          .map((h) => (
            <Chip
              key={h.text}
              sx={{ m: 0.5 }}
              label={h.text}
              color="primary"
              variant="outlined"
            />
          ))}
      </Box>
    </Stack>
  );
}
