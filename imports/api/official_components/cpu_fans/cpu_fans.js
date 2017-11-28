import { Mongo } from 'meteor/mongo';

export const cpu_fans = new Mongo.Collection('cpu_fans');

// Deny all client-side updates since we will be using methods to manage this collection
cpu_fans.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

cpu_fans.publicFields = {
 "_id": 1,
 "type": 1,
 "part_number": 1,
 "title": 1,
 "asin": 1,
 "newegg_id": 1,
 "cold_plate_material": 1,
 "fan_specification": 1,
 "radiator_material": 1,
 "socket_support": 1,
 "tubing": 1
}
