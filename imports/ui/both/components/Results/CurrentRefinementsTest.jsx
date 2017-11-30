import React from 'react';
import { connectCurrentRefinements } from 'react-instantsearch-meteor/connectors';
import AppState from '/imports/startup/both/AppState.js';

function CurrentRefinementsTest(props) {
  // console.log('props.items-connectCurrentRefinements', props);
  // if (props.hasOwnProperty('items') && props.items.length !== 0) {
    console.log('HAS QUERY!!!!');
    AppState.set({isSearching: true});
  } else {
    console.log('---NOQUERY---');
    AppState.set({isSearching: false});
  }
  return null
}

export default connectCurrentRefinements(CurrentRefinementsTest);
