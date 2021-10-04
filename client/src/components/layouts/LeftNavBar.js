import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Phone from '@mui/icons-material/Phone';
import MessageIcon from '@mui/icons-material/Message';
import GroupsIcon from '@mui/icons-material/Groups';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';

import RecentChats from '../recentChats/RecentCharts';
import Contacts from '../contacts/Contacts';
import RoomDashBoard from '../rooms/RoomDahsboard';
import Calls from '../calls/Calls';
import Badge from '@mui/material/Badge';

import { connect } from 'react-redux';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{
                    // p: 3
                }}>
                    <Typography component={'span'} variant={'body2'}>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

const LeftnavBar = ({ notifications }) => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box
            sx={{
                flexGrow: 1, bgcolor: 'background.paper', display: 'flex',
                height: "100%"
            }}
        >
            <Tabs
                orientation="vertical"
                variant="scrollable"
                value={value}
                onChange={handleChange}
                aria-label="Vertical tabs example"
                sx={{ borderRight: 1, borderColor: 'divider' }}
            >
                <Tab icon={<MessageIcon />} label="Chat" label={"Chat"} {...a11yProps(0)} />
                <Tab icon={<Badge badgeContent={notifications.length} anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }} color="primary"><GroupsIcon /></Badge>} label="Room" {...a11yProps(1)} />
                <Tab icon={<PermContactCalendarIcon />} label="Contact" {...a11yProps(2)} />
                <Tab icon={<Phone />} label="Call" {...a11yProps(3)} />
            </Tabs>
            <TabPanel value={value} index={0} style={{ width: "100%" }}>
                <RecentChats />
            </TabPanel>
            <TabPanel value={value} index={1} style={{ width: "100%" }}>
                <RoomDashBoard />
            </TabPanel>
            <TabPanel value={value} index={2} style={{ width: "100%" }}>
                <Contacts />
            </TabPanel>
            <TabPanel value={value} index={3} style={{ width: "100%" }}>
                <Calls />
            </TabPanel>
        </Box>
    );
}
LeftnavBar.propTypes = {
    notifications: PropTypes.array.isRequired,
}

const mapStateToProps = state => ({
    notifications: state.notification,
})
export default connect(mapStateToProps, {})(LeftnavBar);

