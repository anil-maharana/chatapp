import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';


const PrivateRoute = ({ component: Component, auth: { isAuthenticated, loading }, ...restProps }) => (
    <Route {...restProps} render={props =>
        !isAuthenticated && !loading ?
            (<Redirect to='/' />) : (<Component {...props} />)} />
)

PrivateRoute.propTypes = {

}

const mapStateToProps = state => ({
    auth: state.auth
})
export default connect(mapStateToProps)(PrivateRoute);