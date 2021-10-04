import Avatar from '@mui/material/Avatar';
import React from 'react';
import "./Message.css";
import { stringAvatar } from '../layouts/ColouredAvatar';

const ReceiverMessage = ({ message, author }) => {
    return (
        <div style={{ display: 'flex', alignContent: 'center', alignItems: 'center' }}>
            {author !== null ? <Avatar {...stringAvatar(`${author.firstName} ${author.lastName}`)} /> :
                <Avatar />}
            <div className="receivermessage">

                <div style={{ display: 'flex', alignContent: 'center', fontSize: '12px', fontWeight: 'bold', color: '#7f7f7f', marginTop: '2px' }}>
                    {author !== null ? <span>{`${author.firstName}, ${author.lastName}`}</span> : null}
                    <span style={{ marginLeft: "5px" }}>{message.timestamp}</span>
                </div>
                <p>{message.content}</p>
            </div>
        </div>

    );
};

export default ReceiverMessage;
