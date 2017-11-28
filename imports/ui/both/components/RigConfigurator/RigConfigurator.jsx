import { Meteor } from 'meteor/meteor';
import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import AppState from '/imports/startup/both/AppState.js';
import Actions from '/imports/startup/both/Actions.js';
import { Button } from 'react-bootstrap';
import { GuestUser } from '/imports/api/user/guest_user.js';
import { GuestRigs } from '/imports/api/rigs/guest_rigs.js';
import { GuestRigComponents } from '/imports/api/rig_components/guest_rig_components.js';
import { PublicRigs } from '/imports/api/public_rigs/public_rigs.js'
import { getCurrentPublicRig } from '/imports/api/public_rigs/methods.js'
import { formatCurrency } from '/imports/ui/both/helpers'
import RigSelector from './RigSelector.jsx';
import RigToolbar from './RigToolbar.jsx';
import RigComponent from './RigComponent.jsx';
import NoComponentsMessage from './NoComponentsMessage.jsx';

class RigConfigurator extends React.Component {
  _handleEscKey(e) {
    if(e.keyCode == 27){ // [esc]
      AppState.set({rigSelectorOpen: false})
    }
  }

  componentWillMount() {
    document.addEventListener("keydown", this._handleEscKey, false)
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this._handleEscKey, false)
  }

  render() {
    const { rig, components, componentsCount, hasComponents, myrigs, currentPublicRig, rigSelectorOpen, GuestUserData } = this.props;
    let currencySymbol = '';
    let totalRigCostNumeric = parseFloat((0).toFixed(2));

    // @todo move this to a <RigComponentsList /> component
    const RigComponents = components.map(component => {
      // If the first character is not a number, then treat it as a currency symbol.
      // @todo - This is just a quick convenience feature at this point.
      if (component.price && isNaN(component.price[0])) {
        currencySymbol = component.price[0]
      }

      // @todo - should be recalculating the rig's cost elsewhere... not in the render method.
      if (component.priceNumeric) {
        totalRigCostNumeric += parseFloat((component.priceNumeric).toFixed(2))
      }
      return (<RigComponent component={component} key={component._id} />)
    })

    const totalRigCostFormatted = formatCurrency(totalRigCostNumeric)

    // update rig with cumulative total price of components.
    // @todo - stop component update w/ lifecycle method if rig data has not changed?
    GuestRigs.update({ _id: rig._id }, { $set: { cost: (currencySymbol + totalRigCostNumeric), costNumeric: totalRigCostNumeric } })

    let forkSourceId = false;
    if (rig.hasOwnProperty('forkSourceId') && rig.forkSourceId) {
      forkSourceId = rig.forkSourceId
    }

    return (
      <div id="RigConfigurator">
        <RigSelector rigTitle={rig.title} rigId={rig._id} rigPublic={rig.public} { ...{rigSelectorOpen, myrigs} } forkSourceId={forkSourceId}/>
        <RigToolbar rig={rig} currentPublicRig={currentPublicRig} GuestUserData={GuestUserData} />
        <div id="components-list">
          <h4 className="section-title">Components ({componentsCount}) <span id="totalRigCostFormatted-header">{currencySymbol + totalRigCostFormatted}</span></h4>
          { hasComponents ? RigComponents : <NoComponentsMessage /> }
        </div>

        <Button className="addButton" bsSize="small" onClick={(e) => { Actions.addCustomComponentToRig(e, {}) }}><i className="fa fa-plus"></i>&nbsp; Add Component</Button>

        <div className="rig-details-footer">
          <span className="label">Total:</span> {currencySymbol + totalRigCostFormatted}
          <br />
          <span className="num-components">{componentsCount} components</span>
        </div>
      </div>
    );
  }
}

/* Reactive Container for: <RigConfigurator /> */
export default withTracker(() => {
  const currentRigId = AppState.get('currentRigId')
  const rigSelectorOpen = AppState.get('rigSelectorOpen')
  const myrigs = GuestRigs.find({}, {sort: {lastSelected: -1}}).fetch()
  const rig = GuestRigs.findOne(currentRigId)
  const components = GuestRigComponents.find({rigId: rig._id}, {sort: {position: 1}}).fetch() || []
  const componentsCount = components.length
  AppState.set({componentsCount})
  const hasComponents = componentsCount > 0

  // uses meteor method to sync with local store w/ public rig data if exists.
  let currentPublicRig = false
  getCurrentPublicRig.call({pk: AppState.get('pk'), rigId: currentRigId}, (e, r) => {
    if (r) {
      currentPublicRig = r
      // Sync public/private status, if a public rig is found on server
      if (currentPublicRig) {
        GuestRigs.update({_id: currentRigId}, {$set: {public: currentPublicRig.public}})
        AppState.set({currentPublicRig})
        // console.log('AppState > currentPublicRig:', currentPublicRig);
      }
    } else if (e) {
      console.log('getCurrentPublicRig > error:', e);
    }
  })

  return {
    currentRigId,
    rig,
    components,
    componentsCount,
    hasComponents,
    myrigs,
    rigSelectorOpen,
    currentPublicRig: AppState.get('currentPublicRig'),
    GuestUserData: Meteor.isClient ? GuestUser.findOne() : {}
  }
})(RigConfigurator)
