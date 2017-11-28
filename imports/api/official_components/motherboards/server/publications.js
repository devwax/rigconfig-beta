// NOT USED - but check to see if we were using any of these publications. Specifically the algolia_index and fixtures.
// import { Meteor } from 'meteor/meteor';
// import { cpus } from '../cpus.js';
// import { motherboards } from '../motherboards.js';

/*
Meteor.publish('motherboards.all', function motherboardssPub() {
  return motherboards.find({
  }, {
    // sort: { created_at: -1 },
    fields: motherboards.publicFields,
    limit: 20
  });
});
*/

// Meteor.publish('singleComponent', function currentComponentPub(ComponentType, id) {
//   check(ComponentType, String)
//   check(id, String)
//   const Collection = eval(ComponentType)
//   return Collection.find({
//     _id: id
//   }, {
//     fields: Collection.publicFields
//   })
// })
