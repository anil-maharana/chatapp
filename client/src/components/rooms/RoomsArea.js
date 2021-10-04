import React from 'react'
import ChatArea from '../Chat/ChatArea'
import RoomAreaHeader from './RoomAreaHeader'

function RoomsArea({ room }) {
    return (
        <div className="rooms_area">
            <RoomAreaHeader title={room.roomName} roomUsers={room.users} />
            <ChatArea selectedRoom={room} />

        </div>
    )
}

export default RoomsArea
