import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { slugify } from '/imports/api/lib/slugify.js';
// import { RigComponents } from '../rig_components/rig_components.js';
// import { Factory } from 'meteor/factory';

class PublicRigsCollection extends Mongo.Collection {

  insert(rig, callback) {

    // strip html from desc and title
    if (rig.hasOwnProperty("desc")) {
      rig.desc && (rig.desc = rig.desc.replace(/<(?:.|\n)*?>/gm, ''));
    }

    if (rig.hasOwnProperty("title")) {
      rig.title && (rig.title = rig.title.replace(/<(?:.|\n)*?>/gm, ''));
    }

    let slug = slugify(rig.title)
    let nextNumber = 0

    while (!!this.findOne({ slug })) {
      nextNumber++
      slug += `-${nextNumber}`
    }

    rig.slug = slug

    return super.insert(rig, callback)
  }
/*
  update(query, callback) {
    return super.update(rig, callback)
  }
*/

}

export const PublicRigs = new PublicRigsCollection('PublicRigs');

// Deny all client-side updates since we will be using methods to manage this collection
PublicRigs.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

PublicRigs.schema = new SimpleSchema({
  owner:    { type: String, max: 20, optional: false },
  pk:       { type: String, max: 20, optional: false },
  rigId:    { type: String, max: 20, optional: false},
  title:    { type: String, max: 250, optional: false },
  public:   { type: Boolean, optional: true, defaultValue: true },
  username: { type: String, optional: true, max: 30, defaultValue: 'Anonymous' },
  desc:     { type: String, optional: true, max: 3100,
    autoValue: function() {

      /**
        @todo - Had to handle this manually w/ autoValue as SimpleSchema validation won't accept blank strings.
                Tried the 'clean' method and this SO to no avail.:
                https://github.com/aldeed/meteor-simple-schema/issues/64
      */

      // console.log('this... isInsert: %s, isUpdate: %s, isUpsert: %s, isSet: %s', this.isInsert, this.isUpdate, this.isUpsert, this.isSet);

      if (!this.isUpdate) {
        if (this.value !== undefined) {
          return this.value
        } else {
          // received 'desc' value is blank, but SimpleSchema drops properties w/ blank strings,
          // so we have to manually add it.
          return ''
        }
      }

    }
  },

  price:    { type: Number, optional: true, defaultValue: 0.00 },
  cost:     { type: String, max: 20, optional: true, defaultValue: "$0.00" },
  costNumeric: { type: Number, optional: true, defaultValue: 0.00 },
  slug:        { type: String, max: 200, optional: true }, // @todo make sure to catch validation errors in validatedmethod
  forkSourceId:{ type: String, max: 20, optional: true },
  components:  { type: Array, maxCount: 75, optional: true },
  "components.$":          { type: Object, optional: true },
  "components.$._id":          { type: String, max: 20 },
  "components.$.componentId":  { type: String, max: 20, optional: true },
  "components.$.custom":       { type: Boolean, optional: true },
  "components.$.desc":         { type: String, max: 3000, optional: true },
  "components.$.position":     { type: Number, optional: true },
  "components.$.price":        { type: String, max: 20, optional: true },
  "components.$.priceNumeric": { type: Number, optional: true },
  "components.$.rigId":        { type: String, max: 20 },
  "components.$.title":        { type: String, max: 200, optional: true },
  "components.$.link":         { type: String, max: 200, optional: true },
  "components.$.type":         { type: String, max: 70, optional: true },
  createdAt: {
    type: Date,
    optional: true,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date()};
      } else {
        this.unset();  // Prevent user from supplying their own value
      }
    }
  },
  publishedAt: {
    type: Date,
    optional: true,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date()};
      } else {
        this.unset();  // Prevent user from supplying their own value
      }
    }
  },
  updatedAt: {
    type: Date,
    optional: true,
    autoValue: function() {
      if (this.isUpdate) {
        return new Date();
      }
    },
    denyInsert: true
  },

})

// PublicRigs.schema.clean({
//   removeEmptyStrings: false
// })

// This represents the keys from Rigs objects that should be published
// to the client. If we add secret properties to objects, don't list
// them here to keep them private to the server.
PublicRigs.publicFields = {
  // owner: 0,
  // pk:  0,
  rigId: 1,
  title: 1,
  slug:  1,
  desc:  1,
  price: 1,
  cost: 1,
  costNumeric: 1,
  components: 1,
  public: 1,
  createdAt: 1,
  updatedAt: 1,
}

PublicRigs.attachSchema(PublicRigs.schema)

// Factory.define('rig', Rigs, {});

// PublicRigs.helpers({
  // A list is considered to be private if it has a userId set

  // isPrivate() {
  //   return !!this.userId;
  // },
  // isLastPublicList() {
  //   const publicListCount = Rigs.find({}).count();
  //   return !this.isPrivate() && publicListCount === 1;
  // },

  // editableBy(userId) {
  //   if (!this.userId) {
  //     return true;
  //   }
  //   return this.userId === userId;
  // },

  // rigComponents() {
  //   // console.log( RigComponents.find({ rigId: this._id }, { sort: { createdAt: -1 } }).count() );
  //   // console.log('rigId:', this._id);
  //   return RigComponents.find({ rigId: this._id }, { sort: { createdAt: -1 } });
  // },
// })
