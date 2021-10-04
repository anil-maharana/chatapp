import React from 'react'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar'; import '../../App.css';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../redux/actions/auth';

const ChatAppBar = ({ auth: { isAuthenticated, loading, user }, logout }) => {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed" className="appBar">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Chat App
                    </Typography>
                    <Stack direction="row" spacing={2}>
                        {!loading && (isAuthenticated ? <>
                            <Avatar alt={`${user.firstName}, ${user.lastName}`} src={`${user.avatar}`} />
                            <span>{`${user.firstName}, ${user.lastName}`}</span>
                            <Button
                                variant="outlined"
                                color="inherit"
                                onClick={() => logout()}
                            >
                                logout
                            </Button>
                        </> : <><Button
                            variant="outlined"
                            component={Link}
                            to="/register"
                            color="inherit">
                            Register
                        </Button>
                            <Button
                                variant="outlined"
                                component={Link}
                                to="/login"
                                color="inherit">
                                Login
                            </Button></>)}
                    </Stack>
                </Toolbar>
            </AppBar>
        </Box>
    )
}
ChatAppBar.prototypes = {
    logout: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth
})
export default connect(mapStateToProps, { logout })(ChatAppBar);
