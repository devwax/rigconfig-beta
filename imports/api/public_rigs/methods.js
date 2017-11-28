import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';
import { PublicRigs } from './public_rigs.js';
import { truncateText } from '/imports/ui/both/helpers';
import { slugify } from '/imports/api/lib/slugify.js';

export const insertPublicRig = new ValidatedMethod({
  name: 'public_rigs.insertPublicRig',
  validate: new SimpleSchema(PublicRigs.schema).validator(),
  run({owner, pk, rigId, title, public, username, desc, price, components}) {
    const slug = slugify(title)
    username = truncateText(username.replace(/[^\w\s]/gi, ''), 30)
    const duplicateRig = PublicRigs.findOne({rigId, pk})
    const publicRig = { owner, pk, rigId, title, public, username, slug, desc, price, components }

    if (duplicateRig) {
      if (Meteor.isServer) {
        const _id = duplicateRig._id

        if (publicRig.hasOwnProperty("desc")) {
          publicRig.desc = publicRig.desc.replace(/<(?:.|\n)*?>/gm, '');
        }

        if (publicRig.hasOwnProperty("title")) {
          publicRig.title = publicRig.title.replace(/<(?:.|\n)*?>/gm, '');
        }

        PublicRigs.update({_id, pk}, { $set: {...publicRig} })
      }
      return 'Duplicate found... updating on server.'
    } else {
      // No duplicate found, inserting new public rig
      return PublicRigs.insert(publicRig)
    }
  }
})

export const makePublicRigPrivate = new ValidatedMethod({
  name: 'public_rigs.makePublicRigPrivate',
  validate: new SimpleSchema({
    pk:    { type: String, max: 20, optional: false },
    rigId: { type: String, max: 20, optional: false }
  }).validator(),
  run({pk, rigId}) {
    let res;
    if (Meteor.isServer) {
      res = PublicRigs.update({rigId: rigId, pk: pk}, { $set: { public: false} })
    }
    return res // @todo - handle condition condition where pk doesn't match (wrong public key)
  }
})

export const deletePublicRig = new ValidatedMethod({
  name: 'public_rigs.deletePublicRig',
  validate: new SimpleSchema({
    pk:    { type: String, max: 20, optional: false },
    rigId: { type: String, max: 20, optional: false }
  }).validator(),
  run({pk, rigId}) {
    let res = null;
    if (Meteor.isServer) {
      PublicRigs.update({rigId, pk}, { $set: { public: false} })
      res = PublicRigs.remove({rigId: rigId, pk: pk})
    }
    return res // @todo - handle condition condition where pk doesn't match (wrong public key)
  }
})

export const publicRigsCount = new ValidatedMethod({
  name: 'public_rigs.publicRigsCount',
  validate: new SimpleSchema({}).validator(),
  run() {
    return PublicRigs.find({public: true}).count()
  }
})

export const getCurrentPublicRig = new ValidatedMethod({
  name: 'public_rigs.getCurrentPublicRig',
  validate: new SimpleSchema({
    pk:    { type: String, max: 20, optional: false },
    rigId: { type: String, max: 20, optional: false }
  }).validator(),
  run({pk, rigId}) {
    return PublicRigs.findOne({pk, rigId})
  }
})
