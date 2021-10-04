import React, { Fragment, useEffect } from 'react';
import './App.css';
import ChatAppBar from './components/layouts/ChatAppBar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/Dashboard';
import Home from './components/home/Home';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { loadUser } from './redux/actions/auth';
import setAuthToken from './utils/setAuthToken';
import PrivateRoute from './components/route/PrivateRoute';
//Redux
import { Provider } from 'react-redux';
import store from './redux/store';
import Alerts from './components/layouts/Alerts';

//socket Context
import SocketContext, { socket } from "./context/SocketContext";


if (localStorage.token) {
  setAuthToken(localStorage.token)
}
const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, [])
  return (
    <Provider store={store}>
      <SocketContext.Provider value={socket}>
        <Router>
          <Fragment>
            <ChatAppBar />
            <Route exact path="/" component={Home} />
            <section className="dashboard">
              <Alerts />
              <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/register" component={Register} />
                <Route exact path="/login" component={Login} />
                <PrivateRoute exact path="/dashboard" component={Dashboard} />
              </Switch>
            </section>
          </Fragment>
        </Router>
      </SocketContext.Provider>

    </Provider>)
}

export default App;
