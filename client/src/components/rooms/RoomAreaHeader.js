import React, { useState, useEffect } from 'react'
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VideocamIcon from "@mui/icons-material/Videocam";
import CallIcon from "@mui/icons-material/Call";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import axios from 'axios';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import { stringAvatar } from '../layouts/ColouredAvatar';
function RoomAreaHeader({ title, roomUsers }) {
    //console.log(roomUsers);
    // const _roomUsers = roomUsers.map(user => <Avatar key={user._id} alt={`${user.firstName} ${user.lastName}`} src={user.avatar} />)
    const _roomUsers = roomUsers.map(user => <Avatar
        key={user._id}
        alt={`${user.firstName} ${user.lastName}`}
        {...stringAvatar(`${user.firstName} ${user.lastName}`)} />)
    return (
        <div className="roomsAreadHeader">
            <div className="roomsAreadHeader__left">
                {/* <ArrowBackIcon /> */}
                <h2>{title}</h2>
            </div>
            <div className="roomsAreadHeader_users">
                <AvatarGroup max={4}>
                    {_roomUsers}
                </AvatarGroup>
            </div>
            <div className="roomsAreadHeader__right">
                <VideocamIcon />
                <CallIcon />
                <MoreVertIcon />
            </div>
        </div>
    )
}

export default RoomAreaHeader
