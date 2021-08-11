import React from "react";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { AuthProvider } from "../contexts/AuthContext";

import Chats from "./Chats";
import Demo from "./chat/Demo";
import Login from "./Login";
import Profile from "./Profile";
import RecordVideo from "./video";
import Chatapp from "./chat/Chatapp";

function App() {
  return (
    // <div style={{ fontFamily: "Avenir" }}>
      <Router>
        {/* <AuthProvider> */}
          <Switch>
            <Route path="/chats" component={Chatapp} />
            <Route path="/profile" component={Profile} /> 
            <Route path="/video" component={RecordVideo} />
            <Route path="/demo" component={Chatapp} />
            <Route path="/" component={Login} />
          </Switch>
        {/* </AuthProvider> */}
      </Router>
    // </div>
  );
}

export default App;
