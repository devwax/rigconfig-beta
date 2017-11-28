import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import AppState from '/imports/startup/both/AppState.js';
import Actions from '/imports/startup/both/Actions.js';
import { GuestUser } from '/imports/api/user/guest_user.js';
import { GuestRigs } from '/imports/api/rigs/guest_rigs.js';
import { GuestRigComponents } from '/imports/api/rig_components/guest_rig_components.js';

/**
  This is where client-side data is initialized and syncronized via localstorage
  w/ PersistentMinimongo. See: GuestUser, GuestRigs, etc.
*/
let GuestUserId
let GuestCurrentRigId

// Create a client-only anonymous user if one doesn't exist.
if (GuestUser.find().count() === 0) {
  // Create random private key (pk), to be used for anonymous publishing of rigs to public server.
  const pk = (Random.id(3) + '-' + Random.id(3) + '-' + Random.id(3)).toUpperCase()
  GuestUserId = GuestUser.insert({
    username: 'Anonymous',
    pk,
    created_at: new Date(),
    settings: {
      showNotice_AnonymousPrivateKey: true
    }
  })
  AppState.set({pk, GuestUserId})
} else {
  /**
    Otherwise, if a user exists then retrieve it.
    PersistentMinimongo re-acquires user from localstorage on startup.
  */
  const { pk, GuestUserId } = GuestUser.findOne()
  AppState.set({pk, GuestUserId})
}

// If No rigs exists, create one.
if (GuestRigs.find().count() === 0) {
  GuestCurrentRigId = Actions.createNewBlankRig()
  AppState.set({ currentRigId: GuestCurrentRigId })
} else {
  // Otherwise use the most recently selected rig.
  GuestCurrentRigId = GuestRigs.findOne({}, {sort: {lastSelected: -1}})._id
  AppState.set({ currentRigId: GuestCurrentRigId })
}
