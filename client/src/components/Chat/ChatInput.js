import React from 'react';
import "./Chat.css";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import MicIcon from "@mui/icons-material/Mic";

import { useState } from "react";
// import { ChatContext } from "../../contexts/ChatContext";
// import Picker from "emoji-picker-react";

const ChatInput = ({ onMessageSubmit }) => {
    // const { selectedChat } = useContext(ChatContext);
    const [message, setMessage] = useState("");
    const [showPicker, setShowPicker] = useState(false);
    const sendMessage = (e) => {
        e.preventDefault();
        if (message !== "") {
            onMessageSubmit(message)
            setMessage("");
        }
    };
    const togglePicker = () => {
        setShowPicker(!showPicker);
    };
    const addEmoji = (e, emoji) => {
        setMessage(message + emoji.emoji);
    };


    return (
        <div className="chatinput">
            <div className="chatinput__form">
                {/* {showPicker && <Picker onEmojiClick={addEmoji} />} */}
                <SentimentVerySatisfiedIcon onClick={togglePicker} />
                <form onSubmit={sendMessage}>
                    <input
                        type="text"
                        value={message}
                        placeholder="Type a message"
                        onChange={(e) => {
                            setMessage(e.target.value);
                        }}
                    />
                </form>
                <div className="chatinput__formIcons">
                    <AttachFileIcon />
                    <CameraAltIcon />
                </div>
            </div>
            <div className="chatinput__icons">
                <MicIcon />
            </div>
        </div>
    );
};

export default ChatInput;
