import React from 'react';
import {
  Button,
  Modal,
  FormControl,
  FormGroup,
  ControlLabel,
  ListGroup,
  ListGroupItem,
  Table
} from "react-bootstrap";
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import AppState from '/imports/startup/both/AppState.js';
import Actions from '/imports/startup/both/Actions.js';
import { truncateText } from '/imports/ui/both/helpers';
import { formatTitle } from '/imports/api/lib/formatTitle.js';
import { GuestRigComponents } from '/imports/api/rig_components/guest_rig_components.js';
import AddToRigButton from "/imports/ui/both/components/Results/AddToRigButton.jsx";
import RemoveFromRigButton from "/imports/ui/both/components/Results/RemoveFromRigButton.jsx";
import InRigCount from "/imports/ui/both/components/Results/InRigCount.jsx";

const QuickViewModal = ({hit, inRig, inRigCount, matchedComponentId, QuickViewModalOpen}) => {
  if (!hit) return null;
  return (
    <Modal className="QuickViewModal" show={QuickViewModalOpen} onHide={Actions.closeAllModals} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>
          {/* <i className="fa fa-cog" aria-hidden="true"></i> */}
          <span>{hit.title}</span>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="component-links">
          <AddToRigButton component={hit} inRig={inRig} inRigCount={inRigCount} />

          { (inRig && inRigCount > 0) &&
            <span>
              <RemoveFromRigButton componentId={matchedComponentId} />
              <InRigCount count={inRigCount} />
            </span>
          }

          { hit.newegg_id &&
            <Button
              className="newegg-button"
              bsStyle="link"
              bsSize="small"
              href={`https://www.newegg.com/Product/Product.aspx?Item=${hit.newegg_id}`}
              target={hit.newegg_id}>
                <i className="fa fa-lemon-o" style={{marginRight: 5}}></i>
                <span>Newegg</span>
            </Button>}
          { hit.asin &&
            <Button
              className="amazon-button"
              bsStyle="link"
              bsSize="small"
              href={`https://www.amazon.com/dp/${hit.asin}`}
              target={hit.asin}>
                <i className="fa fa-amazon" style={{marginRight: 5}}></i>
                <span>Amazon</span>
            </Button>}

          <Button
            bsSize="small"
            className="button-link-style pull-right"
            bsStyle="link"
            href={`https://gitlab.com/rigconfig/ccdb/edit/master/src/json/${hit.type}/${hit.part_number}.json`}
            target={`_${hit.part_number}`}>
              <i className="fa fa-pencil"></i>
              <span>Edit</span>
          </Button>
        </div>

        <Table striped bordered condensed hover className="ComponentDetails">
          <tbody>
            <ComponentDataList data={hit} />
          </tbody>
        </Table>

      </Modal.Body>
    </Modal>
  )
}


const ComponentDataList = ({data}) => {
  let fields = [];
  // console.log(data);

  let publicFieldsList = []
  let sources = []

  const publicFields = {
   type: 1,
   mftr: 1
  }

  const propertySuppressionList = [
  	"_id",
    "objectID",
    "created_at",
    "updated_at",
    "other",
    "_highlightResult"
  ]

  const filtered_data = {...data}
  propertySuppressionList.map(prop => delete filtered_data[prop])

  for (var field in filtered_data) {
    // 1. Remove properties in suppression list
    // 2. Transform propery values (Array to comma delimited, etc)

    if (filtered_data.hasOwnProperty(field)) {
      if (field !== 'type' && field !== 'title' && field !== '_id' && field !== 'sources' && filtered_data[field]) {
        // Format array items into legible list (React concatenates them during render)
        if (filtered_data[field].constructor === Array) {
          if (filtered_data[field].length > 0) {
            filtered_data[field] = filtered_data[field].join(", ");
          } else {
            filtered_data[field] = undefined
          }
        }
        filtered_data[field] && publicFieldsList.push({name: field, value: data[field]})
      }

      if (field === 'sources') {
        const sources_obj = filtered_data['sources']
        for (var source in sources_obj) {
          const value = <a href={sources_obj[source]} dangerouslySetInnerHTML={{__html: sources_obj[source]}} target="_source"></a>
          sources.push({name: source, value: value})
        }
      }
    }
  }

  publicFieldsList.map(field => fields.push(<tr key={field.name} className="tableRow"><td className="label">{formatTitle(field.name)}</td><td className="value" dangerouslySetInnerHTML={{__html: field.value}}></td></tr>))
  sources && sources.map((field, id) => fields.push(<tr key={field+id} className="tableRow"><td className="label">{formatTitle(field.name)}</td><td className="value">{field.value}</td></tr>))

  return fields
}

export default withTracker(() => {
  const hit = AppState.get('hit');
  const components = GuestRigComponents.find({rigId: AppState.get('currentRigId')}, {sort: {position: 1}}).fetch() || [];

  let inRig = false;
  let inRigCount = 0;
  let matchedComponentId = '';

  hit && components.map(c => {
    if (c.componentId === hit._id) {
      inRigCount++;
      inRig = true;
      matchedComponentId = c._id;
    }
  });

  return {
    hit,
    components,
    inRig,
    inRigCount,
    matchedComponentId,
    QuickViewModalOpen: AppState.get('QuickViewModalOpen')
  }
})(QuickViewModal)
