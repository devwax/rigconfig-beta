import { Meteor } from 'meteor/meteor'
import React from 'react';
// import { ReactRouterSSR } from 'meteor/reactrouter:react-router-ssr';
import ReactHelmet from 'react-helmet';
import AppState from '/imports/startup/both/AppState.js';
import Actions from '/imports/startup/both/Actions.js';
import App from '/imports/ui/both/components/App.jsx';
// import HomePage from '/imports/ui/both/components/HomePage.jsx';
import RigPage from '/imports/ui/both/pages/RigPage.jsx';
import SearchPage from '/imports/ui/both/pages/SearchPage.jsx';
import ComponentPage from '/imports/ui/both/pages/ComponentPage.jsx';
import ComponentCategory from '/imports/ui/both/pages/ComponentCategory.jsx';
import { NotFound } from '/imports/ui/both/components/NotFound.jsx';
import TestPage from '/imports/ui/both/pages/TestPage.jsx';

Meteor.startup(() => {
  // <Router>
  //     <Route exact path="/" component={App} />
  //     <Route path="/" component={HomePage} />
  //     <Route path="c/:type" component={ComponentCategory} />
  //     <Route path="c/:type/:id" component={ComponentPage} />
  //     <Route path="rig/:id" component={RigPage} />
  //     <Route path="/search" component={SearchPage} />
  //     {/* <Route path="/testpage" component={TestPage} /> */}
  //     <Route path="*" component={NotFound} />
  // </Router>

  // const routes = (
  //   <Route path="/" component={App}>
  //     <IndexRoute component={HomePage} />
  //     <Route path="c/:type" component={ComponentCategory} />
  //     <Route path="c/:type/:id" component={ComponentPage} />
  //     <Route path="rig/:id" component={RigPage} />
  //     <Route path="/search" component={SearchPage} />
  //     {/* <Route path="/testpage" component={TestPage} /> */}
  //     <Route path="*" component={NotFound} />
  //   </Route>
  // );

  // Router.Run(routes, {
  //   props: {
  //     onUpdate() {
  //       AppState.set({pathname: window.location.pathname})
  //     }
  //   }
  // }, {
  //   // htmlHook(html) {
  //   //   const head = ReactHelmet.renderStatic();
  //   //   return html.replace('<head>', '<head>' + head.title + head.base + head.meta + head.link + head.script);
  //   // }
  //   htmlHook(html) {
  //     // let head = ReactHelmet.renderStatic();
  //     let head = ReactHelmet.renderStatic();
  //     html = html.replace('<head>', '<head>' + head.title + head.base + head.meta + head.link);
  //
  //     // Load js scripts at the bottom of the page
  //     html = html.replace('</body>', head.script + '</body>');
  //     return html;
  //   }
  // });
});
