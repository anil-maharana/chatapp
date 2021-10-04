import React, { useState, useContext, useEffect, useRef } from 'react';
import ChatInput from "./ChatInput";
import ReceiverMessage from "../Message/ReceiverMessage";
import SenderMessage from "../Message/SenderMessage";
import "./Chat.css";
import SocketContext, { socket } from '../../context/SocketContext';
import axios from 'axios';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { newNotification } from '../../redux/actions/notification'
const ChatArea = ({ auth: { isAuthenticated, user }, newNotification, selectedRoom }) => {
    const messagesEndRef = useRef(null);
    const [selectedRoomFromState, setSelectedRoomFromState] = useState(selectedRoom)
    const socketContext = useContext(SocketContext)
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const handleMessageSubmit = (newMessage) => {
        console.log("send Message");
        socketContext.emit('send-message', { message: newMessage, author: user, room: selectedRoomFromState }, async () => {
            console.log("callback called");
            const { data } = await saveMessage(newMessage);
            const _msg = {
                id: data._id,
                author: data.messageAuthor,
                type: data.messageAuthor._id == user._id ? "sent" : "received",
                content: data.messageBody,
                timestamp: new Date(data.createdOn).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
            }
            setMessages(messages => [...messages, _msg]);
        });
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages])
    useEffect(() => {
        console.log('change in room' + selectedRoomFromState.roomName);
        fetchMessages(selectedRoom._id);
        setSelectedRoomFromState(selectedRoom);
    }, [selectedRoom._id])

    useEffect(() => {
        socketContext.on("received-message", ({ message, author, room }) => {
            console.log("recieved Message");
            if (selectedRoomFromState._id === room._id) {
                const _msg = {
                    // id: data._id,
                    author: author,
                    type: "received",
                    content: message,
                    timestamp: new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
                }
                setMessages(messages => [...messages, _msg]);
            }
            // updateMessage(message, author, room)
        });
        socket.on("new-message-notification", ({ roomID, message }) => {
            console.log(roomID, message);
            if (roomID !== selectedRoomFromState._id) newNotification(message, roomID);
        })
    }, [socketContext])

    const fetchMessages = async (roomId) => {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/messages/${roomId}`);
        const _msg = res.data.map(m => {
            return {
                id: m._id,
                author: m.messageAuthor,
                type: m.messageAuthor._id == user._id ? "sent" : "received",
                content: m.messageBody,
                timestamp: new Date(m.createdOn).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
            }
        });
        console.log(_msg);
        console.log(user)
        setMessages(_msg);
        setLoading(false);
    }
    const saveMessage = async (message) => {
        const res = await axios.post(
            "http://localhost:5000/api/messages",
            {
                roomId: selectedRoomFromState._id,
                messageBody: message
            });
        return res.data;
    }
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
    return (
        <div className="chatarea">
            <div className="chatarea__container"></div>
            {loading ? <div className="loadingMsgDiv">
                <span>Loading Messages..</span>
            </div> : <div className="chatarea__messages">
                {messages.map((message, index) => {
                    return message.type === "sent" ? (
                        <SenderMessage key={index} message={message} />
                    ) : (
                        <ReceiverMessage key={index} message={message} author={message.author} />
                    );
                })}
                <div ref={messagesEndRef} />
            </div>}
            {/* <ChatInput setMessages={setMessages} /> */}
            <ChatInput onMessageSubmit={handleMessageSubmit} />
        </div>
    );
};

ChatArea.prototypes = {
    auth: PropTypes.object.isRequired,
    newNotification: PropTypes.func.isRequired,
    selectedRoom: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
})
export default connect(mapStateToProps, { newNotification })(ChatArea);
