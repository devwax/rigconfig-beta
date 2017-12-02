import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Button } from "react-bootstrap";
import {
  Highlight
} from 'react-instantsearch-meteor/dom';
import Actions from '/imports/startup/both/Actions.js';
import { GuestRigComponents } from '/imports/api/rig_components/guest_rig_components.js';
import classnames from 'classnames';

const Result = ({hit, inRig, inRigCount, cx}) =>
  <li key={hit._id} className={cx}>
    <h4>
      <Highlight attributeName="title" hit={hit} />
    </h4>
    <Button
      // disabled={inRig}
      className="add-to-rig-button"
      bsStyle="default"
      bsSize="small"
      onClick={e => Actions.addToRig(hit) }>
      <i className="fa fa-plus" style={{marginRight: 5}}></i>
      <span>Add to Rig</span>
    </Button>
    { (inRig && inRigCount > 0) && (<span>inRigCount: {inRigCount}</span>)}
  </li>

export default withTracker(({hit}) => {
  const components = GuestRigComponents.find({rigId: AppState.get('currentRigId')}, {sort: {position: 1}}).fetch() || [];

  let inRig = false;
  let inRigCount = 0;

  components.map(c => {
    // console.log('  c:', c.title, c.componentId);
    // console.log('hit:', hit.title, hit._id);
    // console.log('_____________________________________________________________');
    if (c.componentId === hit._id) {
      inRigCount++;
      inRig = true;
      return;
    }
  });

  return {
    components,
    inRig,
    inRigCount,
    cx: classnames({inRig, Result: true})
  }
})(Result)
