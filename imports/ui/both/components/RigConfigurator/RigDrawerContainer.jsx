// NOT USED
// import { Meteor } from 'meteor/meteor';
// import React from 'react';
// import { withTracker } from 'meteor/react-meteor-data';
// import AppState from '/imports/startup/both/AppState.js';
// // import { Rigs } from '/imports/api/rigs/rigs.js';
// import { GuestRigs } from '/imports/api/rigs/guest_rigs.js';
// import { GuestRigComponents } from '/imports/api/rig_components/guest_rig_components.js';
// import { PublicRigs } from '/imports/api/public_rigs/public_rigs.js'
// import RigDrawer from './RigDrawer.jsx';
//
// export default withTracker(() => {
//   const currentRigId = AppState.get('currentRigId')
//   const rigSelectorOpen = AppState.get('rigSelectorOpen')
//
//   let loading = false
//   let rigExists = true
//   let rig = {}
//   let components = []
//   let myrigs = []
//   let myPublicRigs = []
//   let currentPublicRig = {}
//   // let myPublicRigsHandle = { ready: () => false }
//
//   if (Meteor.isClient) {
//     myrigs = GuestRigs.find({}, {sort: {lastSelected: -1}}).fetch()
//     rig = GuestRigs.findOne(currentRigId)
//     components = GuestRigComponents.find({rigId: rig._id}, {sort: {position: 1}}).fetch()
//     AppState.set({componentsCount: components.length})
//
//     // subscribe to users public rigs, based on local private key (pk)
//     const myPublicRigsHandle = Meteor.subscribe('usersPublicRigs', AppState.get('pk'))
//     // console.log('myPublicRigsHandle:', myPublicRigsHandle.ready());
//     if (myPublicRigsHandle.ready()) {
//       myPublicRigs = PublicRigs.find().fetch()
//       // console.log('myPublicRigs:', myPublicRigs);
//       if (PublicRigs.find().count() > 0) {
//         currentPublicRig = PublicRigs.findOne({rigId: currentRigId})
//         // console.log(AppState.get('currentPublicRig:', currentPublicRig));
//         // console.log('currentPublicRig', currentPublicRig);
//       }
//     } else {
//       myPublicRigs = []
//     }
//   }
//   return {
//     currentRigId,
//     loading,
//     rig,
//     rigExists,
//     components,
//     myrigs,
//     rigSelectorOpen,
//     myPublicRigs,
//     currentPublicRig
//   }
// })(RigDrawer)
