import React from 'react';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Button } from "react-bootstrap";
import {
  Highlight
} from 'react-instantsearch/dom';
import AppState from '/imports/startup/both/AppState.js';
import Actions from '/imports/startup/both/Actions.js';
import { GuestRigComponents } from '/imports/api/rig_components/guest_rig_components.js';
import classnames from 'classnames';
import QuickViewModal from "/imports/ui/both/modals/QuickViewModal.jsx";
import CompareButton from "/imports/ui/both/components/Results/CompareButton.jsx";
import AddToRigButton from "/imports/ui/both/components/Results/AddToRigButton.jsx";
import RemoveFromRigButton from "/imports/ui/both/components/Results/RemoveFromRigButton.jsx";
import InRigCount from "/imports/ui/both/components/Results/InRigCount.jsx";

const Result = ({hit, inRig, inRigCount, matchedComponentId, cx, QuickViewModalOpen}) =>
  <li key={hit._id} className={cx}>
    <h4>
      <Link to={'/c/' + hit.type + '/' + hit._id }>
        <Highlight attributeName="title" hit={hit} />
      </Link>
    </h4>
    <AddToRigButton component={hit} inRig={inRig} inRigCount={inRigCount} />
    { (inRig && inRigCount > 0) &&
      <span>
        <RemoveFromRigButton componentId={matchedComponentId} />
        <InRigCount count={inRigCount} />
      </span>
    }
    <Button className="quick-view"
      style={{marginLeft: 23}}
      bsSize="xsmall"
      onClick={ e => {
        e.preventDefault();
        AppState.set({QuickViewModalOpen: true, hit});
        // See <QuickViewModal/>
      }}><i className="fa fa-search"></i></Button>

    <CompareButton component={hit} componentId={hit._id} />
  </li>

export default withTracker(({hit}) => {
  const components = GuestRigComponents.find({rigId: AppState.get('currentRigId')}, {sort: {position: 1}}).fetch() || [];

  let inRig = false;
  let inRigCount = 0;
  let matchedComponentId = '';

  hit && components.map(c => {
    // console.log('c.componentId, hit._id', c.componentId, hit._id);
    if (c.componentId === hit._id) {
      inRigCount++;
      inRig = true;
      matchedComponentId = c._id;
    }
  });

  return {
    components,
    inRig,
    inRigCount,
    matchedComponentId,
    cx: classnames({inRig, Result: true}),
    QuickViewModalOpen: AppState.get('QuickViewModalOpen')
  }
})(Result)
