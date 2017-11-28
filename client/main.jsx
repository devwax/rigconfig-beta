import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
// import App from '/imports/ui/both/components/App.jsx';
import AppContainer from '/imports/ui/both/components/AppContainer.jsx';
import '/imports/startup/client/create-utopia.js'

Meteor.startup(() => {
  render(<AppContainer />, document.getElementById('render-target'));
});
