import { Meteor } from 'meteor/meteor';
import React from 'react';
import Facet from './Facet.jsx'
import AppState from '/imports/startup/both/AppState.js';
import { withTracker } from 'meteor/react-meteor-data';

class FacetsContainer extends React.Component {
  getFacetValues(facet) {
    let values = []
    for (var v in facet.data) {
      if (facet.data.hasOwnProperty(v)) {
        // console.log('v: %s, facet.data[v], %s, typeof facet.data[v]: %s', v, facet.data[v], typeof facet.data[v]);
        values.push({name: v, isRefined: false, count: facet.data[v] })
      }
    }
    return values
  }
  render() {
    return (
      <div id="wrapper">
        <div id="facets">
          <form>
            {this.props.facets.map((facet, idx) => {
              let facetValues
              if (this.props.algoliaActive) {
                facetValues = window.searchResults.getFacetValues(facet.name)
              } else {
                facetValues = this.getFacetValues(facet)
              }
              return <Facet key={facet.name + idx} facetName={facet.name} facetValues={facetValues} algoliaActive={this.props.algoliaActive} />
            })}
          </form>
        </div>
      </div>
    )
  }
}

export default withTracker(() => {
  const algoliaActive = AppState.get('algoliaActive')
  return {
    facets: algoliaActive ? AppState.get('facets') : AppState.get('facetsDefault'),
    algoliaActive
  }
})(FacetsContainer)
