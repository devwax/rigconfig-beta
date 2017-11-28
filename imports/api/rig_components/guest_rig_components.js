import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { PersistentMinimongo } from 'meteor/frozeman:persistent-minimongo';

export const GuestRigComponents         = Meteor.isClient ? new Mongo.Collection('GuestRigComponents', { connection: null })  : {}
export const GuestRigComponentsObserver = Meteor.isClient ? new PersistentMinimongo(GuestRigComponents) : {}
