import React from 'react';
import { Link } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import AppState from '/imports/startup/both/AppState.js';
import Actions from '/imports/startup/both/Actions.js';
import { GuestRigs } from '/imports/api/rigs/guest_rigs.js';
import { GuestRigComponents } from '/imports/api/rig_components/guest_rig_components.js';
// import SearchBox from '/imports/ui/both/components/Results/SearchBox.jsx'
import { SearchBox } from 'react-instantsearch-meteor/dom';
import GitlabLogoSvg from '/imports/ui/both/components/GitlabLogoSvg.jsx';

function Navbar({LeftDrawerClass, RightDrawerClass, componentsCount}) {
  return (
    <div id="Navbar">
      <div id="Navbar-wrapper">
        <div id="Navbar-inner">
          <div id="logo">
            <a id="LeftDrawer-toggle" className={LeftDrawerClass} href="" onClick={(e) => {Actions.toggleLeftDrawer(e)}}><i className="fa fa-bars"></i></a>
            <div id="app-title">
              <Link to="/">
                <span className="words rig">rig</span>
                <span className="words config">c<i className="fa fa-stop-circle-o" aria-hidden="true"></i>nfig</span>
              </Link>
            </div>
          </div>
          <div id="signin">
            <GitlabLogoSvg />

            <a id="RightDrawer-toggle" className={RightDrawerClass} href="" onClick={(e) => {Actions.toggleRightDrawer(e)}}>
              <i className="fa fa-hdd-o"></i>
              <span className="badge">{componentsCount}</span>
              {/* { componentsCount > 0 && <span className="badge">{componentsCount}</span> } */}
            </a>

            <i id="UserSettings-toggle" onClick={(e) => {Actions.openUserSettingsModal(e)}} className="fa fa-cog"></i>
          </div>
          <div id="Navbar-content">
            <SearchBox translations={{placeholder: "Search..."}} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default withTracker(() => {
  return {
    LeftDrawerClass:   AppState.get('LeftDrawerOpen')  ? 'active' : '',
    RightDrawerClass:  AppState.get('RightDrawerOpen') ? 'active' : '',
    componentsCount:     AppState.get('componentsCount')
  }
})(Navbar)
