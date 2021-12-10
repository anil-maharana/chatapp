import React from 'react';
import "./Chat.css";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import MicIcon from "@mui/icons-material/Mic";
import Grid from '@mui/material/Grid';
import SendIcon from "@mui/icons-material/Send";
import CitryEditor from '../Editor/citryleditor';
import { useState, useRef } from "react";
import MyEditor from '../AnilEditor/MyEditor'
import { Box } from '@mui/system';
import { Paper, TextField } from '@mui/material';
// import { ChatContext } from "../../contexts/ChatContext";
// import Picker from "emoji-picker-react";

const ChatInput = ({ onMessageSubmit }) => {
    // const { selectedChat } = useContext(ChatContext);
    const [message, setMessage] = useState("");
    const [showPicker, setShowPicker] = useState(false);
    const citrylEditorRef = useRef(null)
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
                {/* <SentimentVerySatisfiedIcon onClick={togglePicker} />
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
                </div> */}
                <CitryEditor ref={citrylEditorRef} onEditorChange={(val) => { console.log(val) }}></CitryEditor>
                {/* <Grid container spacing={2} alignItems="center">
                    <Grid item xs>
                        <CitryEditor ref={citrylEditorRef}></CitryEditor>
                    </Grid>
                    <Grid item >
                        <button onClick={sendMessage}><SendIcon></SendIcon></button>
                    </Grid>
                    <Grid item>
                    </Grid>
                </Grid> */}
                {/* <MyEditor /> */}
            </div>
            <div className="chatinput__icons">
                <SendIcon />
            </div>
            {/* <MyEditor /> */}
        </div>
        // <Box sx={{ background: 'white',minHeight:'120px' }}>
        //     <Paper elevation={3}>
        //         <TextField variant="standard" id="txtChatInput" placeholder="Type a new message" style={{ width: '100%' }} />
        //     </Paper>
        // </Box>
    );
};

export default ChatInput;
