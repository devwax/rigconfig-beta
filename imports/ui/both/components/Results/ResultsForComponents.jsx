import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "react-bootstrap";
import Actions from '/imports/startup/both/Actions.js';
import { componentLink } from '/imports/api/lib/componentLink.js';

export default function ResultsForComponents({results, ComponentType}) {
  // console.log('ResultsForComponents > ComponentType:', ComponentType);
  return (
    <div className="resultsForComponents">
      {/* <p><b>Components</b> detected</p> */}
      <ul className="results-list-format">
        { results.map(item => {
          let title;
          if (item.hasOwnProperty("_highlightResult")) {
            title = item._highlightResult.title.value
          } else {
            title = item.title
          }
          title = {__html: title}
          return (
            <li key={item._id}>
              <Link to={componentLink(item._id, ComponentType, item.title)}>
                <h4 dangerouslySetInnerHTML={title}></h4>
              </Link>
              {/* <a href="" onClick={e => {
                e.preventDefault()
                console.log('item:', item);
                // addtorig goes here...
                Actions.addToRig(item)
              }}>Add to Rig</a> */}
              <Button
                className="add-to-rig-button"
                bsStyle="default"
                bsSize="small"
                onClick={e => Actions.addToRig(item) }>
                <i className="fa fa-plus" style={{marginRight: 5}}></i>
                <span>Add to Rig</span>
              </Button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
/*
@todo - Need to be able to set the resultsType from 'components' to 'rigs' independently when...
  - clicking the tab in the left drawer
  - when clicking any facets in the opposite resultsType (i.e. Homepage starts as componentType 'rigs',
    but if you click a facet in the left column it should switch to 'components')
    - Maybe check for current algolia index or switch them with a setAlgoliaIndex('rigconfig_components') action?
     (it already does that, though, on it's own, we just need to keep track of resultsType for templating in <Results />)
- Set something in algolia-include.js on change that keeps this logic and changes algolia indexes when necessary from components to rigs, etc.
- Then check for this in <Results />
*/
