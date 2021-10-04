import React from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';

const Home = ({ isAuthenticated }) => {
    //redirect if loggedin
    if (isAuthenticated) {
        return <Redirect to="/dashboard" />
    }
    return (
        <div>
            Home
        </div>
    )
}
Home.prototypes = {
    isAuthenticated: PropTypes.bool,
}
const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
})
export default connect(mapStateToProps, {})(Home);
