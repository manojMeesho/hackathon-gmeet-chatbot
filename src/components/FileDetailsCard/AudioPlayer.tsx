import { Box } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";

export function AudioPlayer({
  resourceUrl,
  currentSeek,
  onProgress,
}: {
  resourceUrl: string;
  currentSeek: number;
  onProgress?: (duration?: number) => void;
}) {
  const audioRef = useRef<any>();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let intervalRef: number | undefined;
    if (audioRef.current && isPlaying) {
      intervalRef = window.setInterval(() => {
        onProgress?.(audioRef.current?.getCurrentTime());
      }, 100);
    }
    return () => {
      window.clearInterval(intervalRef);
    };
    // eslint-disable-next-line
  }, [isPlaying]);

  useEffect(() => {
    if (currentSeek) {
      const seek = currentSeek < 1 ? 0 : currentSeek;
      audioRef.current?.seekTo(seek);
    }
  }, [currentSeek]);

  if (!resourceUrl) {
    return null;
  }
  return (
    <Box sx={{ height: "50px" }}>
      <ReactPlayer
        ref={audioRef}
        url={resourceUrl}
        width="100%"
        height="100%"
        controls
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
    </Box>
  );
}
