import React from "react";
import { withRouter } from 'react-router';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import {
  InstantSearch,
  HierarchicalMenu,
  Hits,
  Menu,
  Pagination,
  PoweredBy,
  StarRating,
  RefinementList,
  SearchBox,
  ClearAll,
  Panel,
  MenuSelect
} from 'react-instantsearch-meteor/dom';
import '/node_modules/react-instantsearch-theme-algolia/style.css';

import { Button } from "react-bootstrap";
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import Helmet from 'react-helmet';
import HomePage from '/imports/ui/both/components/HomePage.jsx';
import ResultsModal from '/imports/ui/both/components/Results/ResultsModal.jsx';
// import ComponentCategory from '/imports/ui/both/pages/ComponentCategory.jsx';
import ComponentPage from '/imports/ui/both/pages/ComponentPage.jsx';
import RigPage from '/imports/ui/both/pages/RigPage.jsx';
import SearchPage from '/imports/ui/both/pages/SearchPage.jsx';
import TestPage from '/imports/ui/both/pages/TestPage.jsx';
import { NotFound } from '/imports/ui/both/components/NotFound.jsx';
import classnames from 'classnames';
import AppConfig from '/imports/startup/both/AppConfig.js';
import AppState from '/imports/startup/both/AppState.js';
import Actions from '/imports/startup/both/Actions.js';
import Navbar from "/imports/ui/both/components/Navbar.jsx";
import RightDrawer from "/imports/ui/both/components/RightDrawer.jsx";
import LeftDrawer from "/imports/ui/both/components/LeftDrawer.jsx";
import UserSettingsModal from "/imports/ui/both/modals/UserSettingsModal.jsx";
// import { algoliaInclude } from '/imports/api/lib/algolia-include.js';
// import { heapInclude } from '/imports/api/lib/heap-include.js';
import PropTypes from 'prop-types';
import qs from 'qs';
import orderBy from 'lodash.orderby';
import valuesIn from 'lodash.valuesin';

class App extends React.Component {
  constructor(props) {
    super(props);
    // console.log('props', props);
    this.handleClearSearchState = this.handleClearSearchState.bind(this);
    this.onSearchStateChange = this.onSearchStateChange.bind(this);
    this.normalizeState = this.normalizeState.bind(this);
    // this.clearSearchState = this.clearSearchState.bind(this);
    this.isSearching = false;
    this.updateAfter = 700;
    this.createURL = state => `?${qs.stringify(state)}`;
    this.searchStateToUrl = (props, searchState) => this.normalizeState(searchState) ? `${props.location.pathname}${this.createURL(searchState)}` : '';
    this.urlToSearchState = location => qs.parse(location.search.slice(1));
    this.state = { searchState: this.urlToSearchState(props.location) };
    props.location.search.slice(1) && this.normalizeState(this.state.searchState)
    // console.log('Initial Search State:', this.urlToSearchState(props.location));
  }

  componentWillReceiveProps(props) {
    // console.log('props.location', this.props.location);
    if (props.location.key !== this.props.location.key) {
      this.setState({ searchState: this.urlToSearchState(props.location) });
      this.normalizeState(this.urlToSearchState(props.location));
    }
  }

  onSearchStateChange(searchState) {
    this.normalizeState(searchState);

    clearTimeout(this.debouncedSetState);
    this.debouncedSetState = setTimeout(() => {
      this.props.history.push(
        this.searchStateToUrl(this.props, searchState),
        searchState
      );
    }, this.updateAfter);
    this.setState({ searchState });
  }

  handleClearSearchState() {
    this.setState({ searchState: {} });
    // then update the url, see onSearchStateChange above
    this.props.history.push(
      this.searchStateToUrl(this.props, {}),
      {}
    );
  }

  normalizeState(state = {}, isSearching = false) {
    // console.log('state', state);

    // state.refinementList
    if (state.hasOwnProperty('refinementList')) {
      isSearching = false;
      valuesIn(state.refinementList).map(i => i && i.map(v => v && (isSearching = true)));
      !isSearching && delete state.refinementList;
      if (isSearching) { this.isSearching = true; return state; }
    }

    // state.menu
    if (state.hasOwnProperty('menu')) {
      isSearching = false;
      valuesIn(state.menu).map(i => i && (isSearching = true));
      !isSearching && delete state.menu;
      if (isSearching) { this.isSearching = true; return state; }
    }

    // state.query
    if (state.hasOwnProperty('query')) {
      isSearching = false;
      state.query && (isSearching = true);
      !isSearching && delete state.query;
      if (isSearching) { this.isSearching = true; return state; }
    }

    // state.page (must be last conditional in list)
    if (state.hasOwnProperty('page') && isSearching === false && state.page == 1) {
      delete state.page;
    }

    this.isSearching = isSearching;

    return state;
  }

  // clearSearchState(state) {
  //   this.setState{searchState: {}};
  // }

  render() {
    const { defaultTitle, pageTitle, canonicalURL, initialRender, UserSettingsModalOpen, drawerStates } = this.props;
    return (
      <InstantSearch
        appId={Meteor.settings.public.algoliaAppId}
        apiKey={Meteor.settings.public.algoliaSearchApiKey}
        indexName="rigconfig_components"
        // appId="latency"
        // apiKey="6be0576ff61c053d5f9a3225e2a90f76"
        // indexName="ikea"
        searchState={this.state.searchState}
        onSearchStateChange={this.onSearchStateChange.bind(this)}
        createURL={this.createURL}
      >
        <h2>App</h2>
        <a href="" onClick={(e) => { e.preventDefault(); this.handleClearSearchState(); }}>Clear search state</a>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/testpage">TestPage</Link></li>
        </ul>

        <Switch>
          <Route exact path="/" name="homepage" component={HomePage} />
          {/* <Route path="/c/:type" component={ComponentCategory} /> */}
          <Route path="/c/:type/:id" component={ComponentPage} />
          <Route path="/rig/:id" component={RigPage} />
          <Route path="/search" component={SearchPage} />
          <Route path="/testpage" name="testpage" component={TestPage} />
          <Route component={NotFound}/>
        </Switch>

        <Helmet
          {...defaultTitle}
          title={pageTitle}
          link={[
            {"rel": "stylesheet", "href": "https://cdn.jsdelivr.net/fontawesome/4.7.0/css/font-awesome.min.css"},
            {"rel": "canonical", "href": canonicalURL},
            {"rel": "apple-touch-icon", "sizes": "180x180", "href": "/apple-touch-icon.png"},
            {"rel": "icon", "type":"image/png", "href": "/favicon-32x32.png", "sizes": "32x32"},
            {"rel": "icon", "type":"image/png", "href": "/favicon-16x16.png", "sizes": "16x16"},
            {"rel": "manifest", "href": "/manifest.json"},
            {"rel": "mask-icon", "href": "/safari-pinned-tab.svg", "color": "#ee0b0b"}
          ]}
          meta={[
            {"name": "apple-mobile-web-app-title", "content": "RigConfig"},
            {"name": "application-name", "content": "RigConfig"},
            {"name": "theme-color", "content": "#ffffff"}
          ]}
        />

        <Navbar />

        <LeftDrawer { ...{initialRender, drawerStates } } />

        <RightDrawer { ...{initialRender, drawerStates } } />

        <ResultsModal isSearching={this.isSearching} handleClearSearchState={this.handleClearSearchState} />

        <Helmet
          script={[
          // {
          //   "type": "text/javascript",
          //   "innerHTML": heapInclude
          // },
          {
            "type": "text/javascript",
            "src": "/a/j/Sortable.js"
          },

          // Use this: https://github.com/clauderic/react-sortable-hoc
          {
            "type": "text/javascript",
            "innerHTML": `
              function initSortable() {
                var el = document.getElementById('components-list');
                // console.log(el)
                var sortable = new Sortable.create(el, {
                  draggable: ".rig-component",
                  onEnd(e) {
                    Actions.recalculateSortOrder();
                  }
                });
              }
              setTimeout(initSortable, 3000);
              // @todo - race condition?
            `
          }
        ]}
        />

        <div className="site-footer">
          <p className="" style={{float: 'left'}}>
            {/* <a href="https://gitlab.com/rigconfig/ccdb" target="ccdb">Add Components</a> */}
            <Button
              bsSize="small"
              className="add-components-link"
              bsStyle="link"
              href="https://gitlab.com/rigconfig/ccdb#ccdb-computer-component-database"
              target="ccdb"
            >
              <i className="fa fa-plus"></i>
              <span>&nbsp;Add Components</span>
            </Button>
          </p>
          <p style={{float: 'right'}}>
            <a href="/privacy-policy.html" rel="nofollow" target="_privacy-policy">Privacy Policy</a>
            <span className="divider">|</span>
            <a href="/tos.html" rel="nofollow" target="_tos">TOS</a>
          </p>
        </div>

        <UserSettingsModal UserSettingsModalOpen={UserSettingsModalOpen} />



        {/* <div>
          <div>
            <Hits />
          </div>
          <div>
            <Pagination showLast={true} />
          </div>
        </div> */}

      </InstantSearch>
    );
  }
}

App.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
  location: PropTypes.object.isRequired,
};

export default withRouter(withTracker(({location}) => {
  const defaultTitle = AppConfig.site.title + ' - ' + AppConfig.site.tagline
  const pageTitle = AppConfig.site.title + ' - ' + AppConfig.site.tagline
  const canonicalURL = AppConfig.site.rootUri + location.pathname
  const LeftDrawerOpen = AppState.get('LeftDrawerOpen')
  const RightDrawerOpen = AppState.get('RightDrawerOpen')
  const initialRender = AppState.get('initialRender')
  const UserSettingsModalOpen = AppState.get('UserSettingsModalOpen')
  const drawerStates = classnames({LeftDrawerOpen, RightDrawerOpen})
  // console.log('location-App', location);
  return {
    defaultTitle,
    pageTitle,
    canonicalURL,
    RightDrawerOpen,
    LeftDrawerOpen,
    initialRender,
    UserSettingsModalOpen,
    drawerStates
  }
})(App));
