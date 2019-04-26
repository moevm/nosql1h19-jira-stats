import React, {Component} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
// import { renderRoutes } from 'react-router-config';
import './App.scss';

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;

// Containers
const Layout = React.lazy(() => import('./containers/Layout.js'));

// Pages
const Login = React.lazy(() => import('./views/Pages/Login'));

class App extends Component {

    render() {
        return (
            <BrowserRouter>
                <React.Suspense fallback={loading()}>
                    <Switch>
                        <Route exact path="/login" name="Login Page" render={props => <Login {...props}/>}/>
                        <Route path="/" name="Home" render={props => <Layout {...props}/>}/>
                    </Switch>
                </React.Suspense>
            </BrowserRouter>
        );
    }
}

export default App;
