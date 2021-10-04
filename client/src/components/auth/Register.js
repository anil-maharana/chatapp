import React, { useState } from 'react';
import { Link as Routerlink, Redirect } from 'react-router-dom'

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import { PropTypes } from 'prop-types'
import { useFormik } from "formik";
import * as yup from "yup";

import { connect } from 'react-redux';
import { register } from '../../redux/actions/auth'
const theme = createTheme();
const Register = ({ register, isAuthenticated }) => {
    const [submitted, setSubmitted] = useState(false);
    const initailSignUpFormValues = {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordVerify: ""
    };

    const signUpFormSchema = yup.object({
        firstName: yup
            .string("Enter First Name")
            .required("First Name is required."),
        lastName: yup
            .string("Enter Last Name")
            .required("Last Name is required."),
        email: yup
            .string("Enter E-Mail Address.")
            .required("E-Mail Address is required.")
            .email("Invalid E-Mail Address"),
        password: yup
            .string("Enter Password.")
            .length(6, 'Enter minimu 6 characters.')
            .required("Password is required."),
        passwordVerify: yup
            .string("Enter the Password again.")
            .required("Password is required."),
    });

    const formik = useFormik({
        initialValues: initailSignUpFormValues,
        validationSchema: signUpFormSchema,
        onSubmit: async (values, { resetForm, setFieldError }) => {
            if (values.password !== values.passwordVerify) return setFieldError('passwordVerify', `Password doesn't match.`);
            const { firstName, lastName, email, password } = values;
            register({ firstName, lastName, email, password });
        },
    });
    if (isAuthenticated) {
        return <Redirect to="/dashboard" />
    }
    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    <Box component="form" noValidate onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="fname"
                                    name="firstName"
                                    variant="outlined"
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    value={formik.values.firstName}
                                    onChange={formik.handleChange}
                                    error={
                                        formik.touched.firstName && Boolean(formik.errors.firstName)
                                    }
                                    helperText={formik.touched.firstName && formik.errors.firstName}
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    value={formik.values.lastName}
                                    onChange={formik.handleChange}
                                    error={
                                        formik.touched.lastName && Boolean(formik.errors.lastName)
                                    }
                                    helperText={formik.touched.lastName && formik.errors.lastName}
                                    autoComplete="lastName"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    error={formik.touched.email && Boolean(formik.errors.email)}
                                    helperText={formik.touched.email && formik.errors.email}
                                    autoComplete="email"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    error={
                                        formik.touched.password && Boolean(formik.errors.password)
                                    }
                                    helperText={formik.touched.password && formik.errors.password}
                                    autoComplete="current-password"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    name="passwordVerify"
                                    label="Re-Enter Password"
                                    type="password"
                                    id="passwordVerify"
                                    value={formik.values.passwordVerify}
                                    onChange={formik.handleChange}
                                    error={
                                        formik.touched.passwordVerify && Boolean(formik.errors.passwordVerify)
                                    }
                                    helperText={formik.touched.passwordVerify && formik.errors.passwordVerify}
                                    autoComplete="current-password"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={<Checkbox value="allowExtraEmails" color="primary" />}
                                    label="I want to receive inspiration, marketing promotions and updates via email."
                                />
                            </Grid>
                        </Grid>
                        {!submitted ? <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign Up
                        </Button> :
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                disabled
                            >
                                <CircularProgress color="secondary" size={20} /> Sign Up
                            </Button>}
                        <Grid container justify="flex-end">
                            <Grid item>
                                <Link variant="body2" component={Routerlink} to="/login">
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>

                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    )
}
Register.prototype = {
    register: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
}
const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
})
export default connect(mapStateToProps, {
    register
})(Register);
