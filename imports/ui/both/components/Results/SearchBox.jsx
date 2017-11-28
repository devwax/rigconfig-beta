// NOT USED
// import { Meteor } from 'meteor/meteor';
// import React from 'react';
// import PropTypes from 'prop-types';
// import { withTracker } from 'meteor/react-meteor-data';
// import AppState from '/imports/startup/both/AppState.js';
// import Actions from '/imports/startup/both/Actions.js';
// import { $ } from 'meteor/jquery';
// import { Debounce } from 'react-throttle';
//
// const SearchBox = ({algoliaQuery}, context) =>
//   <form id="Navbar-search" action="" onSubmit={(e) => {e.preventDefault()}}>
//     { algoliaQuery.length > 0 &&
//       <div
//         className="cancel-search-btn"
//         onClick={(e) => {
//           window.helper.setQuery('').search()
//           $('#Navbar-search-term').val('')
//         }}
//       >
//         <i className="fa fa-times-circle"></i>
//       </div>
//     }
//
//     <div id="Navbar-search-terms">
//       <Debounce time="370" handler="onChange">
//         <input type="text"
//           id="Navbar-search-term"
//           placeholder="Search..."
//           onChange={e => {
//             window.helper.setQuery(e.target.value).search()
//             // - Check AppState(pathname) to see if we are already on /search page.
//             // - If not, then redirect to it; else do nothing.
//             const isSearchPage = AppState.get('pathname').indexOf('/search') !== -1
//             if (!isSearchPage) {
//               context.router.push('/search')
//             }
//           }}
//           onFocus={ (e) => {
//               document.addEventListener("keydown", Actions._handleEscKeySearch, false)
//             }
//           }
//           onBlur={ (e) => {
//               document.removeEventListener("keydown", Actions._handleEscKeySearch, false)
//             }
//           }
//         />
//       </Debounce>
//     </div>
//   </form>
//
// SearchBox.contextTypes = { router: PropTypes.object }
//
// export default withTracker(() => {
//   return {
//     algoliaQuery: AppState.get('algoliaQuery')
//   }
// })(SearchBox)
