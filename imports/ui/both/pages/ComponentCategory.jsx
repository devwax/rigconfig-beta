import { Meteor } from 'meteor/meteor';
import React from "react";
import Helmet from 'react-helmet';
import AppConfig from '/imports/startup/both/AppConfig.js';
import { withTracker } from 'meteor/react-meteor-data';
import AppState from '/imports/startup/both/AppState.js';
import Results from '/imports/ui/both/components/Results/Results.jsx';
import { ComponentTypesList, ComponentCollectionNames } from '/imports/api/lib/ComponentTypes.js';
// import { collectionCount } from '/imports/api/lib/collectionCount.js';
import { cpus } from '/imports/api/official_components/cpus/cpus.js';
import { motherboards } from '/imports/api/official_components/motherboards/motherboards.js';
import { video_cards } from '/imports/api/official_components/video_cards/video_cards.js';
import { cases } from '/imports/api/official_components/cases/cases.js';
import { cpu_fans } from '/imports/api/official_components/cpu_fans/cpu_fans.js';
import { memory } from '/imports/api/official_components/memory/memory.js';
import { psus } from '/imports/api/official_components/psus/psus.js';
import { ssds } from '/imports/api/official_components/ssds/ssds.js';

function ComponentCategory({
    ComponentType,
    notFound,
    results,
    resultsType
  }) {
  // @todo - decompose this into a List > Item component pattern
  return (
    <section className="ComponentCategory">
      <div>
        <Helmet
          title={notFound ? ComponentType + ' Not Found' : ComponentType + ' @ ' + AppConfig.site.title }
        />
        { notFound ?
          <h2>Component Not Found</h2>
        :
          <Results resultsType={resultsType} results={results} ComponentType={ComponentType} />
        }
      </div>
    </section>
  )
}

export default withTracker(({match}) => {
  /** SSR
    We're server-side rendering w/ react-router-ssr.
  */
  let Collection
  let componentDataHandle
  let componentsList = []
  let notFound = false
  // console.log('params.type.toLowerCase()', params.type.toLowerCase());
  let ComponentType = ComponentTypesList.filter(c => c.collectionName.toLowerCase() === match.params.type.toLowerCase())[0]
  const algoliaActive = AppState.get('algoliaActive')

  /** WTFs Explained:
      We're matching the requested component type from the route param (e.g. /c/:type == /c/cpus)
      to a list of known component types (roughly analogous to categories) in ComponentTypes.js, which also
      contains the inflection nomenclature like the correlating collectionName,
      plural version, displayName, etc. This way we don't need to create separate routes and
      react components, containers, and so forth for each component type. i.e. Motheboards, Memory, etc.
  */
  // console.log('ComponentType', ComponentType);
  ComponentType && ComponentType.hasOwnProperty('collectionName')
    ? ComponentType = ComponentType.collectionName
    : notFound = true

  // console.log('ComponentType', ComponentType);

  if ( !notFound && (ComponentCollectionNames.indexOf(ComponentType) !== -1) ) {
    Collection = eval(ComponentType) // [Queue: Hiiiihg-waaaay tooo thuuuh danger zone!]
    componentDataHandle = Meteor.subscribe('allComponents', ComponentType, AppState.get('paginationLimit'))
    const loading = !componentDataHandle.ready()
    componentsList = Collection.find({}).fetch()

    // console.log(Collection);

    // console.log('componentsList', componentsList);

    if (!loading) {
      AppState.set({results: componentsList})
    } // implicit else keeps the current results in AppState('results') if loading subscription.

    AppState.set({resultsType: 'components'})

    // if (Meteor.isClient) {
    //   collectionCount.call({collectionName: ComponentType}, (e, r) => {
    //     if (r) {
    //       // console.log('collectionCount > result:', r);
    //       AppState.set({nbHitsLocal: r})
    //     }
    //     if (e) {
    //       console.log('collectionCount > error:', e);
    //     }
    //   })
    // }
  } else {
    notFound = true
    componentsList = []
  }

  return {
    ComponentType,
    notFound,
    results: AppState.get('results'),
    resultsType: AppState.get('resultsType'),
    loading: !componentDataHandle.ready()
  }
})(ComponentCategory)
