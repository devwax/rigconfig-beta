import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Link } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import AppState from '/imports/startup/both/AppState.js';
// import Actions from '/imports/startup/both/Actions.js';
import { PublicRigs } from '/imports/api/public_rigs/public_rigs.js';
import Results from '/imports/ui/both/components/Results/Results.jsx';
import { publicRigsCount } from '/imports/api/public_rigs/methods.js';

function HomePage({results, resultsType}) {
  return (
    <div id="HomePage">
      <h2>HomePage</h2>
      <h2 className="page-title-small">Latest Rigs</h2>
      {/* <Results results={results} resultsType={resultsType} /> */}

      {/* <div style={{marginTop: '50px', padding: '10px', border: '1px solid lightgray'}}>
        <ul>
          <li><Link to="/c/cpus/">CPUs</Link></li>
          <li><Link to="/c/motherboards/">Motherboards</Link></li>
          <li><Link to="/c/video_cards/">Video Cards</Link></li>
          <li><Link to="/c/cases/">Cases</Link></li>
          <li><Link to="/c/cpu_fans/">CPU Fans</Link></li>
          <li><Link to="/c/memory/">Memory</Link></li>
          <li><Link to="/c/psus/">PSUs</Link></li>
          <li><Link to="/c/ssds/">SSDs</Link></li>
        </ul>
      </div> */}
    </div>
  )
}

export default withTracker(() => {
  const algoliaActive = AppState.get('algoliaActive')
  AppState.set({results: []})

  publicRigsHandle = Meteor.subscribe('publicRigs', AppState.get('paginationLimit'))
  const loading = !publicRigsHandle.ready()
  publicRigs = PublicRigs.find().fetch()
  // @todo - update appstate > results here if subsciption is ready, else use current results in AppState > results
/*
  if (!loading && !algoliaActive) {
    AppState.set({results: publicRigs})
  } // implicit else keeps the current results in AppState('results') if loading collection subscription
*/
  if (!loading) {
    AppState.set({results: publicRigs})
  // } // implicit else keeps the current results in AppState('results') if loading collection subscription
  }

  // if (algoliaActive) {
  //   AppState.set({resultsType: 'components'})
  // } else {
  //   AppState.set({resultsType: 'rigs'})
  // }
  AppState.set({resultsType: 'rigs'})

  if (Meteor.isClient) {
    publicRigsCount.call((e, r) => { AppState.set({nbHitsLocal: r}) })
  }

  return {
    results: AppState.get('results'),
    resultsType: AppState.get('resultsType')
  }
})(HomePage)
