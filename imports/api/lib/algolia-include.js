import { Meteor } from 'meteor/meteor';

const facet_groups = {
  general: ['type', 'mftr'],
  cpus: [
    'platform',
    'family',
    'socket_type',
    'core_name',
    'num_cores',
    'frequency',
    'max_frequency',
    'max_memory',
    'microarch',
    'data_width',
    'overclockable',
    'oem',
    'cooling_included',
    'bus_speed',
    'num_threads',
    'directx',
    'opengl',
    'hyper_threading',
    'litho_nm',
    'watts',
    'memory_types',
    'ecc',
    'virtualization',
    'legacy'
  ],
  motherboard: [
    'form_factor',
    'cpu_socket_type',
    'cpu_support',
    'cpu_series',
    'cpu_generation',
    'max_cpus',
    'chipset',
    'pci_express',
    'sata_6gb',
    'sata_3gb',
    'sata_express',
    'm2',
    'u2',
    'sata_raid',
    'video_chipset',
    'video_max_memory',
    'multi_gpu_support',
    'onboard_video',
    'memory_slots',
    'memory_standard',
    'memory_speed_details',
    'memory_ecc',
    'memory_buffered',
    'max_memory',
    'memory_channels',
    'xmp_support',
    'audio',
    'audio_ports_details',
    'audio_chipset',
    'audio_channels',
    'audio_details',
    'lan_chipset',
    'second_lan_chipset',
    'lan_speed',
    'wireless_lan',
    'rj45',
    'video_ports',
    'usb_3_1',
    'usb_3_0',
    'usb_1_2',
    'usb_ports',
    'spdif_out',
    'ps_2',
    'mini_card_slots',
    // 'dimensions_l_w_h_inches',
    'power_pins',
    'com_ports',
    'antenna_connectors',
    'internal_io_ports',
    'back_panel_connectors',
    // 'hw_monitoring',
    'bios',
    'legacy'
  ],
  cases: [
    // "_id",
    // "type",
    // "part_number",
    // "title",
    // "asin",
    // "newegg_id",
    // "mftr",
    "form_factor",
    // "dimensions_imperial",
    "dimensions_metric",
    "motherboard_support",
    "external_connections",
    "fan_mount_locations",
    "fans_included",
    "LED",
    "radiator_mount_locations",
    "compatible_corsair_liquid_coolers",
    "color",
    "with_power_supply",
    "Side Panel Window",
    "expansion_bays",
    "Front Panel Ports",
    "Maximum GPU Length",
    "Maximum CPU Cooler Height",
    "Maximum PSU Length",
    "Expansion Slots",
    "material",
    "power_supply",
    // "features",
    // "weight_imperial",
    // "weight_metric",
    // "warranty",
    // "sources"
  ],
  memory: [
    // "_id",
    // "type",
    // "part_number",
    // "title",
    // "asin",
    // "newegg_id",
    // "mftr",
    // "brand_name",
    "series",
    "memory_size",
    "memory_type",
    "fan_included",
    "heat_spreader",
    "memory_configuration",
    "module_form_factor",
    "pins",
    "performance_profile",
    "color",
    "spd_latency",
    "spd_speed",
    "spd_voltage",
    "speed_rating",
    "tested_latency",
    "tested_speed",
    "tested_voltage",
    // "warranty",
    // "weight",
    // "dimensions_inches"
  ],
  psus: [
    // "_id",
    // "type",
    // "part_number",
    // "title",
    // "asin",
    // "newegg_id",
    // "mftr",
    // "80 PLUS Certification Level",
    "watts",
    // "power",
    "model",
    "series",
    "Fan size",
    "MTBF",
    // "Continuous Output Rated Temperature (°C)",
    "Modular",
    "Cable Type",
    "ATX Connector",
    "EPS Connector",
    "Floppy Connector",
    "4-Pin Peripheral Connector",
    "PCIe Connector",
    "SATA Connector",
    "connectors",
    "form_factor",
    "Zero RPM Fan Mode",
    "Fan Bearing Technology",

    "Corsair Link Support",
    // "brand",
    // "Fans",
    "PFC",
    "main_power_connector",
    "+12V Rails",
    "PCI-Express Connector",
    "SATA Power Connector",
    "sli",
    "CrossFire",
    "Haswell Support",
    // "Efficiency",
    // "Energy-Efficient",
    "Over Voltage Protection",
    "Input Voltage",
    "Input Frequency Range",
    "Input Current",
    "Output"
    // "Approvals",
    // "dimensions_imperial",
    // "dimensions_metric",
    // "weight_imperial",
    // "weight_metric",
    // "warranty",
    // "sources"
  ],
  ssds: [
    // "_id",
    // "type",
    // "part_number",
    // "title",
    // "asin",
    // "newegg_id",
    // "mftr",
    "series",
    "form_factor",
    "interface",
    "NVMe",
    "capacity",
    "cache",
    "device_type",
    // "sequential_read_speed",
    // "sequential_write_speed",
    // "Random Read Speed",
    // "Random Write Speed",
    "MTBF",
    "Controller",
    "NAND Flash",
    "Trim Support",
    "AES Encryption",
    "SMART Support",
    // "GC (Garbage Collection)",
    "Device Sleep Mode Support",
    "Internal Storage",
    "Temperature proof",
    // "Power Consumption (W)",
    // "Reliability (MTBF)",
    "Operating Temperature",
    "Shock Resistance",
    // "dimensions_imperial",
    // "dimensions_metric",
    // "weight_lbs",
    // "weight_grams",
    // "Management SW",
    "Power Consumption (Idle)",
    "Power Consumption (Active)"
    // "warranty"
  ],
  video_cards: [
    // "_id",
    // "type",
    // "part_number",
    // "title",
    // "asin",
    // "newegg_id",
    // "mftr",
    "interface",
    "memory_size",
    "gpu",
    "series",
    "resolution",
    "sli_support",
    "vr_ready",
    "cooler",
    "ports",
    "slot_width",
    "pixel_pipelines",
    // "resolution_max",
    "processor_speed",
    "processor_boost_speed",
    "cuda_cores",
    "memory_speed",
    "memory_effective_speed",
    "memory_interface",
    "memory_type",
    "direct_x",
    "graphics_coprocessor",
    "chipset_brand",
    // "brand_name",
    "item_model_number",
    // "weight",
    // "dimensions_inches",
    "open_gl",
    "operating_systems",
    // "requirements",
    "power_connector",
    "dual_link_dvi_support",
    "hdcp",
    // "features",
    "max_gpu_length",
    "texture_fill_rate",
    "memory_bandwidth",
    "led",
    "max_refresh_rate"
    // "max_digital",
    // "warranty"
  ],
  cpu_fans: [
    // "_id",
    // "type",
    // "part_number",
    // "title",
    // "asin",
    // "newegg_id",
    // "mftr",
    "socket_support",
    "fan_specification",
    "cold_plate_material",
    "radiator_material",
    "tubing"
  ]
}

let facets_array = []
for (var group in facet_groups) {
  if (facet_groups.hasOwnProperty(group)) {
    // facets_array.push(facet_groups[group])
    facet_groups[group].forEach(facet => facets_array.push(facet))
  }
}
// console.log('facets_array:', facets_array)
let facets_array_string = ''
facets_array.map(f => facets_array_string += `'${f}',`)
facets_array_string = '['+facets_array_string+']'
// console.log('facets_array_string:', facets_array_string)

export const algoliaInclude = `
window.client = algoliasearch('${Meteor.settings.public.algoliaAppId}', '${Meteor.settings.public.algoliaSearchApiKey}');
window.helper = algoliasearchHelper(window.client, 'rigconfig_components', {
  facets: ${facets_array_string}
});

// Set 'search' event listener for algolia search results to update AppState on each result returned.
window.helper.on('result', function (results, params) {
  var algoliaActive = AppState.get('algoliaActive');
  var paginationDefault = AppConfig.paginationDefault;
  var paginationLimit = AppState.get('paginationLimit');
  var isPaginating = AppState.get('isPaginating');

  // @todo: review 'isPaginating' to see if we needed it or if it can be refactored away now that we are proxying results via AppState.

  // See FacetItem.jsx > helper.setQueryParameter for related functionality
  if (isPaginating === false) {
    // sets the paginationLimit back to default when switching back from algolia to meteor pub/sub
    paginationLimit = paginationDefault;
    helper.setQueryParameter('hitsPerPage', paginationDefault);
  } else {
    AppState.set({isPaginating: false});
  }

  var algoliaActive = ( (Object.keys(window.helper.getState().facetsRefinements).length > 0) || (window.helper.getState().query.length > 0) );

  AppState.set({
    // results: results.hits || [],
    searchResults: results.hits || [],
    facets: results.facets || [],
    nbHits: results.nbHits || 0,
    algoliaActive: algoliaActive,
    // resultsType: window.helper.getState().index.indexOf('components') >= 0 ? 'components' : 'rigs',
    // resultsSource: window.helper.getState().index.indexOf('components') >= 0 ? 'components' : 'rigs',
    algoliaQuery: window.helper.getState().query || "",
    paginationLimit: paginationLimit
  });

  // window.results = results;
  window.searchResults = results;

});
`
