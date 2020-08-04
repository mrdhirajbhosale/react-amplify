import React, { Component } from 'react'
import './App.css';
import Typography from '@material-ui/core/Typography';
import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";
import Home from './components/Home';


class App extends Component{
  render(){
    return (
          <div>
            <Typography variant="h6" id="tableTitle" component="div" align="center" style={{"color": "#0097f1", "fontweight": "bold"}}>
              Events List
            <AmplifySignOut style={{"float":"right"}}></AmplifySignOut>
            </Typography>
            <Home/>
        </div>
    );
  }
}    

export default withAuthenticator(App)