import React, { useState } from 'react'
import './Room.css';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import Stack from '@mui/material/Stack';
import NewRoom from './NewRoom';
import { ListItemButton } from '@mui/material';
import { stringAvatar } from '../layouts/ColouredAvatar'
import EditRoom from './EditRoom';
import DeleteRoom from './DeleteRoom';
import { Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { removeNotification } from '../../redux/actions/notification';

const RoomList = ({ value, onRoomSelection, notifications, removeNotification }) => {
    const [rooms, setRooms] = useState(value);
    const [addChannelDialog, setAddChannelDialog] = useState(false);
    const [editChannelDialog, setEditChannelDialog] = useState(false);
    const [deleteChannelDialog, setDeleteChannelDialog] = useState(false);

    const [selectedRoom, setSelectedRoom] = useState(null);
    const [selectedRoomIndex, setSelectedRoomIndex] = React.useState(null);
    const handleListItemClick = (event, room, index) => {
        setSelectedRoomIndex(index);
        onRoomSelection(room);
        setSelectedRoom(room);
        removeNotification(room._id)
    };
    const handleAddChannel = async (val) => {
        setAddChannelDialog(false);
        if (val) {
            _getMyRooms()
        }
    };
    const handleEditChannel = async (val) => {
        setEditChannelDialog(false);
        if (val) {
            _getMyRooms()
        }
    };
    const handleDeleteChannel = async (val) => {
        setDeleteChannelDialog(false);
        if (val) {
            _getMyRooms();
            setSelectedRoom(null)
        }
    };
    const _getMyRooms = async () => {
        const { data } = await axios.get(`http://localhost:5000/api/users/myRooms`);
        setRooms(data);
    }

    return (
        <>
            <div className="rooms">
                <div className="roomsAreadHeader">
                    <div className="roomsAreadHeader__left">
                        <h2>Rooms</h2>
                    </div>
                    <div className="roomsAreadHeader__right">
                        <IconButton edge="end" aria-label="Add" onClick={() => setAddChannelDialog(true)}>
                            <AddIcon />
                        </IconButton>
                    </div>
                </div>
                <div className="rooms__list">
                    <List>
                        {rooms.map((room, index) => (
                            <ListItem key={room._id}
                                secondaryAction={
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <IconButton edge="end" aria-label="delete" onClick={() => {
                                            setSelectedRoom(room);
                                            setEditChannelDialog(true)
                                        }}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton edge="end" aria-label="delete" onClick={() => {
                                            setSelectedRoom(room);
                                            setDeleteChannelDialog(true)
                                        }} >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Stack>
                                }
                                disablePadding
                            >
                                <ListItemButton selected={selectedRoomIndex === index}
                                    onClick={(event) => handleListItemClick(event, room, index)}>
                                    <ListItemAvatar>
                                        <Avatar {...stringAvatar(room.roomName)} variant="square" />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={<Typography type="body2"
                                            style={{ fontWeight: `${notifications.filter(n => n.room == room._id).length > 0 ? 'bold' : 'normal'}` }}>
                                            {room.roomName}
                                        </Typography>}
                                        // primary={room.roomName}
                                        secondary={room.roomType}
                                    />
                                </ListItemButton>
                            </ListItem>))}
                    </List>
                </div>
            </div>
            {addChannelDialog && (
                <NewRoom
                    isAddChannelDialogOpen={addChannelDialog}
                    onAddChannelDialogClose={(val) => handleAddChannel(val)}
                />
            )}
            {editChannelDialog && selectedRoom && (
                <EditRoom
                    selectedRoom={selectedRoom}
                    isEditChannelDialogOpen={editChannelDialog}
                    onEditChannelDialogClose={(val) => handleEditChannel(val)}
                />
            )}
            {deleteChannelDialog && selectedRoom && (
                <DeleteRoom
                    selectedRoom={selectedRoom}
                    isDeleteRoomDialogOpen={deleteChannelDialog}
                    onDeleteRoomDialogClose={(val) => handleDeleteChannel(val)}
                />
            )}
        </>
    )
}

RoomList.propTypes = {
    notifications: PropTypes.array.isRequired,
    value: PropTypes.object.isRequired,
    onRoomSelection: PropTypes.func.isRequired,
    removeNotification: PropTypes.func.isRequired,
}
const mapStateToProps = state => ({
    notifications: state.notification,
})
export default connect(mapStateToProps, { removeNotification })(RoomList);

