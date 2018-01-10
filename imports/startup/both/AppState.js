import { Meteor } from 'meteor/meteor'
import { ReactiveDict } from 'meteor/reactive-dict'
import { AppConfig } from '/imports/startup/both/AppConfig.js';
import { PublicRigs } from '/imports/api/public_rigs/public_rigs.js';
// import { publicRigsCount } from '/imports/api/public_rigs/methods.js';
// import { cpusPrefetch } from '/imports/startup/both/prefetch/cpus.js'; // @todo - create index.js and import desctructure syntax
// import { motherboardsPrefetch } from '/imports/startup/both/prefetch/motherboards.js'; // @todo - create index.js and import desctructure syntax

const AppState = new ReactiveDict("AppState")

const facetsDefault = [
  // the counts are being overridden in the faceting components
  { name: "type", data: { cpus: 0, motherboards: 0, video_cards: 0, cases: 0, cpu_fans: 0, memory: 0, psus: 0, ssds: 0 }, exhaustive: true }
]

AppState.set({
  UserSettingsModalOpen: false,
  QuickViewModalOpen: false,
  ComparisonModalOpen: false,
  hit: {},
  // compareState: false,
  componentComparisonList: [],
  alertVisible: false,
  alertMessage: '',
  LeftDrawerOpen: false,
  // RightDrawerOpen: Meteor.isDevelopment ? true : false,
  RightDrawerOpen: false,
  rigSelectorOpen: false,
  currentRigId: '',
  componentsCount: 0,
  facetsDefault: facetsDefault,
  facets: facetsDefault,
  results: [],
  searchResults: [],
  isSearching: false,

  // results: [], // Could be pre-filled with an array of objects manually or automatically w/ fs.writeFile on server
  // results: {
  //   cpus: cpusPrefetch,
  //   motherboards: motherboardsPrefetch
  // },

  paginationDefault: AppConfig.paginationDefault,
  paginationLimit: AppConfig.paginationDefault,
  isPaginating: false,
  nbHits: false,
  // nbHitsLocal: Meteor.isServer ? PublicRigs.find({public: true}).count() : AppConfig.paginationDefault + 1,
  nbHitsLocal: Meteor.isServer ? PublicRigs.find({public: true}).count() : AppConfig.paginationDefault,
  resultsType: 'components', // OPTIONS: 'components', 'rigs',
  resultsSource: 'components', // OPTIONS: 'components', 'rigs',
  pathname: Meteor.isClient ? window.location.pathname : '',
  /*
    Note / tl;dr
      This is a state managent issue. This should be resolved once we are able to generate an
      initial state on the server and send it w/ the payload. This is why I'm considering react-redux.

    PublicRigs total collection count adds 1 to avoid ssr/client re-render because this is immediately updated by
    the publicRigsCount meteor method with the actual PublicRigs count; it's 3am... will look into it tomorrow.

    OK: We're server-side rendering, so the MoreButton needs to know if it should render on server.
        So we do a direct query to mongo on the server to get the max number of public rigs (prCount)
        which is used by MoreButton to determine whether it should be displayed or not.
        Then on the client we use a Meteor method called "publicRigsCount" (bottom of this file) on client
        to immediately query the server and get the prCount to be used on the client in realtime as users
        manipulate the search and faceting features.

        One is added to the default pagination because I only had 3 public rigs in the collection, but because the
        AppConfig.paginationDefault was set to 20, it would correctly fail to render on the server, but
        the initial value of prCount was 0, so there was a flash of button dissapearing on the client on load
        and then re-appearing once the publicRigsCount meteor method returned the correct value.
    prCount: Meteor.isServer ? PublicRigs.find({public: true}).count() : AppConfig.paginationDefault + 1,
  */

  currentPublicRig: false,
  GuestRigComponents: [],
  algoliaActive: false,
  algoliaQuery: "",
  userInitialedCollapsing: false
})

// @todo - This is only necessary for the external algolia js script to access AppState. (hax)
if (Meteor.isClient) {
  window.AppState = AppState
}

export default AppState
