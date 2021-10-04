import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import axios from 'axios';

import { Typography } from '@mui/material';
export default function DeleteRoom({ selectedRoom, isDeleteRoomDialogOpen, onDeleteRoomDialogClose, }) {
    const [open, setOpen] = React.useState(isDeleteRoomDialogOpen);
    const [loading, setLoading] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        onDeleteRoomDialogClose(false);
    };
    const _handleDeleteRoom = () => {
        setLoading(true);
        _deleteRoom();
    }
    const _deleteRoom = async (data) => {
        const res = await axios.delete(`http://localhost:5000/api/rooms/${selectedRoom._id}`);
        // console.log(res);
        setLoading(false);
        setOpen(false);
        onDeleteRoomDialogClose(true);
    }
    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Are you sure to delete the Room?
                </DialogTitle>
                <DialogContent dividers>
                    <ul style={{ listStyleType: 'none' }}>
                        <li>{`Room Name: ${selectedRoom.roomName}`}</li>
                        <li>{`Room Type: ${selectedRoom.roomType}`}</li>
                        <li>
                            <Stack direction="row" spacing={1} display="inline-flex">
                                <Typography component={'span'} variant={'body2'}>Users: </Typography>
                                {selectedRoom.users.map(user =>
                                    <Chip key={user._id}
                                        avatar={<Avatar src={user.avatar} />}
                                        label={`${user.firstName}, ${user.lastName}`}
                                        variant="outlined"
                                    />)}
                            </Stack>
                        </li>
                    </ul>
                </DialogContent>
                <DialogActions>
                    {loading && <span>Deleting the room. please wait..</span>}
                    <Button autoFocus variant="outlined" color="primary" onClick={_handleDeleteRoom} disabled={loading}>Ok</Button>
                    <Button onClick={handleClose} variant="outlined" color="secondary" disabled={loading}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
