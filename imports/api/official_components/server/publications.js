import { Meteor } from 'meteor/meteor';
import { AppConfig } from '/imports/startup/both/AppConfig.js';
import { check } from 'meteor/check';
import { ComponentCollectionNames } from '/imports/api/lib/ComponentTypes.js';
import { cpus } from '/imports/api/official_components/cpus/cpus.js';
import { motherboards } from '/imports/api/official_components/motherboards/motherboards.js';
import { video_cards } from '/imports/api/official_components/video_cards/video_cards.js';
import { cases } from '/imports/api/official_components/cases/cases.js';
import { cpu_fans } from '/imports/api/official_components/cpu_fans/cpu_fans.js';
import { memory } from '/imports/api/official_components/memory/memory.js';
import { psus } from '/imports/api/official_components/psus/psus.js';
import { ssds } from '/imports/api/official_components/ssds/ssds.js';

// Single Component
Meteor.publish('singleComponent', function singleComponentPub(ComponentType, id) {
  check(ComponentType, String)
  check(id, String)

  if ( ComponentCollectionNames.indexOf(ComponentType) !== -1) {
    // console.log('Collection', Collection);
    const Collection = eval(ComponentType)
    return Collection.find({
      _id: id
    }, {
      fields: Collection.publicFields
    })
  } else {
    throw new Meteor.Error("component-type-not-found", ComponentType + " not in list.")
    return
  }
})

// All Components
Meteor.publish('allComponents', function allComponentsPub(ComponentType, limit = AppConfig.paginationDefault) {
  check(ComponentType, String)
  check(limit, Number)

  if ( ComponentCollectionNames.indexOf(ComponentType) !== -1) {
    const Collection = eval(ComponentType)
    return Collection.find({}, {
      fields: Collection.publicFields,
      limit
    })
  } else {
    throw new Meteor.Error("component-type-not-found", ComponentType + " not in list.")
    return
  }
})
