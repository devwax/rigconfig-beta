import { Meteor } from 'meteor/meteor';
import React from "react";
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import AppConfig from '/imports/startup/both/AppConfig.js';
import { withTracker } from 'meteor/react-meteor-data';
import AppState from '/imports/startup/both/AppState.js';
import Results from '/imports/ui/both/components/Results/Results.jsx';
import { Button } from "react-bootstrap";

function SearchPage({searchResults, resultsType}) {
    return (
      <section id="SearchPage">
        <div>
          <Helmet
            // @todo - add search query to page title (algolia's window.helper.getState())
            title={'Search Page' + ' @ ' + AppConfig.site.title}
          />

          <h2 className="page-title">Search:</h2>

          <Results results={searchResults} resultsType={resultsType} />
        </div>
      </section>
    )
}

// SearchPage.contextTypes = { router: PropTypes.object }

export default withTracker(() => {
  // @todo - add params from router to destructured args
/*
  const algoliaActive = AppState.get('algoliaActive')
  if (algoliaActive) {
    AppState.set({resultsType: 'components'})
  } else {
    AppState.set({resultsType: 'rigs'})
  }
*/
  AppState.set({resultsType: 'components'})

  return {
    searchResults: AppState.get('algoliaActive') ? AppState.get('searchResults') : [],
    resultsType: AppState.get('resultsType')
  }
})(SearchPage)
