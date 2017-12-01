import React from 'react';
import { connectCurrentRefinements } from 'react-instantsearch-meteor/connectors';
import AppState from '/imports/startup/both/AppState.js';

function CurrentRefinementsModule({items, searchState}) {
  if ( (items && items.length !== 0) || (searchState.hasOwnProperty('query') && searchState.query !== "") ) {
    // console.log('HAS QUERY');
    AppState.set({isSearching: true});
  } else {
    // console.log('---NOQUERY---');
    AppState.set({isSearching: false});
  }

  return null
}

export default connectCurrentRefinements(CurrentRefinementsModule);
