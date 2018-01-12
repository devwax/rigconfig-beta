import React from 'react';
import {
  Button
} from "react-bootstrap";
import { connectStateResults } from 'react-instantsearch/connectors';
import { connectCurrentRefinements } from 'react-instantsearch/connectors';
import {
  Hits,
  Pagination,
  ClearAll
} from 'react-instantsearch/dom';
// import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import AppState from '/imports/startup/both/AppState.js';
import Result from './Result.jsx'

function ResultsModal({isSearching, handleClearSearchState, searchState, searchResults, searchUrl, drawerStates, items}) {
  if (!isSearching) return null;
  // searchResults && console.log(searchResults.hits);
  return (
    <div id="ResultsModal" className={drawerStates}>
      { searchResults && searchResults.nbHits !== 0 ?
        <div className="resultsList">
          <h2 className="page-title-small">
            <a href="" className="clear-results-x" onClick={(e) => { e.preventDefault(); handleClearSearchState(); }}>
              <i className="fa fa-close"></i>
            </a>
            {' '}<span>Results</span>
            { searchResults.query &&
              <span><span>:{' '}</span><span className="query-string">{searchResults.query}</span></span>
            }
          </h2>
          {/* <div className="metadata">
            {' '}<span><b>{searchResults.nbHits}</b> hits</span>
            {' '}<span>(in <b>{searchResults.processingTimeMS}</b> milliseconds)</span>
          </div> */}
          {/* <ClearAll /> */}
          <div>
            <div className="resultsForComponents">
              <ul className="results-list-format">
                <Hits hitComponent={Result} />
              </ul>
            </div>
            <div>
              <Pagination showLast={true} />
            </div>
            <div>
              <span className="permalink">
                Permalink: <input type="text" value={(window && window.location.protocol) + '//' + (window && window.location.host) + searchUrl} readOnly />
              </span>
              <span className="add-components">
                <Button
                  bsSize="small"
                  className="add-components-link"
                  bsStyle="default"
                  href="https://gitlab.com/rigconfig/ccdb#ccdb-computer-component-database"
                  target="ccdb"
                >
                  <i className="fa fa-plus"></i>
                  <span>Add Components</span>
                </Button>
              </span>
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

export default connectStateResults(withTracker(({handleClearSearchState, searchState, searchResults, searchStateToUrl, drawerStates}) => {
  // console.log('url', searchStateToUrl({location: window.location}, searchState));
  // console.log('results-props', this.props);
  return {
    searchUrl: searchStateToUrl({location: window.location}, searchState),
    isSearching: AppState.get('isSearching')
  }
})(ResultsModal))
