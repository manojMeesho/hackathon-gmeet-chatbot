import axios from "axios";
import { BASE_URL } from "./fileUpload";

export const getAllFiles = (
  onSuccess?: (
    files: {
      id: string;
      assetId: string;
      name: string;
      fileUrl: string;
      size: number;
      status: string;
      tag: string;
    }[]
  ) => void,
  onFailure?: () => void
) => {
  axios
    .get(`${BASE_URL}/api/transcript`)
    .then((response) => {
      return onSuccess?.(
        response.data.map((item: any) => {
          const splits = item.url.split("-");
          splits.shift();
          return {
            id: item.jobId,
            assetId: item.url,
            name: splits.join("-"),
            fileUrl: item.audio_url,
            size: item.size,
            status: item.status,
            tag: item.category,
          };
        })
      );
    })
    .catch(onFailure);
};

export const getFileInfo = (
  id: string,
  onSuccess?: (fileInfo: any) => void,
  onFailure?: () => void
) => {
  axios
    .get(`${BASE_URL}/api/transcript/${id}`)
    .then((response) => {
      onSuccess?.(response.data);
    })
    .catch(onFailure);
};

export const changeSpeaker = (
  jobId: string,
  speakerMap: { [label: string]: string }
) => {
  axios
    .post(`${BASE_URL}/api/speaker`, {
      jobId,
      speakerMeta: speakerMap,
    })
    .catch(() => {});
};

export const getFileGptSummary = (jobId: string, onFailure?: () => void) => {
  axios
    .post(`${BASE_URL}/api/openai/custom`, {
      jobId,
      category: "gptSummary",
    })
    .catch(onFailure);
};

export const getFileQnA = (jobId: string, onFailure?: () => void) => {
  axios
    .post(`${BASE_URL}/api/openai/custom`, {
      jobId,
      category: "qna",
    })
    .catch(onFailure);
};

export const getFileActionItems = (jobId: string, onFailure?: () => void) => {
  axios
    .post(`${BASE_URL}/api/openai/custom`, {
      jobId,
      category: "actionItem",
    })
    .catch(onFailure);
};
