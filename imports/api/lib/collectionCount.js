import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';
import { ComponentCollectionNames } from '/imports/api/lib/ComponentTypes.js';
import { cpus } from '/imports/api/official_components/cpus/cpus.js';
import { motherboards } from '/imports/api/official_components/motherboards/motherboards.js';
import { video_cards } from '/imports/api/official_components/video_cards/video_cards.js';
import { cases } from '/imports/api/official_components/cases/cases.js';
import { cpu_fans } from '/imports/api/official_components/cpu_fans/cpu_fans.js';
import { memory } from '/imports/api/official_components/memory/memory.js';
import { psus } from '/imports/api/official_components/psus/psus.js';
import { ssds } from '/imports/api/official_components/ssds/ssds.js';

export const collectionCount = new ValidatedMethod({
  name: 'lib.collectionCount',
  validate: new SimpleSchema({
    collectionName: { type: String, max: 50 }
  }).validator(),
  run({collectionName}) {
    if (ComponentCollectionNames.indexOf(collectionName) !== -1) {
      return eval(collectionName).find().count()
    } else {
      throw new Meteor.Error("component-type-not-found", collectionName + " not in list.")
      return null
    }

  }
})
