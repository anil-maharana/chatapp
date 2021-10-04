import React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import { withStyles, makeStyles } from "@mui/styles";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import MuiDialogTitle from "@mui/material/DialogTitle";
import MuiDialogContent from "@mui/material/DialogContent";
import MuiDialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import { useFormik, Field, FormikProvider } from "formik";
import * as yup from "yup";
import { FormHelperText } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import UserSelection from "../layouts/UserSelection";
import axios from 'axios';


const useStyles = makeStyles((theme) => ({
    root: {
        "& .MuiTextField-root": {
            margin: "8px",
            width: "25ch",
        },
    },
}));
const styles = (theme) => ({
    root: {
        margin: 0,
        padding: "16px",
    },
    closeButton: {
        position: "absolute",
        right: "8px",
        top: "8px",
        color: "grey",
    },
    backdrop: {
        // zIndex: theme.zIndex.drawer + 1,
        zIndex: 1,
        color: '#fff',
    },
});
const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle className={classes.root} {...other}>
            <Typography component={'span'} variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton
                    aria-label="close"
                    className={classes.closeButton}
                    onClick={onClose}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles((theme) => ({
    root: {
        paddingTop: "16px",
    },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
    root: {
        margin: 0,
        padding: "8px",
    },
}))(MuiDialogActions);

const channelFormValidationScheme = yup.object({
    roomName: yup
        .string("Enter Channel Title.")
        .required("Channel Title is required"),
    users: yup
        .array()
        .min(1, "Please select one User")
        .required("Users are required."),
    // users: yup.string("Enter Users").required("Users are required."),
    roomType: yup
        .string("Select Channel Type")
        .required("Channel Type is required"),
});

export default function EditRoom({
    selectedRoom,
    isEditChannelDialogOpen,
    onEditChannelDialogClose,
}) {
    const [open, setOpen] = React.useState(isEditChannelDialogOpen);
    const [isDataLoading, setDataLoading] = React.useState(false);

    const handleClose = () => {
        setOpen(false);
        onEditChannelDialogClose(false);
    };

    const handleChannelFormSubmit = async (data) => {
        setDataLoading(true);
        _updateRoom(data);
    };
    const _updateRoom = async (data) => {
        const res = await axios.put(
            `http://localhost:5000/api/rooms/${selectedRoom._id}`,
            {
                roomName: data.roomName,
                roomType: data.roomType,
                users: data.users.map(u => u._id).filter((v, i, a) => a.indexOf(v) === i),
            });
        //console.log(res);
        setDataLoading(false);
        setOpen(false);
        onEditChannelDialogClose(true);
    }
    const formik = useFormik({
        initialValues: {
            roomName: selectedRoom.roomName,
            roomType: selectedRoom.roomType,
            users: selectedRoom.users
        },
        validationSchema: channelFormValidationScheme,
        onSubmit: (values) => {
            handleChannelFormSubmit(values);
        },
    });
    return (
        <div>
            <Dialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <FormikProvider value={formik}>
                    <form onSubmit={formik.handleSubmit}>
                        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                            Edit Room Details
                        </DialogTitle>
                        <DialogContent dividers>
                            <Grid container alignContent="flex-start" spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        id="roomName"
                                        name="roomName"
                                        label="Name"
                                        value={formik.values.roomName}
                                        onChange={formik.handleChange}
                                        error={
                                            formik.touched.roomName &&
                                            Boolean(formik.errors.roomName)
                                        }
                                        helperText={
                                            formik.touched.roomName && formik.errors.roomName
                                        }
                                        variant="outlined"
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Field
                                        label="Users"
                                        id="users"
                                        name="users"
                                        component={UserSelection}
                                        onChange={formik.setFieldValue}
                                        onBlur={formik.setFieldTouched}
                                        value={formik.values.users}

                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl
                                        component="fieldset"
                                        error={
                                            formik.touched.roomType &&
                                            Boolean(formik.errors.roomType)
                                        }
                                    >
                                        <FormLabel component="legend">Channel Type</FormLabel>
                                        <RadioGroup
                                            aria-label="Channel Type"
                                            id="roomType"
                                            name="roomType"
                                            value={formik.values.roomType}
                                            onChange={formik.handleChange}
                                        >
                                            <FormControlLabel
                                                value="Private"
                                                control={<Radio />}
                                                label="Private"
                                            />
                                            <FormControlLabel
                                                value="Public"
                                                control={<Radio />}
                                                label="Public"
                                            />
                                        </RadioGroup>
                                        {formik.touched.roomType &&
                                            Boolean(formik.errors.roomType) && (
                                                <FormHelperText>
                                                    {formik.errors.roomType}
                                                </FormHelperText>
                                            )}
                                    </FormControl>
                                </Grid>
                            </Grid>
                            {/* <div>
              <Backdrop className={classes.backdrop} open={isDataLoading}>
                <CircularProgress color="inherit" />
              </Backdrop>
            </div> */}
                            {isDataLoading && <CircularProgress color="inherit" />}
                        </DialogContent>
                        <DialogActions>
                            <Button autoFocus type="submit" variant="outlined" color="primary">
                                Save changes
                            </Button>
                            <Button
                                autoFocus
                                onClick={handleClose}
                                variant="outlined"
                                color="secondary"
                            >
                                close
                            </Button>
                        </DialogActions>
                    </form>
                </FormikProvider>
            </Dialog>
        </div>
    );
}
