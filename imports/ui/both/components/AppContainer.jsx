import React from "react";
import { BrowserRouter as Router } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import App from '/imports/ui/both/components/App.jsx';

const AppContainer = () => {
  return (
    <Router>
      <App />
    </Router>
  )
}

export default AppContainer;
