import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Link } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import AppState from '/imports/startup/both/AppState.js';
import { numberWithCommas } from '/imports/ui/both/helpers'
// import ResetButton from '/imports/ui/both/components/Results/ResetButton.jsx';
import MoreButton from '/imports/ui/both/components/Results/MoreButton.jsx';
import ResultsForRigs from '/imports/ui/both/components/Results/ResultsForRigs.jsx';
import ResultsForComponents from '/imports/ui/both/components/Results/ResultsForComponents.jsx';

function Results({results, resultsType, ComponentType, hasResults, nbHits, LeftDrawerOpen, showAlgoliaAttr}) {
  return (
    <div id="Results">
      {/* { (nbHits || nbHits === 0) && <h2>Results: <span className="results-nbHits">{`(${nbHits})`}</span></h2> } */}

      { hasResults ?
        <div className="resultsList">
          <h2 className="page-title-small">{ComponentType}</h2>
          {/* <ResetButton /> */}
          { resultsType === 'components' && <ResultsForComponents results={results} ComponentType={ComponentType} /> }
          { resultsType === 'rigs' && <ResultsForRigs results={results} nbHits={nbHits} LeftDrawerOpen={LeftDrawerOpen} /> }
          <MoreButton />
        </div>
        :
        <NoResults />
      }
      { showAlgoliaAttr &&
        <div className="algolia-attribution">
          Powered by <a href="https://www.algolia.com/" rel="nofollow" target="algolia"><img src="/a/i/algolia-attribution.png" alt="Search Powered by Algolia"/></a>
        </div>
      }
    </div>
  )
}

const NoResults = () => {
  return (
    <div className="no-results">
      <h2>&lt; No Results &gt;</h2>
      <div className="go-home">
        Go to: <Link to={"/"}>Home Page</Link>
      </div>
    </div>
  )
}
/*
function NoResults({loading}) {
  return (
    <div className="no-results">
      { ! loading ?
        <div>
          <h2>&lt; No Results &gt;</h2>
          <div className="go-home">
            Go to: <Link to={"/"}>Home Page</Link>
          </div>
        </div>
        :
        <div className="loading-img"><img src="/a/i/loading.gif" alt="Loading..." /></div>
      }
    </div>
  )
}
*/

export default withTracker(({results, resultsType, ComponentType}) => {
  // @todo - this is the product of a larger mess that needs to be cleaned up...
  const isSearchPage = AppState.get('pathname').indexOf('/search') !== -1
  let nbHits = false;
  if (isSearchPage) {
    nbHits = numberWithCommas(AppState.get('nbHits'))
  } else {
    nbHits = numberWithCommas(AppState.get('nbHitsLocal'))
  }
  if (!AppState.get('algoliaActive') && isSearchPage) {
    nbHits = false;
  }
  // isSearchPage ? numberWithCommas(AppState.get('nbHits')) : numberWithCommas(AppState.get('nbHitsLocal'))

  let hasResults = true;
  // console.log('results.length:', results.length);
  if (results.length === 0) {
    hasResults = false
  } else if (!ComponentType) {
    ComponentType = results[0].type
  }

  // console.log('Results.jsx > results', results);

  return {
    // nbHits: AppState.get('algoliaActive') ? numberWithCommas(AppState.get('nbHits')) : false,
    results,
    resultsType,
    ComponentType,
    hasResults,
    nbHits,
    LeftDrawerOpen: AppState.get('LeftDrawerOpen'),
    showAlgoliaAttr: isSearchPage
  }
})(Results)
