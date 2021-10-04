import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom'
import { Redirect } from 'react-router';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import { green } from '@mui/material/colors';
import LockOutlined from '@mui/icons-material/LockClockOutlined';
import { useFormik } from "formik";
import * as yup from "yup";
import { connect } from 'react-redux';
import { login } from '../../redux/actions/auth';

import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: '64px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: "8px",
        // backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: "8px",
    },
    submit: {
        margin: '24px, 0px, 16px',
    },
}));

const Login = ({ login, isAuthenticated }) => {
    const classes = useStyles();

    const initailSignInValues = {
        email: "",
        password: "",
    };

    //SignIn form Schema
    const signInSchema = yup.object({
        email: yup
            .string("Enter E-Mail Address.")
            .required("E-Mail Address is required.")
            .email("Invalid E-Mail Address"),
        password: yup
            .string("Enter Password.")
            .required("Password is required."),
    });


    const formik = useFormik({
        initialValues: initailSignInValues,
        validationSchema: signInSchema,
        onSubmit: (values, { setFieldError }) => {
            console.log(values);
            // severity="error"
            // severity = "warning"
            // severity = "info"
            // severity = "success"
            login(values.email, values.password);
        },
    });
    //redirect if loggedin
    if (isAuthenticated) {
        return <Redirect to="/dashboard" />
    }
    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar sx={{ bgcolor: green[300] }}><LockOutlined /></Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <form className={classes.form} onSubmit={formik.handleSubmit}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                        autoComplete="email"
                        autoFocus
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                        autoComplete="current-password"
                    />

                    <FormControlLabel
                        control={<Checkbox value="remember" color="primary" />}
                        label="Remember me"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    // disabled={loading}
                    >
                        Sign In
                    </Button>
                </form>
                <Grid container>
                    <Grid item xs>
                        <Link variant="body2" component={RouterLink} to="/">
                            Forgot password?
                        </Link>
                    </Grid>
                    <Grid item>
                        <Link variant="body2" component={RouterLink} to="/register">
                            {"Don't have an account? Sign Up"}
                        </Link>
                    </Grid>
                </Grid>
            </div>
        </Container>
    );
}

Login.prototypes = {
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
}
const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
})
export default connect(mapStateToProps, { login })(Login);