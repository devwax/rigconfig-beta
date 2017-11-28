import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { PersistentMinimongo } from 'meteor/frozeman:persistent-minimongo';

export const GuestRigs         = Meteor.isClient ? new Mongo.Collection('GuestRigs', { connection: null }) : {}
export const GuestRigsObserver = Meteor.isClient ? new PersistentMinimongo(GuestRigs) : {}
