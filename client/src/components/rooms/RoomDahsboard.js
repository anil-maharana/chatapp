import React, { useEffect, useState, useContext } from 'react'
import './Room.css'
import RoomList from './RoomList';
import RoomsArea from './RoomsArea';
import axios from 'axios';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const RoomDashBoard = ({ auth: { isAuthenticated, user } }) => {
    const [rooms, setRooms] = useState([]);
    const [loadingData, setLoadingData] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null)


    const handleRoomSelection = (selectedRoom) => {
        console.log(selectedRoom);
        setSelectedRoom(selectedRoom);
    }

    useEffect(() => {
        async function fetchData(params) {
            await _getMyRooms();
        }
        fetchData();
    }, []);


    const _getMyRooms = async () => {
        setLoadingData(true);
        console.log(user);
        if (isAuthenticated === true) {
            const { data } = await axios.get(`http://localhost:5000/api/users/myRooms`);
            setRooms(data);
            console.log(data);
        }
        setLoadingData(false);
    }

    return (
        <div className="room_dashboard">
            {loadingData ? <span>Loading...</span> : <>
                <RoomList value={rooms} onRoomSelection={handleRoomSelection} />
                {!selectedRoom ? <div className="notSelectedRoomDiv">
                    <h1>Welcome</h1>
                    <p>Click on a Room name to start chatting!</p>
                </div> : <RoomsArea room={selectedRoom} />}
            </>}
        </div>
    )
}

RoomDashBoard.prototypes = {
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth
})
export default connect(mapStateToProps, {})(RoomDashBoard);
