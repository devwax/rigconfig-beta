import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, ButtonGroup } from "react-bootstrap";
import AppState from '/imports/startup/both/AppState.js';
import Actions from '/imports/startup/both/Actions.js';
import { AppConfig } from '/imports/startup/both/AppConfig.js';
import { rigLink } from '/imports/api/lib/rigLink.js';
import { componentLink } from '/imports/api/lib/componentLink.js';
import marked from 'marked'
import markdownRenderer from '/imports/api/lib/markdownRenderer.js'
import { truncateText } from '/imports/ui/both/helpers';
import { stripHTML } from '/imports/api/lib/stripHTML.js';
import MasonryLayout from '/imports/ui/both/components/react-masonry-layout/src/components/MasonryLayout.jsx'

export default class ResultsForRigs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      isLoading: false,
      items: props.results
    };
  }
/*
  getItems() {
    if (this.state.count >= this.props.maxCount) return
    this.setState(Object.assign(
      {},
      this.state,
      { isLoading: true }
    ), () => {
      setTimeout(() => {
        this.setState(Object.assign(
          {},
          this.state,
          {
            isLoading: false,
            items: this.state.items.concat(
              Array(20).fill()
            )
          }
        ))
      }, 500)
    })
  }
*/
  getItems() {
    if (AppState.get('paginationLimit') >= this.props.nbHits) return
    this.setState(Object.assign(
      {},
      this.state,
      { isLoading: true }
    ), () => {
      setTimeout(() => {
        this.setState(Object.assign(
          {},
          this.state,
          {
            isLoading: false,
            items: this.state.items.concat(this.props.results)
          }
        ))
        const newPaginationLimit = AppState.get('paginationLimit') + AppConfig.paginationDefault
        AppState.set({paginationLimit: newPaginationLimit})
      }, 0)
    })
  }

  render() {
    // const sizes = this.props.LeftDrawerOpen ? [ { columns: 2, gutter: 20 }, { mq: '768px', columns: 2, gutter: 20 }, { mq: '910px', columns: 3, gutter: 20 }, { mq: '1135px', columns: 4, gutter: 20 }, { mq: '1400px', columns: 5, gutter: 20 } ] : [ { columns: 2, gutter: 20 }, { mq: '768px', columns: 4, gutter: 20 }, { mq: '1024px', columns: 5, gutter: 20 }, { mq: '1402px', columns: 6, gutter: 20 } ];
    const sizesOpen   = [ { columns: 2, gutter: 20 }, { mq: '768px', columns: 2, gutter: 20 }, { mq: '1000px', columns: 3, gutter: 20 }, { mq: '1260px', columns: 4, gutter: 20 }, { mq: '1500px', columns: 5, gutter: 20 } ];
    const sizesClosed = [ { columns: 2, gutter: 20 }, { mq: '768px', columns: 4, gutter: 20 }, { mq: '1024px', columns: 5, gutter: 20 }, { mq: '1402px', columns: 5, gutter: 20 } ];
    const sizes = this.props.LeftDrawerOpen ? sizesOpen : sizesClosed
    return (
      <MasonryLayout
        id="MasonryItems"
        className="loading"
        infiniteScrollContainer="window"
        infiniteScrollLoading={this.state.isLoading}
        infiniteScroll={() => {this.getItems()}}
        infiniteScrollEnd={false}
        infiniteScrollEdge='bottom'
        infiniteScrollDistance={200}
        infiniteScrollDisabled={false}
        infiniteScrollSpinner={<div className="loading-img"><img src="/a/i/loading.gif" alt="Loading..." /></div>}
        infiniteScrollEndIndicator={<div>End of Results</div>}
        sizes={sizes}
        LeftDrawerOpen={this.props.LeftDrawerOpen}
      >
      { this.state.items.map((rig, i) => {
          let title = '';
          if (rig.hasOwnProperty("_highlightResult")) {
            title = rig._highlightResult.title.value
          } else {
            title = rig.title
          }
          title = {__html: title}

          return (
            <div
              key={i}
              className="rig-item"
            >
              {/* {rig.has_image && <div className="rig-image"><Link to={rigLink(rig, 'rig.type')}><img src={`https://instagram.com/p/${rig.instagram_shortcode}/media/?size=m`} alt={rig.title} /></Link></div>} */}

              <Link to={rigLink(rig, 'rig.type')} className="title">
                <span dangerouslySetInnerHTML={title} />
              </Link>

              {rig.hasOwnProperty("desc") && <p className="desc">{truncateText(stripHTML(marked(rig.desc, {renderer: markdownRenderer})), 120)}</p>}

              <ul className="components">
                {rig.components.map( (c, i) => (c.title && c.hasOwnProperty("type")) && <li onClick={(e) => {this.context.router.push(componentLink(c.componentId, c.type, c.title))}} key={i}>{c.title}</li> )}
              </ul>

              <div className="buttons">
                <ButtonGroup>
                  <Button
                    className="fork-rig-button"
                    bsStyle="default"
                    bsSize="small"
                    onClick={e => Actions.forkPublicRig(e, rig)}>
                    <i className="fa fa-code-fork"></i>
                    <span>Fork</span>
                  </Button>

                  {/* <Button
                    className="view-rig-button"
                    bsStyle="default"
                    bsSize="small"
                    onClick={e => window.location.href = rigLink(rig, 'rig.type')}>
                    <span>View</span>
                  </Button> */}
              </ButtonGroup>
              {/* <Link to={rigLink(rig, 'rig.type')}>
                View
              </Link> */}

              </div>
            </div>
          )
        })
      }
    </MasonryLayout>
    )
  }
}

ResultsForRigs.contextTypes = { router: PropTypes.object }
