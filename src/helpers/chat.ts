import axios from "axios";
import { BASE_URL } from "./fileUpload";
import { errorToast, successToast } from "./toast";

export const getChatAnswer = (
  body: { message: string; id: string[] },
  onSuccess?: (data: { content: string }) => void,
  onFailure?: () => void
) => {
  axios
    .post(`${BASE_URL}/api/openai/chat`, body)
    .then((response) => onSuccess?.(response.data))
    .catch(() => {
      errorToast("Failed to get the message");
      onFailure?.();
    });
};

export const sendSlackMessage = (text: string) => {
  axios
    .post(`${BASE_URL}/api/slack`, {
      data: {
        text,
      },
    })
    .then(() => {
      successToast("Sent slack message.");
    })
    .catch(() => {
      errorToast("Failed to send slack messsage");
    });
};
