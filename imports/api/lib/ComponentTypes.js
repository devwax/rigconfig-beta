export const ComponentTypesList = [{
  displayName: "CPUs",
  singular: "CPU",
  plural: "CPUs",
  collectionName: 'cpus'
}, {
  displayName: "Motherboards",
  singular: "Motherboard",
  plural: "Motherboards",
  collectionName: 'motherboards'
}, {
  displayName: "Video Cards",
  singular: "Video Card",
  plural: "Video Cards",
  collectionName: 'video_cards'
}, {
  displayName: "Cases",
  singular: "Cases",
  plural: "Cases",
  collectionName: 'cases'
}, {
  displayName: "Memory",
  singular: "Memory",
  plural: "Memory",
  collectionName: 'memory'
}, {
  displayName: "PSUs",
  singular: "PSUs",
  plural: "PSUs",
  collectionName: 'psus'
}, {
  displayName: "SSDs",
  singular: "SSDs",
  plural: "SSDs",
  collectionName: 'ssds'
}, {
  displayName: "CPU Fans",
  singular: "CPU Fans",
  plural: "CPU Fans",
  collectionName: 'cpu_fans'
}

]

export const ComponentCollectionNames = ComponentTypesList.map(c => c.collectionName)
