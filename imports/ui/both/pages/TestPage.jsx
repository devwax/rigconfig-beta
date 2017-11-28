// NOT USED
import React from "react";
// import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

const TestPage = () => {
    return (
      <div>
        <h2>TestPage</h2>
      </div>
    )
}

export default withTracker((props) => {
  // console.log('props-TestPage:', props);
  return {}
})(TestPage)
