import React from 'react';
import { connectStateResults } from 'react-instantsearch-meteor/connectors';
import { connectCurrentRefinements } from 'react-instantsearch-meteor/connectors';
import {
  Hits,
  Pagination,
  ClearAll
} from 'react-instantsearch-meteor/dom';
// import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import AppState from '/imports/startup/both/AppState.js';
import Result from './Result.jsx'

function ResultsModal({isSearching, handleClearSearchState, searchState, searchResults, searchUrl, LeftDrawerOpen, items}) {
  if (!isSearching) return null;

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
              <div className="resultsForComponents">
                <ul className="results-list-format">
                  <Hits hitComponent={Result} />
                </ul>
              </div>
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

export default connectStateResults(withTracker(({handleClearSearchState, searchState, searchResults, searchStateToUrl}) => {
  // console.log('url', searchStateToUrl({location: window.location}, searchState));
  // console.log('results-props', this.props);
  return {
    LeftDrawerOpen: AppState.get('LeftDrawerOpen'),
    searchUrl: searchStateToUrl({location: window.location}, searchState),
    isSearching: AppState.get('isSearching')
  }
})(ResultsModal))
