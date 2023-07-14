import axios from "axios";
import { BASE_URL } from "./fileUpload";

export const getChatAnswer = (
  body: { message: string; id: string[] },
  onSuccess?: (data: { content: string }) => void
) => {
  try {
    axios
      .post(`${BASE_URL}/api/openai/chat`, body)
      .then((response) => onSuccess?.(response.data))
      .catch(() => {});
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

export const sendSlackMessage = (text: string) => {
  axios
    .post(`${BASE_URL}/api/slack`, {
      data: {
        text,
      },
    })
    .catch(() => {});
};

// Post a message to a channel your app is in using ID and message text
export const publishMessage = async () => {
  try {
    const headers: any = {
      "Content-Type": "application/json",
      Authorization:
        "Bearer xoxe.xoxp-1-Mi0yLTU1Nzc4NTc2NTMyMzMtNTU4ODkyODA5ODQ5Ni01NTYwMzI4MTAyNTY3LTU1NjgyMDY0NDg1OTgtYzJkY2UwMjU3YmQyMzc4NTA2MTU2ZjRjODQ3ZmE5NTRkYzk0ZWM5ZGM4ODJjYWQwNDgzNWM5OTkxOTI2NjkxYg",
    };
    // Call the chat.postMessage method using the built-in WebClient
    const result = await axios.post(
      "https://slack.com/api/chat.postMessage",
      {
        channel: "C05GM3A56M9",
        text: "Hello world :tada:",
      },
      headers
    );

    // Print result, which includes information about the message (like TS)
    console.log(result);
  } catch (error) {
    console.error(error);
  }
};
