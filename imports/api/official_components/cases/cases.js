import { Mongo } from 'meteor/mongo';

export const cases = new Mongo.Collection('cases');

// Deny all client-side updates since we will be using methods to manage this collection
cases.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

cases.publicFields = {
 "_id": 1,
 "type": 1,
 "part_number": 1,
 "title": 1,
 "asin": 1,
 "newegg_id": 1,
 "form_factor": 1,
 "dimensions_imperial": 1,
 "dimensions_metric": 1,
 "motherboard_support": 1,
 "Maximum GPU Length": 1,
 "Maximum CPU Cooler Height": 1,
 "Maximum PSU Length": 1,
 "Expansion Slots": 1,
 "material": 1,
 "power_supply": 1,
 "external_connections": 1,
 "fan_mount_locations": 1,
 "fans_included": 1,
 "LED": 1,
 "radiator_mount_locations": 1,
 "compatible_corsair_liquid_coolers": 1,
 "color": 1,
 "with_power_supply": 1,
 "Side Panel Window": 1,
 "expansion_bays": 1,
 "Front Panel Ports": 1,
 "features": 1,
 "weight_imperial": 1,
 "weight_metric": 1,
 "warranty": 1,
 "sources": 1
}
