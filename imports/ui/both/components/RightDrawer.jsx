import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Meteor } from 'meteor/meteor';
// import { withTracker } from 'meteor/react-meteor-data';
// import AppState from '/imports/startup/both/AppState.js';

import RigConfigurator from '/imports/ui/both/components/RigConfigurator/RigConfigurator.jsx';

export default function RightDrawer({drawerStates}) {
  return (
    <div id="RightDrawer" className={drawerStates}>
      <Scrollbars
        autoHide
        autoHideTimeout={500}
        autoHideDuration={500}
        universal={true}
        thumbMinSize={0}
      >
        <div className="RightDrawer-container">
          <RigConfigurator />
        </div>
      </Scrollbars>
    </div>
  )
}
