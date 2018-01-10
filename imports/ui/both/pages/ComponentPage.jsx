import { Meteor } from 'meteor/meteor';
import React from "react";
import { Button } from "react-bootstrap";
import { Link } from 'react-router-dom';
import Helmet from 'react-helmet';
import AppConfig from '/imports/startup/both/AppConfig.js';
import { withTracker } from 'meteor/react-meteor-data';
import AppState from '/imports/startup/both/AppState.js';
import Actions from '/imports/startup/both/Actions.js';
import { ComponentTypesList, ComponentCollectionNames } from '/imports/api/lib/ComponentTypes.js';
import { ComponentDetails } from '/imports/ui/both/components/ComponentPage/ComponentDetails.jsx'
import { cpus } from '/imports/api/official_components/cpus/cpus.js';
import { motherboards } from '/imports/api/official_components/motherboards/motherboards.js';
import { video_cards } from '/imports/api/official_components/video_cards/video_cards.js';
import { cases } from '/imports/api/official_components/cases/cases.js';
import { cpu_fans } from '/imports/api/official_components/cpu_fans/cpu_fans.js';
import { memory } from '/imports/api/official_components/memory/memory.js';
import { psus } from '/imports/api/official_components/psus/psus.js';
import { ssds } from '/imports/api/official_components/ssds/ssds.js';

function ComponentPage({componentData, publicFields, notFound, loading}) {
  let newegg_id = componentData && componentData.hasOwnProperty("newegg_id") && componentData.newegg_id
  let asin = componentData && componentData.hasOwnProperty("asin") && componentData.asin
  return (
    <section className="page ComponentPage">
      { !loading &&
        <div className="content">
          <Helmet
            title={notFound ? 'Component Not Found' : componentData.title + ' @ ' + AppConfig.site.title }
          />
          { notFound ?
            <h2>Component Not Found</h2>
          :
            <div>
              <h2>{componentData.title}</h2>
              <p>
                <Button
                  className="add-to-rig-button"
                  bsStyle="default"
                  bsSize="small"
                  onClick={e => Actions.addToRig(componentData) }>
                  <i className="fa fa-plus" style={{marginRight: 5}}></i>
                  <span>Add to Rig</span>
                </Button>
                {newegg_id && <Button
                  className="newegg-button"
                  bsStyle="link"
                  bsSize="small"
                  href={`https://www.newegg.com/Product/Product.aspx?Item=${newegg_id}`}
                  >
                  <i className="fa fa-lemon-o" style={{marginRight: 5}}></i>
                  <span>Newegg</span>
                </Button>}
                {asin && <Button
                  className="amazon-button"
                  bsStyle="link"
                  bsSize="small"
                  href={`https://www.amazon.com/dp/${asin}`}
                  target={asin}
                  >
                  <i className="fa fa-amazon" style={{marginRight: 5}}></i>
                  <span>Amazon</span>
                </Button>}
                {/* &nbsp; <a href={`https://www.newegg.com/Product/Product.aspx?Item=${newegg_id}`}>Newegg</a> | <a href={`https://www.amazon.com/dp/${asin}`}>Amazon</a> */}
              </p>
              <ComponentDetails data={componentData} publicFields={publicFields} />
              {/* <a href={`https://gitlab.com/rigconfig/ccdb/edit/master/src/json/${componentData.type}/${componentData.part_number}.json`} target={`_${componentData.part_number}`}>Edit</a> */}
              <Button
                bsSize="small"
                className="button-link-style"
                bsStyle="link"
                href={`https://gitlab.com/rigconfig/ccdb/edit/master/src/json/${componentData.type}/${componentData.part_number}.json`}
                target={`_${componentData.part_number}`}
              >
                <i className="fa fa-pencil"></i>
                <span>&nbsp; Edit</span>
              </Button>
            </div>
          }
        </div>
      }
    </section>
  )
}

export default withTracker(({match}) => {
  let Collection
  let componentDataHandle
  let componentData
  let notFound = false
  let ComponentType = ComponentTypesList.filter(c => c.collectionName.toLowerCase() === match.params.type.toLowerCase())[0]
  let publicFields = {}

  ComponentType && ComponentType.hasOwnProperty('collectionName')
    ? ComponentType = ComponentType.collectionName
    : notFound = true

  if ( !notFound && ComponentCollectionNames.indexOf(ComponentType) !== -1) {
    Collection = eval(ComponentType)
    const componentId = match.params.id.split('-').pop() // e.g. /c/cpus/title-of-component-yqdJqLLhWM6TCzpyR
    componentDataHandle = Meteor.subscribe('singleComponent', ComponentType, componentId)
    componentData = Collection.findOne()
    publicFields = Collection.publicFields
  } else {
    notFound = true
    componentData = {}
  }

  return {
    componentData,
    publicFields,
    notFound,
    loading: !componentDataHandle.ready()
  }
})(ComponentPage)
