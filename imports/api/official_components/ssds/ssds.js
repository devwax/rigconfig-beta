import { Mongo } from 'meteor/mongo';

export const ssds = new Mongo.Collection('ssds');

// Deny all client-side updates since we will be using methods to manage this collection
ssds.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

ssds.publicFields = {
  "_id": 1,
  "type": 1,
  "part_number": 1,
  "title": 1,
  "asin": 1,
  "newegg_id": 1,
  "brand": 1,
  "form_factor": 1,
  "interface": 1,
  "capacity": 1,
  "cache": 1,
  "sequential_read_speed": 1,
  "sequential_write_speed": 1,
  "Random Read Speed": 1,
  "Random Write Speed": 1,
  "MTBF": 1,
  "Controller": 1,
  "NAND Flash": 1,
  "Trim Support": 1,
  "AES Encryption": 1,
  "SMART Support": 1,
  "GC (Garbage Collection)": 1,
  "Device Sleep Mode Support": 1,
  "Internal Storage": 1,
  "Temperature proof": 1,
  "NVMe": 1,
  "Power Consumption (W)": 1,
  "Reliability (MTBF)": 1,
  "Operating Temperature": 1,
  "Shock Resistance": 1,
  "dimensions_imperial": 1,
  "dimensions_metric": 1,
  "weight_lbs": 1,
  "weight_grams": 1,
  "Management SW": 1,
  "series": 1,
  "device_type": 1,
  "Power Consumption (Idle)": 1,
  "Power Consumption (Active)": 1,
"warranty": 1
}
