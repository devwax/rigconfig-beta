import { Meteor } from 'meteor/meteor';
import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import AppState from '/imports/startup/both/AppState.js';
import { AppConfig } from '/imports/startup/both/AppConfig.js';

function MoreButton({algoliaActive, nbHits, paginationLimit, pathname}) {
  if (pathname === '/') { return null }

  if (algoliaActive) {
    if ( nbHits > paginationLimit ) {
      return (
        <button onClick={() => {
          const newPaginationLimit = paginationLimit + AppConfig.paginationDefault
          AppState.set({isPaginating: true})
          window.helper.setQueryParameter('hitsPerPage', newPaginationLimit).search();
          AppState.set({paginationLimit: newPaginationLimit})
        }}>More...</button>
      )
    } else {
      return null
    }

  // algoliaActive === false, so MoreButton should modify meteor pub/sub instead of algolia query
  } else {
    // More button for Meteor subscription / publication rather than algolia results
    if (nbHits > paginationLimit) {
      return (
        <button onClick={() => {
          const newPaginationLimit = paginationLimit + AppConfig.paginationDefault
          AppState.set({isPaginating: true})
          AppState.set({paginationLimit: newPaginationLimit})
          // @todo - Need to set 'isPaginating' back to false after change of subscription / results... see <HomePage />
        }}>More... (meteor pub/sub)</button>
      )
    } else {
      return null
    }
  }

}

export default withTracker(() => {
  const algoliaActive = AppState.get('algoliaActive')
  return {
    algoliaActive,
    // nbHits: algoliaActive ? AppState.get('nbHits') : AppState.get('prCount'),
    nbHits: algoliaActive ? AppState.get('nbHits') : AppState.get('nbHitsLocal'),
    paginationLimit: AppState.get('paginationLimit'),
    pathname: AppState.get('pathname')
  }
})(MoreButton)
