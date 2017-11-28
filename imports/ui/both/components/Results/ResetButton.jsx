import { Meteor } from 'meteor/meteor';
import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import AppState from '/imports/startup/both/AppState.js';

function ResetButton({algoliaActive}) {
  if (algoliaActive) {
    return (
      <button onClick={() => { Actions.clearAlgoliaSearch() }}>Reset</button>
    )
  } else {
    return null
  }
}

export default withTracker(() => {
  return {
    algoliaActive: AppState.get('algoliaActive')
  }
})(ResetButton)
