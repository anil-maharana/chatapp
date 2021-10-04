import React from 'react';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { removeAlert } from '../../redux/actions/alert'
const Alerts = ({ alerts, removeAlert }) => (
    <Stack spacing={2}>
        {
            alerts.map(alert => (
                <Alert severity={alert.alertType}
                    key={alert.id}
                    onClose={() => removeAlert(alert.id)}
                >
                    {alert.message}
                </Alert>))
        }
    </Stack>
);
Alerts.prototype = {
    alerts: PropTypes.array.isRequired,
    removeAlert: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    alerts: state.alert,
})

export default connect(mapStateToProps, { removeAlert })(Alerts)
