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
    {/* <h4 onClick={ e => {e.preventDefault(); AppState.set({QuickViewModalOpen: true, hit: hit});} }> */}
    <h4>
      <Link to={'/c/' + hit.type + '/' + hit._id }>
        <Highlight attributeName="title" hit={hit} />
      </Link>
    </h4>
    <AddToRigButton component={hit} inRig={inRig} inRigCount={inRigCount} />
    { (inRig && inRigCount > 0) &&
      <span>
        <RemoveFromRigButton componentId={matchedComponentId} />
        {/* <Button className="minus" style={{marginLeft: 5}} bsSize="xsmall" onClick={ e => {e.preventDefault(); Actions.deleteFromRig(matchedComponentId);} }><i className="fa fa-minus"></i></Button> */}
        {/* <span className="count">{'(x'+inRigCount+')'}</span> */}
        <InRigCount count={inRigCount} />
      </span>
    }
    <Button className="quick-view"
      style={{marginLeft: 23}}
      bsSize="xsmall"
      onClick={ e => {
        e.preventDefault();
        AppState.set({QuickViewModalOpen: true, hit});
      }}><i className="fa fa-search"></i></Button>
    {/* <QuickViewModal QuickViewModalOpen={QuickViewModalOpen} hit={hit} /> */}
    <CompareButton component={hit} componentId={hit._id} />
    {/* <span className="compare-components">
      <div className="ais-RefinementList__item ais-RefinementList__itemSelected">
        <label>
          <input type="checkbox" class="ais-RefinementList__itemCheckbox ais-RefinementList__itemCheckboxSelected" value="on" />
          <span className="ais-RefinementList__itemBox ais-RefinementList__itemBox ais-RefinementList__itemBoxSelected"></span>
          <span className="ais-RefinementList__itemLabel ais-RefinementList__itemLabel ais-RefinementList__itemLabelSelected">COMPARE</span>
        </label>
      </div>
    </span> */}
  </li>

// const AddToRigButton = ({component, inRig, inRigCount}) =>
//   <Button
//     className={"add-to-rig-button" + (inRig ? " inRig" : "")}
//     bsStyle="default"
//     title="Add to Rig"
//     bsSize="small"
//     onClick={e => Actions.addToRig(component) }>
//     <i className="fa fa-plus"></i>
//   </Button>

// const RemoveFromRigButton = ({componentId}) =>
//   <Button className="minus" style={{marginLeft: 5}} bsSize="xsmall" onClick={ e => {e.preventDefault(); Actions.deleteFromRig(componentId);} }><i className="fa fa-minus"></i></Button>

// const InRigCount = ({count}) =>
//   <span className="count">{'(x'+count+')'}</span>

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
  // console.log('Results: hit', hit);
  return {
    components,
    inRig,
    inRigCount,
    matchedComponentId,
    cx: classnames({inRig, Result: true}),
    QuickViewModalOpen: AppState.get('QuickViewModalOpen')
  }
})(Result)
