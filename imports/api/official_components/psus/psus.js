import { Mongo } from 'meteor/mongo';

export const psus = new Mongo.Collection('psus');

// Deny all client-side updates since we will be using methods to manage this collection
psus.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

psus.publicFields = {
  "_id": 1,
  "type": 1,
  "part_number": 1,
  "title": 1,
  "asin": 1,
  "newegg_id": 1,
  "MTBF": 1,
  "80 PLUS Certification Level": 1,
  "power": 1,
  "watts": 1,
  "Zero RPM Fan Mode": 1,
  "Fan Bearing Technology": 1,
  "Fan size": 1,
  "Corsair Link Support": 1,
  "Continuous Output Rated Temperature (°C)": 1,
  "Modular": 1,
  "Cable Type": 1,
  "ATX Connector": 1,
  "EPS Connector": 1,
  "Floppy Connector": 1,
  "4-Pin Peripheral Connector": 1,
  "PCIe Connector": 1,
  "SATA Connector": 1,
  "connectors": 1,
  "form_factor": 1,
  "brand": 1,
  "model": 1,
  "series": 1,
  "Fans": 1,
  "PFC": 1,
  "main_power_connector": 1,
  "+12V Rails": 1,
  "PCI-Express Connector": 1,
  "SATA Power Connector": 1,
  "sli": 1,
  "CrossFire": 1,
  "Haswell Support": 1,
  "Efficiency": 1,
  "Energy-Efficient": 1,
  "Over Voltage Protection": 1,
  "Input Voltage": 1,
  "Input Frequency Range": 1,
  "Input Current": 1,
  "Output": 1,
  "Approvals": 1,
  "dimensions_imperial": 1,
  "dimensions_metric": 1,
  "weight_imperial": 1,
  "weight_metric": 1,
  "warranty": 1,
  "sources": 1
}
