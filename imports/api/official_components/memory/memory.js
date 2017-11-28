import { Mongo } from 'meteor/mongo';

export const memory = new Mongo.Collection('memory');

// Deny all client-side updates since we will be using methods to manage this collection
memory.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

memory.publicFields = {
 "_id": 1,
 "type": 1,
 "part_number": 1,
 "title": 1,
 "asin": 1,
 "newegg_id": 1,
 "brand_name": 1,
 "fan_included": 1,
 "heat_spreader": 1,
 "memory_configuration": 1,
 "series": 1,
 "memory_type": 1,
 "module_form_factor": 1,
 "pins": 1,
 "performance_profile": 1,
 "color": 1,
 "memory_size": 1,
 "spd_latency": 1,
 "spd_speed": 1,
 "spd_voltage": 1,
 "speed_rating": 1,
 "tested_latency": 1,
 "tested_speed": 1,
 "tested_voltage": 1,
 "warranty": 1,
 "weight": 1,
 "dimensions_inches": 1
}
