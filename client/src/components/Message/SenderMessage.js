import React from 'react';
import "./Message.css";
import DoneAllIcon from "@mui/icons-material/DoneAll";

const SenderMessage = ({ message }) => {
    return (
        <div className="sendermessage">
            <span><DoneAllIcon /></span>
            <span style={{ marginLeft: "5px", fontSize: '12px', fontWeight: 'bold', color: '#7f7f7f' }}>
                {message.timestamp}
            </span>
            <p>{message.content}</p>
        </div>
    );
};

export default SenderMessage;
