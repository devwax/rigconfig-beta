export const AppConfig = {
  site: {
    title: "RigConfig",
    tagline: "Build Something",
    rootUri: "http://rigconfig.com"
  },
  paginationDefault: 20,
  admin: {
    name: "Admin",
    email: "contact@rigconfig.com"
  }
}

// @todo - This is only necessary for the external algolia js script to access AppConfig. (hax)
if (Meteor.isClient) {
  window.AppConfig = AppConfig
}

export default AppConfig;
