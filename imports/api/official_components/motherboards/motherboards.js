import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

class motherboardsCollection extends Mongo.Collection {
  insert(component, callback) {
    return super.insert(component, callback);
  }
}

export const motherboards = new motherboardsCollection('motherboards');

// Deny all client-side updates since we will be using methods to manage this collection
motherboards.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

motherboards.schema = new SimpleSchema({
  // non-facets
  "objectID":             { type: String, max: 100 }, // same as _id for algolia index
  "type":                 { type: String, max: 100 }, // Type of component... cpus, motherboards, etc
  "part_number":          { type: String, max: 100, optional: true }, // "N82E16813157499", ...
  "model":                { type: String, max: 100, optional: true }, // "A68HM-K", "G41C-GS R2.0", "Z170 PRO GAMING", "GA-B150M-DS3H (rev. 1.0)"
  "title":                { type: String, max: 350 }, // (auto-generated or custom) e.g. "GIGABYTE GA-B150M-DS3H (rev. 1.0) LGA 1151 Intel B150 HDMI SATA 6Gb/s USB 3.0 Micro ATX Intel Motherboard"
  "title_custom":         { type: String, max: 350, optional: true }, // (custom title overrides 'title' if present)
  "legacy":               { type: String, allowedValues: ["Yes", "No"], optional: true},

  // facets
  "mftr":                 { type: String, max: 100 }, // "ABIT", "AOpen", "ASRock", "ASUS", "AXIOMTEK", "Acer", "Apple", "Biostar", "Chaintech", "DELL", "DFI", "Dell Canada", "E-ITX Systems", "ECS (EliteGroup)", "EVGA", "Epox", "FIC", "Foxconn", "GENERIC", "GIGABYTE", "Gateway", "HP Products", "Hewlett-Packard", "IBM", "Intel", "JETWAY", "L337 Gaming", "Lenovo", "MSI", "MSI Certified", "OEM Parts Supply", "Other World Computing", "PC CHIPS", "Sapphire", "Shuttle", "Soltek", "Soyo","SuperMicro", "Toshiba", "Wibtek", "Wistron", "XFX", "ZOTAC"
  "platform":             { type: String, allowedValues: ["Desktop", "Server", "Mobile", "Embedded"]},
  "chipset":              { type: String, max: 100, optional: true }, // "Intel Z97", "A68HM-K", "Intel B150", ...

  "cpu_socket_type":      { type: Array, optional: true }, // "LGA 1150", "FM2+", ...
  "cpu_socket_type.$":    { type: String, optional: true }, // "LGA 1150", "FM2+", ...

  "cpu_type":             { type: Array, optional: true }, // "Core i7 / i5 / i3 / Pentium / Celeron (LGA1150)", "Athlon/A- Series (FM2+)"
  "cpu_type.$":           { type: String, optional: true }, // "Core i7 / i5 / i3 / Pentium / Celeron (LGA1150)", "Athlon/A- Series (FM2+)"

  "fsb":                  { type: String, optional: true }, // "800 MHz", "1066/800 MHz", ...
  "family":               { type: String, max: 100, optional: true }, // (series) "ROG" (asus), ...

  // memory
  "memory_slots":         { type: String, max: 100, optional: true }, // "2x184 pin", "2x240 pin", "4x240 pin", "2x184 pin", "1x204pin SO-DIMM", ...

  "memory_standard":      { type: Array, optional: true }, // "DDR 400", "DDR 400/DDR2 533", "DDR2 800", ...
  "memory_standard.$":    { type: String, optional: true }, // "DDR 400", "DDR 400/DDR2 533", "DDR2 800", ...

  "max_memory":           { type: String, max: 20, optional: true }, // "2GB", "4GB", "32GB", "64GB", ...
  "memory_channels":      { type: String, max: 100, optional: true }, // "Dual-channel", "Triple-channel", "Quad-channel", ...

  // expansion slots
  "pci_express_4_x16":    { type: String, max: 100, optional: true }, // (*** Or we could go 0, 1, 2, 3, etc so you could get all w/out this facet by selecting zero) "1 x PCI Express 3.0 x16", "2 x PCI Express 3.0 x16", "3 x PCI Express 3.0 x16", ...
  "pci_express_3_x16":    { type: String, max: 100, optional: true }, // (*** Or we could go 0, 1, 2, 3, etc so you could get all w/out this facet by selecting zero) "1 x PCI Express 3.0 x16", "2 x PCI Express 3.0 x16", "3 x PCI Express 3.0 x16", ...
  "pci_express_2_x16":    { type: String, max: 100, optional: true }, // "1 x PCI Express 2.0 x16", "2 x PCI Express 2.0 x16",
  "pci_express_1_x16":    { type: String, max: 100, optional: true }, // "1 x PCI Express x16", "2 x PCI Express x16",
  "pci_slots":            { type: String, max: 100, optional: true }, // "1", "2", "3", ...

  // storage
  "sata_6gb":             { type: String, max: 100, optional: true }, // (*** Or just 1,2,3,...) "2 x SATA 6Gb/s", "4 x SATA 6Gb/s", ...
  "sata_3gb":             { type: String, max: 100, optional: true }, // "1", "2", "3", ...
  "sata_1_5gb":           { type: String, max: 100, optional: true }, // "1", "2", "3", ... //@todo change property name to "1.5"
  "sata_express":         { type: String, max: 100, optional: true }, // "1", "2", "3", ...
  "esata":                { type: String, max: 100, optional: true }, // "1", "2", "3", ...
  "msata":                { type: String, max: 100, optional: true }, // "1", "2", "3", ...
  "m2":                   { type: String, max: 100, optional: true }, // "1 x M.2", "1 x M.2 + 1 x Ultra M.2", "1 x Ultra M.2", "2 x M.2"
  "u2":                   { type: String, max: 100, optional: true }, // "1", "2", "3", ...
  "sata_raid":            { type: String, max: 100, optional: true }, // "0/1/5/10", ...
  "ieee_1394":            { type: String, max: 100, optional: true }, // "1", "2", "3", ...
  "pata_ide":             { type: String, max: 100, optional: true }, // "1", "2", "3", ...

  // video
  "video_chipset":        { type: String, max: 100, optional: true}, // "Intel HD Graphics", "AMD Radeon R/HD8000/HD7000", ...
  "onboard_video":        { type: String, allowedValues: ["Yes", "No"], optional: true}, // "Yes", "No"

  "video_ports":          { type: Array, optional: true }, // "D-Sub", "DVI", "HDMI", "DisplayPort", ...
  "video_ports.$":        { type: String, optional: true }, // "D-Sub", "DVI", "HDMI", "DisplayPort", ...

  "d_sub":                { type: String, optional: true }, // "1", "2", "3", ...
  "dvi":                  { type: String, optional: true }, // "1", "2", "3", ...
  "hdmi":                 { type: String, optional: true }, // "1", "2", "3", ...
  "displayport":          { type: String, optional: true }, // "1", "2", "3", ...

  // audio
  "audio_chipset":        { type: String, max: 100, optional: true }, // "Realtek ALC892", ...

  "audio_channels":       { type: Array, max: 100, optional: true }, // ["2 Ch", "4 Ch", "5.1 Ch", "6 Ch", "7.1 Ch", "8 Ch", "10 Ch",  ...
  "audio_channels.$":     { type: String, max: 100, optional: true }, // ["2 Ch", "4 Ch", "5.1 Ch", "6 Ch", "7.1 Ch", "8 Ch", "10 Ch",  ...

  // lan
  "lan_chipset":          { type: String, max: 100, optional: true }, // "Intel GbE LAN chip", "Realtek 8111GR", ...
  "lan_speed":            { type: String, max: 100, optional: true }, // "10/100/1000Mbps", ...
  "wireless_lan":         { type: String, max: 100, optional: true }, // "802.11 ac", "802.11 a / b / g / n / ac", "802.11 a / b / n / ac", "802.11 n"
  "rj45":                 { type: String, max: 100, optional: true }, // "1", "2", "3", ...

  // ports
  "usb_3_1":              { type: String, optional: true }, // "1", "2", "3", ... //@todo change property name to "3.1"
  "usb_3_0":              { type: String, optional: true }, // "1", "2", "3", ... //@todo change property name to "3.0"
  "usb_1_2":              { type: String, optional: true }, // "1", "2", "3", ...
  // "onboard_usb":          { type: Array, optional: true }, // "1", "2", "3", ...
  // "other_connectors":     { type: Array, optional: true }, // "1", "2", "3", ... // @todo - this is newegg property
  "spdif_out":            { type: String, optional: true }, // "1 x Optical", "1 x Optical, 1 x Coaxial"

  "ps_2":                 { type: String, optional: true }, // "1", "2", "1 x Keyboard, 1 x Mouse", ...

  "mini_card_slots":      { type: String, optional: true }, // "1 x Mini PCIe", "2 x Mini PCIe"
  "audio_ports":          { type: String, optional: true }, // "1", "2", "3", ...
//___________________________________________________
  // physical specs
  "form_factor":          { type: String, optional: true }, // "ATX", "CEB", "Extended ATX", "Micro ATX", "Mini ITX", "Mini STX", ...
  "dimensions":           { type: String, optional: true }, // '12.01" x 8.43"', '8.90" x 7.09"', ...

  "power_pins":           { type: String, optional: true }, // "24 Pin", "20+4 Pin", "4-pin ATX 12V"
  // "power_pins":           { type: Array, optional: true }, // "24 Pin", "20+4 Pin", "4-pin ATX 12V"
  // "power_pins.$":           { type: String, optional: true }, // "24 Pin", "20+4 Pin", "4-pin ATX 12V"

  // uncategorized
  "com_ports":            { type: String, optional: true }, // "1", "2", "3", ...
  "bios":                 { type: String, optional: true }, // "UEFI BIOS", "UEFI DualBIOS", ...
  "antenna_connectors":   { type: String, optional: true }, //

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

motherboards.attachSchema(motherboards.schema)

motherboards.publicFields = {
 "_id": 1,
 "type": 1,
 "part_number": 1,
 "title": 1,
 "asin": 1,
 "newegg_id": 1,
 "platform": 1,
 // "other": 1,
 "mftr": 1,
 "family": 1,
 "model": 1,
 "intel_turbo_boost_2": 1,
 "cpu_socket_type": 1,
 "cpu_support": 1,
 "cpu_series": 1,
 "cpu_generation": 1,
 "max_cpus": 1,
 "chipset": 1,
 "video_chipset": 1,
 "video_max_memory": 1,
 "multi_gpu_support": 1,
 "onboard_video": 1,
 "memory_slots": 1,
 "memory_standard": 1,
 "memory_speed": 1,
 "memory_speed_details": 1,
 "memory_ecc": 1,
 "memory_buffered": 1,
 "max_memory": 1,
 "memory_channels": 1,
 "pci_express": 1,
 "pci_express_4_x16": 1,
 "pci_express_3_x16": 1,
 "pci_express_2_x16": 1,
 "pci_express_x16": 1,
 "pci_express_x1": 1,
 "sata_6gb": 1,
 "sata_3gb": 1,
 "sata_i": 1,
 "m2": 1,
 "sata_raid": 1,
 "audio_chipset": 1,
 "audio_channels": 1,
 "audio_details": 1,
 "lan_chipset": 1,
 "second_lan_chipset": 1,
 "lan_speed": 1,
 "wireless_lan": 1,
 "rj45": 1,
 "hdmi_details": 1,
 "displayport_details": 1,
 "video_ports": 1,
 "usb_3_1": 1,
 "usb_3_0": 1,
 "usb_1_2": 1,
 "usb_ports": 1,
 "spdif_out": 1,
 "ps_2": 1,
 "mini_card_slots": 1,
 "audio_ports_details": 1,
 "form_factor": 1,
 "dimensions_l_w_h_inches": 1,
 "power_pins": 1,
 "com_ports": 1,
 "antenna_connectors": 1,
 "internal_headers": 1,
 "in_box": 1,
 "weight_lbs": 1,
 "internal_io_ports": 1,
 "features": 1,
 "exclusive_features": 1,
 "special_features": 1,
 "bios": 1,
 "management": 1,
 "sources": 1,
 "legacy": 1,
 // "objectID": 1
}
