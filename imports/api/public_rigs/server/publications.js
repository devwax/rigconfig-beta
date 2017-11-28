import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { PublicRigs } from '../public_rigs.js';
import { AppConfig } from '/imports/startup/both/AppConfig.js';

Meteor.publish('publicRigs', function publicRigsPub(limit = AppConfig.paginationDefault) {
  check(limit, Number)
  return PublicRigs.find({
    public: true
  }, {
    sort: {publishedAt: -1},
    fields: PublicRigs.publicFields,
    limit
  })

})

Meteor.publish('usersPublicRigs', function usersPublicRigsPub(pk) {
  check(pk, String)
  return PublicRigs.find({
    pk,
    public: true
  }, {
    fields: PublicRigs.publicFields,
    limit: 1
  })
})

Meteor.publish('singleRig', function singleRigPub(rigId) {
  check(rigId, String)
  return PublicRigs.find({
    rigId,
    public: true
  }, {
    fields: PublicRigs.publicFields,
    limit: 1
  })
})
