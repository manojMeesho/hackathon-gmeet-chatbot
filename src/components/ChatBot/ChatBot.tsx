import { useState, useRef, useEffect } from "react";
import { Button, Paper, TextField, Typography } from "@mui/material";
import { getChatAnswer } from "../../helpers/chat";

const classes = {
  chatContainer: {
    width: 400,
    borderRadius: 12,
  },
  messageContainer: {
    maxHeight: 500,
    padding: 16,
    overflowY: "scroll",
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#f1f0f0",
    color: "black",
    padding: "12px 12px",
    borderRadius: "12px",
    maxWidth: "70%",
    fontSize: "12px",
    overflowWrap: "break-word",
    wordWrap: "break-word",
  },
  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#F3F3F3",
    color: "black",
    padding: "12px 12px",
    borderRadius: "12px",
    fontSize: "12px",
    maxWidth: "70%",
    overflowWrap: "break-word",
    wordWrap: "break-word",
  },
  inputContainer: {
    padding: 16,
    display: "flex",
    gap: 16,
    marginTop: 10,
  },
  sendButton: {
    flexShrink: 0,
  },
  heading: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    height: "60px",
    paddingLeft: "20px",
    borderTopRightRadius: "12px",
    color: "#ffffff ",
    background: "linear-gradient(to right, #FF8A65, #FF4081)",
    marginBottom: "10px",
  },
};

const HTMLComponent = ({ message }: { message: string[] }) => {
  return (
    <div>
      {message.map((content, index) => (
        <p key={index}>{content}</p>
      ))}
    </div>
  );
};

const ChatBot = ({ selectedIds }: { selectedIds: string[] }) => {
  const [message, setMessage] = useState<string>("");
  const [chat, setChat] = useState<any[]>([]);
  const messagesEndRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (event: any) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = () => {
    setIsLoading(true);
    setChat((prevChat) => [...prevChat, { user: true, message: [message] }]);
    getChatAnswer(
      { message, id: selectedIds },
      ({ content }) => {
        setIsLoading(false);
        const botReply = content.split("\n");
        setChat((prevChat) => [
          ...prevChat,
          { user: false, message: botReply },
        ]);
      },
      () => {
        setIsLoading(false);
      }
    );
    setMessage("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  return (
    <Paper elevation={3} style={classes.chatContainer}>
      <div style={classes.heading}>ChatBot</div>
      <div style={classes.messageContainer as any}>
        {chat.map((chatItem, index) => (
          <Typography
            key={index}
            variant="body1"
            style={
              (chatItem.user ? classes.userMessage : classes.botMessage) as any
            }
          >
            <HTMLComponent message={chatItem.message} />
          </Typography>
        ))}
        {isLoading && <i>Getting your answer...</i>}
        <div ref={messagesEndRef} />
      </div>
      <div style={classes.inputContainer}>
        <TextField
          label="Type a message"
          value={message}
          onChange={handleInputChange}
          variant="outlined"
          fullWidth
          focused={false}
        />
        <Button
          variant="contained"
          onClick={handleSendMessage}
          disabled={!message}
          style={classes.sendButton}
        >
          Send
        </Button>
      </div>
    </Paper>
  );
};

export default ChatBot;
