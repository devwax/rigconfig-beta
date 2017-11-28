// NOT USED - see api/official_components/server/
/*
import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import AppState from '/imports/startup/both/AppState.js';
import { cpus } from '../cpus.js';

// Meteor.publish('cpus.all', function cpusPub(params = {}) {
Meteor.publish('cpus.all', function cpusPub(params = {}) {
  new SimpleSchema({
    limit:   { type: Number, defaultValue: AppState.get('paginationLimit'), optional: true },
    listId:  { type: String, max: 50, optional: true },
    options: {
      type: Object,
      defaultValue: {},
      minCount: 0,
      maxCount: 50,
      optional: true
    },
    "options.limit": { type: Number, optional: true}
  }).validate(params);
  // console.log("params.options:", params.options );
  // delete params["options"]
  // console.log("params.options:", params.options );
  const limit = params.hasOwnProperty("options") && params.options.hasOwnProperty("limit") ? params.options.limit : AppState.get('paginationLimit')

  // let limit = AppState.get('paginationLimit')
  // if (params.options.limit) {
  //   limit = params.options.limit
  // } else if (params.limit) {
  //   limit = params.limit
  // } else {
  //   limit = AppState.get('paginationLimit')
  // }
  // console.log('params:', params);

  return cpus.find({
  }, {
    fields: cpus.publicFields,
    // limit: params.options.limit,
    // limit: limit,
    limit: 20,
    sort: { created_at: -1 },
  });
});
*/
