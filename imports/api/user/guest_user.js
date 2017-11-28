import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { PersistentMinimongo } from 'meteor/frozeman:persistent-minimongo';

export const GuestUser         = Meteor.isClient ? new Mongo.Collection('GuestUser', { connection: null }) : {}
export const GuestUserObserver = Meteor.isClient ? new PersistentMinimongo(GuestUser) : {}
