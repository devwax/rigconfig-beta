// NO USED
import React from 'react';
import { Tabs, Tab, Button, ButtonToolbar } from "react-bootstrap";
import { Scrollbars } from 'react-custom-scrollbars';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import AppState from '/imports/startup/both/AppState.js';
import Actions from '/imports/startup/both/Actions.js';
import classnames from 'classnames';
import FacetsContainer from './Facets/FacetsContainer.jsx'

function LeftDrawer({drawerStates}) {
  const clearButtonClasses = classnames({
    "clear-button": true,
    "full-width": true
  })

  const clearButtonPlaceholderClasses = classnames({
    "clear-button-placeholder": true
  })

  return (
    <div id="LeftDrawer" className={drawerStates}>
      <Scrollbars
        autoHide
        autoHideTimeout={500}
        autoHideDuration={500}
        universal={true}
        thumbMinSize={0}
      >
        <Tabs defaultActiveKey={1} id="source-selector"
          onSelect={(eventKey) => {
            if (eventKey == 1) { // components tab selected
              // @todo - toggle modes/search indexes from components to rigs when tabs are clicked
              // - clear facets, keep query, change algolia index, then search()
              // - update 'search for' text in search box when change of source occurs (AppState('resultsSource'))
              // - Note: Rigs searching / browsing isn't implemented yet, so resultsSource isn't used yet.
              AppState.set({resultsSource: 'components'})
            } else if (eventKey == 2) { // rigs tab selected
              AppState.set({resultsSource: 'rigs'})
            }
          }}
        >
          <Tab eventKey={1} title="Components">
            <div className="LeftDrawer-padding">
              <ButtonToolbar className="search-and-clear">
                <div className={clearButtonPlaceholderClasses}>
                  Browse Components...
                </div>
                <Button
                  bsSize="small"
                  className={clearButtonClasses}
                  onClick={(e) => { Actions.clearAlgoliaSearch(e) }}
                >
                  <i className="fa fa-close"></i>
                  <span>&nbsp;Clear</span>
                </Button>
              </ButtonToolbar>

              <FacetsContainer />
            </div>
          </Tab>
          <Tab eventKey={2} title="Rigs">
            <br/>&nbsp; &nbsp; &nbsp;Not yet implemented &nbsp; <span className="gitlab-icon"><a href="https://gitlab.com/rigconfig/rigconfig" target="_blank" title="Contribute on GitLab" alt="Contribute on GitLab"><i className="fa fa-gitlab" aria-hidden="true"></i></a></span><br/><br/>
          </Tab>
        </Tabs>
      </Scrollbars>
    </div>
  )
}

export default LeftDrawer

// export default withTracker(({drawerStates}) => ({hasQuery: AppState.get('algoliaActive')}))(LeftDrawer)
