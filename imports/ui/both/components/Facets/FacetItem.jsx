import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import AppState from '/imports/startup/both/AppState.js';

export default FacetItem = ({facetName, valueName, valueNameFormatted, count, checked, checkedClass, algoliaActive}, context) =>
  <dd>
    <label className={checkedClass}>
      <input
        type="checkbox"
        // defaultChecked={checked}
        checked={checked}
        readOnly={true}
        onClick={ (e) => {
          AppState.set({isPaginating: false});
          window.helper.setQueryParameter('hitsPerPage', 20);
          window.helper.toggleRefinement(facetName, valueName).search()
          context.router.push('/search')
        }
      } />
      <span className="label-text">{valueNameFormatted}</span>
    </label>
    { algoliaActive && <span className="facet-count">({count})</span> }
  </dd>

FacetItem.contextTypes = { router: PropTypes.object }
