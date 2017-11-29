import React from 'react';
import { connectStateResults } from 'react-instantsearch-meteor/connectors';
import {
  Hits,
  Pagination,
  ClearAll
} from 'react-instantsearch-meteor/dom';
// import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import AppState from '/imports/startup/both/AppState.js';

function ResultsModal({isSearching, handleClearSearchState, searchState, searchResults, searchUrl, LeftDrawerOpen}) {
  const hasResults = true; // @todo - turn this into real variable
  if (!isSearching) return null;

  // console.log('searchState', searchState);
  // console.log('window.location', window.location);
  console.log('isSearching', isSearching);

  return (
    <div id="ResultsModal">
      { searchResults && searchResults.nbHits !== 0 ?
        <div className="resultsList">
          <h2 className="page-title-small">
            <a href="" className="clear-results-x" onClick={(e) => { e.preventDefault(); handleClearSearchState(); }}>
              <i className="fa fa-close"></i>
            </a>
            {' '}<span>Results</span>
          </h2>
          {/* <ClearAll /> */}
          <div>
            <div>
              <Hits />
            </div>
            <div>
              <Pagination showLast={true} />
            </div>
            <div>
              Permalink: <input type="text" value={searchUrl} readOnly />
            </div>
          </div>
        </div>
        :
        <NoResults query={searchState.query}/>
      }
    </div>
  )
}

const NoResults = ({query}) => {
  return (
    <div className="NoResults">
      <h2>No Results for: <strong>{query}</strong></h2>
    </div>
  )
}

export default connectStateResults(withTracker(({isSearching, handleClearSearchState, searchState, searchResults, searchStateToUrl}) => {
  // console.log('url', searchStateToUrl({location: window.location}, searchState));
  return {
    LeftDrawerOpen: AppState.get('LeftDrawerOpen'),
    searchUrl: searchStateToUrl({location: window.location}, searchState)
  }
})(ResultsModal))
