import { Meteor } from 'meteor/meteor';
import React from "react";
import { Link } from 'react-router-dom';
import { Button, Table } from "react-bootstrap";
import Helmet from 'react-helmet';
import AppConfig from '/imports/startup/both/AppConfig.js';
import { withTracker } from 'meteor/react-meteor-data';
import AppState from '/imports/startup/both/AppState.js';
import { componentLink } from '/imports/api/lib/componentLink.js';
import { PublicRigs } from '/imports/api/public_rigs/public_rigs.js';
import marked from 'marked'
import markdownRenderer from '/imports/api/lib/markdownRenderer.js'

function RigPage({rigData, notFound, loading}) {
  return (
    <section id="RigPage">
      { (!loading && !notFound) &&
        <div className="container">
          <Helmet
            title={rigData.title + ' @ ' + AppConfig.site.title}
          />

          <h1 className="page-title">{rigData.title}</h1>

          <div className="sub-header">
            <Button
              className="fork-rig-button"
              // bsStyle="danger"
              bsStyle="default"
              bsSize="small"
              onClick={e => Actions.forkPublicRig(e, rigData) }>
              <i className="fa fa-code-fork"></i>
              <span>Fork Rig</span>
            </Button>
          </div>

          <div className="components-section">
            <h2 className="section-title">Components <span>( {rigData.components.length} )</span></h2>
            { rigData.components.length > 0 &&
              <ul className="results-list-format">
                {rigData.components.map(c => {
                  return (
                    <li key={c._id}>
                      {/* { !c.hasOwnProperty("custom") ? <span>{c.type}: <Link to={componentLink(c.componentId, c.type, c.title)}>{c.title}</Link></span> : <span>{c.title + ' (custom)'}</span> } */}
                      { !c.hasOwnProperty("custom") ? <Link to={componentLink(c.componentId, c.type, c.title)}>{c.title}</Link> : <span>{c.title + ' (custom)'}</span> }
                      <Button
                        className="add-to-rig-button"
                        bsStyle="default"
                        bsSize="xsmall"
                        onClick={e => Actions.addToRig(c) }>
                        <i className="fa fa-plus"></i>
                        <span>Add to Rig</span>
                      </Button>
                      <div className="component-desc">
                        <span dangerouslySetInnerHTML={{__html: c.desc }} />
                      </div>
                    </li>)
                })}
              </ul>
            }
          </div>

          <div className="md-description">
            <h2 className="section-title">Description</h2>
            <span dangerouslySetInnerHTML={{__html: rigData.desc }} />
          </div>
        </div>
      }
      { notFound && <h2>Rig Not Found</h2> }
    </section>
  )
}

export default withTracker(({match}) => {
  let notFound = false
  const rigId = match.params.id.split('-').pop(); // e.g. /rig/title-of-rig-vYRLewcD6jLZsnJQv
  const rigDataHandle = Meteor.subscribe('singleRig', rigId)
  let loading = !rigDataHandle.ready()
  const rigData = PublicRigs.findOne()

  if (rigData && !loading) {
    if (rigData.hasOwnProperty("desc")) {
      rigData.desc = marked(rigData.desc, {renderer: markdownRenderer})
    }

    if (rigData.hasOwnProperty("components")) {
      rigData.components.map(c => c.hasOwnProperty("desc") ? c.desc = marked(c.desc, {renderer: markdownRenderer}) : '')
    }
  }

  return {
    rigData,
    loading,
    notFound: !rigData
  }
})(RigPage)
