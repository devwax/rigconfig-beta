// NOT USED: See README.md for adding components and algolia, etc from ccdb.
import { Meteor } from 'meteor/meteor'
import { readFile } from '/imports/api/lib/server/readFile.js'
import { writeFile } from '/imports/api/lib/server/writeFile.js'
import { ComponentTypesList, ComponentCollectionNames } from '/imports/api/lib/ComponentTypes.js';
import { Random } from 'meteor/random';
import { cpus } from '/imports/api/official_components/cpus/cpus.js';
import { motherboards } from '/imports/api/official_components/motherboards/motherboards.js';
import { video_cards } from '/imports/api/official_components/video_cards/video_cards.js';
import { cases } from '/imports/api/official_components/cases/cases.js';
import { cpu_fans } from '/imports/api/official_components/cpu_fans/cpu_fans.js';
import { memory } from '/imports/api/official_components/memory/memory.js';
import { psus } from '/imports/api/official_components/psus/psus.js';
import { ssds } from '/imports/api/official_components/ssds/ssds.js';

Meteor.startup(function () {

  if (Meteor.isDevelopment) {
    // Component types inserted into separate collections
    /*
    [
      "cpus",
      "motherboards"
    ].forEach((CollectionName) => { insertFixtures(CollectionName) })

    function insertFixtures(CollectionName) {
      const Collection = eval(CollectionName)
      const collection_name = CollectionName.toLowerCase()
      const path = '/imports/startup/server/fixtures/official_components/'

      if (Collection.find({}).count() === 0) { // If the collection is empty, then insert fixtures.
        console.log('Inserting ' + collection_name + '...');
        const filename = collection_name + '.json'
        JSON.parse(readFile(filename, path)).map(doc => {
          if (!doc.hasOwnProperty("_id")) {
            // doc["_id"] = Random.id(17)
            console.log('Record has no _id field.');
          }
          if (!doc.hasOwnProperty("objectID") && doc.hasOwnProperty("_id")) {
            doc["objectID"] = doc._id
          }
          if (!doc.hasOwnProperty("type")) {
            doc["type"] = CollectionName
          }
          Collection.insert(doc)
        })
      }
    }

    // Insert PublicRigs fixtures
    // if (PublicRigs.find().count() === 0) { // If the collection is empty, then insert fixtures.
    //   const path = '/imports/startup/server/fixtures/official_components/'
    //   const filename = 'public_rigs.json'
    //   JSON.parse(readFile(filename, path)).map(doc => {
    //     if (!doc.hasOwnProperty("_id")) {
    //       doc["_id"] = Random.id(17)
    //     }
    //     if (!doc.hasOwnProperty("objectID")) {
    //       doc["objectID"] = doc._id
    //     }
    //     PublicRigs.insert(doc)
    //   })
    // }
    */

    // Create algolia index (aggregated component types into single collection / json array)
    const create_algolia_index = false

    if (create_algolia_index) {
      let algolia_index = []
      ComponentCollectionNames.map(c => {
        const Collection = eval(c)
        const docs = Collection.find({}).fetch()
        docs.map(doc => algolia_index.push(doc))
      })
      console.log('algolia_index.length', algolia_index.length);

      const path = '/imports/startup/server/fixtures/official_components/'
      const filename = 'algolia_index.json'
      writeFile(filename, path, JSON.stringify(algolia_index))
    }
  }
})
