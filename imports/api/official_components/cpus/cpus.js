import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

class cpusCollection extends Mongo.Collection {
  insert(component, callback) {
    return super.insert(component, callback);
  }
}

export const cpus = new cpusCollection('cpus');

// Deny all client-side updates since we will be using methods to manage this collection
cpus.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

cpus.schema = new SimpleSchema({
  "objectID":          { type: String, max: 100 }, // same as _id for algolia index
  "type":              { type: String, max: 100 }, // Type of component... cpus, Motherboards, etc
  "part_number":       { type: String, max: 100, optional: true }, // "N82E16813157499", ...
  "model":             { type: String, max: 50, optional: true }, //
  "title":             { type: String, max: 300 }, // (auto-generated or custom) e.g. "GIGABYTE GA-B150M-DS3H (rev. 1.0) LGA 1151 Intel B150 HDMI SATA 6Gb/s USB 3.0 Micro ATX Intel Motherboard"
  "title_custom":      { type: String, max: 350, optional: true }, // (custom title overrides 'title' if present)
  "legacy":            { type: String, allowedValues: ["Yes", "No"], optional: true},

  "mftr":              { type: String, allowedValues: ["Intel", "AMD"]},
  "platform":          { type: String, allowedValues: ["Desktop", "Server", "Mobile", "Embedded"]},
  "family":            { type: String, max: 100, optional: true }, // " Core i3", "Core i5", " Core i7", "Athlon II X4", "Phenom II X2"
  "generation":        { type: String, max: 50, optional: true }, // "4th", "5th", "6th", ...
  "microarch":         { type: String, max: 100, optional: true }, // "Core I7", "K10", "Skylake", ...
  "core_name":         { type: String, max: 100, optional: true }, // "Skylake", "Llano", "Haswell", "Bulldozer, ..."

  "socket_type":       { type: Array, optional: true }, // ["LGA 1150"], ["Socket AM2+", "Socket AM3"], ...
  "socket_type.$":     { type: String, optional: true }, // ["LGA 1150"], ["Socket AM2+", "Socket AM3"], ...

  "num_cores":         { type: Number, optional: true },
  "num_threads":       { type: Number, optional: true },
  // "freq_ghz":          { type: String, optional: true }, // "2.5 GHz", "500 MHz", ...
  "frequency":         { type: String, optional: true }, // "2.5 GHz", "500 MHz", ...
  // "max_freq_ghz":      { type: Number, optional: true },
  "max_frequency":     { type: String, optional: true }, // // "2.5 GHz", "4 GHz", ...
  "directx":           { type: String, max: 100, optional: true }, // "11.2/12", ...
  "opengl":            { type: Number, optional: true },
  "hyper_threading":   { type: String, allowedValues: ["Yes", "No"], optional: true},
  "litho_nm":          { type: String, optional: true }, // "22nm", "90nm", ...
  "watts":             { type: String, optional: true }, // "65W", "115W", ...
  "memory_types":      { type: String, max: 300, optional: true },
  "l3_cache":          { type: String, max: 300, optional: true }, // "2MB", "2MB shared", "8MB", ...
  "ecc":               { type: String, allowedValues: ["Yes", "No"], optional: true},
  "mftr_spec_link":    { type: String, max: 300, optional: true },
  "overclockable":     { type: String, allowedValues: ["Yes", "No"], optional: true},
  "oem":               { type: String, allowedValues: ["Yes", "No"], optional: true},
  "cooling_included":  { type: String, allowedValues: ["Yes", "No"], optional: true},
  "max_memory":        { type: String, optional: true }, // "16GB", "32GB", ...
  "bus_speed":         { type: String, max: 200, optional: true }, // "133 MHz", "533 MHz", "800 MHz", ...
  "data_width":        { type: String, max: 50, optional: true }, // "64MB", "32MB", ...
  "virtualization":    { type: String, allowedValues: ["Yes", "No"], optional: true},
  created_at: {
    type: Date,
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
  "updated_at": {
    type: Date,
    autoValue: function() {
      if (this.isUpdate) {
        return new Date();
      }
    },
    denyInsert: true,
    optional: true
  }
})


cpus.attachSchema(cpus.schema)

/**
  This represents the keys from cpus objects that should be published
  to the client. If we add secret properties, don't list
  them here to keep them private to the server.
*/
cpus.publicFields = {
  type: 1,
  title: 1,
  part_number: 1,
  mftr:  1,
  platform:  1,
  model: 1,
  family: 1,
  generation: 1,
  microarch: 1,
  core_name: 1,
  socket_type:  1,
  num_cores: 1,
  num_threads: 1,
  frequency: 1,
  max_frequency: 1,
  directx: 1,
  opengl: 1,
  hyper_threading: 1,
  litho_nm: 1,
  watts: 1,
  memory_types: 1,
  l3_cache: 1,
  ecc: 1,
  overclockable: 1,
  oem: 1,
  cooling_included: 1,
  max_memory: 1,
  bus_speed: 1,
  data_width: 1,
  virtualization: 1,
  legacy: 1,
}
