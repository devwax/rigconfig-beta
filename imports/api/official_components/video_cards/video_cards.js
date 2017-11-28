import { Mongo } from 'meteor/mongo';
// import SimpleSchema from 'simpl-schema';

// class video_cardsCollection extends Mongo.Collection {
//   insert(component, callback) {
//     return super.insert(component, callback);
//   }
// }

// export const video_cards = new video_cardsCollection('cpus');
// export const video_cards = new video_cardsCollection('cpus');
export const video_cards = new Mongo.Collection('video_cards');

// Deny all client-side updates since we will be using methods to manage this collection
video_cards.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

video_cards.publicFields = {
  "_id": 1,
  "type": 1,
  "part_number": 1,
  "title": 1,
  "asin": 1,
  "newegg_id": 1,
  "mftr": 1,
  "interface": 1,
  "resolution": 1,
  "resolution_max": 1,
  "processor_speed": 1,
  "processor_boost_speed": 1,
  "cuda_cores": 1,
  "memory_speed": 1,
  "memory_effective_speed": 1,
  "memory_interface": 1,
  "memory_type": 1,
  "direct_x": 1,
  "graphics_coprocessor": 1,
  "chipset_brand": 1,
  "memory_size": 1,
  "brand_name": 1,
  "gpu": 1,
  "series": 1,
  "item_model_number": 1,
  "weight": 1,
  "dimensions_inches": 1,
  "open_gl": 1,
  "ports": 1,
  "sli_support": 1,
  "vr_ready": 1,
  "cooler": 1,
  "operating_systems": 1,
  "requirements": 1,
  "power_connector": 1,
  "dual_link_dvi_support": 1,
  "hdcp": 1,
  "features": 1,
  "max_gpu_length": 1,
  "slot_width": 1,
  "pixel_pipelines": 1,
  "texture_fill_rate": 1,
  "memory_bandwidth": 1,
  "led": 1,
  "max_refresh_rate": 1,
  "max_digital": 1,
  "warranty": 1
}
