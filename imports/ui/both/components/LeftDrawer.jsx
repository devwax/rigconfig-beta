import React from 'react';
// import { connectStateResults } from 'react-instantsearch-meteor/connectors';
import {
  RefinementList,
  ClearAll,
  Panel,
  MenuSelect
} from 'react-instantsearch-meteor/dom';
import '/node_modules/react-instantsearch-theme-algolia/style.css';
import orderBy from 'lodash.orderby';
import { Scrollbars } from 'react-custom-scrollbars';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import AppState from '/imports/startup/both/AppState.js';
import Actions from '/imports/startup/both/Actions.js';
import classnames from 'classnames';
import FacetsContainer from './Facets/FacetsContainer.jsx';
import { formatTitle } from '/imports/api/lib/formatTitle.js';

function LeftDrawer({drawerStates, handleClearSearchState, isSearching}) {
  return (
    <div id="LeftDrawer" className={drawerStates}>
      {/* <QueryStateDemo /> */}
      <Scrollbars
        autoHide
        autoHideTimeout={500}
        autoHideDuration={500}
        universal={true}
        thumbMinSize={0}
      >
        <div className="LeftDrawer-padding">
          <MenuSelect
            attributeName="type"
            transformItems={
              items => {
                const transformed_items = items.map(item => {
                  item.label = item.label.split('_').join(' ').toUpperCase();
                  // See: https://github.com/algolia/react-instantsearch/compare/master...devwax:patch-1
                  // item.count = item.count.toLocaleString();
                  return item;
                });
                return transformed_items;
              }
            }
            translations={{seeAllOption: "Components"}}
          />

          {/* <ClearAll
            translations={{reset: (<span className="clear-all-container"><i className="fa fa-times"></i> <span>Clear All</span></span>)}}
            clearsQuery
          /> */}

          { isSearching &&
            <button className="ais-ClearAll__root" onClick={(e) => { e.preventDefault(); handleClearSearchState(); }}>
              <span className="clear-all-container">
                <i className="fa fa-times"></i>{' '}<span>Clear All</span>
              </span>
            </button>
          }

          <Panel title="MFTR">
            <RefinementList
              attributeName="mftr"
              transformItems={items => orderBy(items, ['label', 'count'], ['asc', 'desc'])}
              operator="or"
              showMore={false}
            />
          </Panel>

          <Panel title="MAX MEMORY">
            <RefinementList
              attributeName="max_memory"
              transformItems={items => orderBy(items, ['label', 'count'], ['asc', 'desc'])}
              operator="or"
              showMore={false}
            />
          </Panel>

        </div>
      </Scrollbars>
    </div>
  )
}

export default withTracker(({drawerStates, handleClearSearchState, isSearching}) => {
  return {}
})(LeftDrawer)
