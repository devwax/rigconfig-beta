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

class QuickViewModal extends React.Component {
  constructor(...args) {
    super(...args);
    // this.state = {
    // }
  }

  render() {
    // const { props } = this
    if (!this.props.hit) {
      return null;
    }

/*
    let hitData = []
    // let testData = [1,2,3,4,5]

    // console.log('before');
    for (var field in this.props.hit) {
      // if (props.hit.hasOwnProperty(field)) {
        hitData[field] = this.props.hit[field]
        // console.log('field, hitData[field], props.hit[field]', field, hitData[field], props.hit[field]);
        hitData.map(c => console.log('c:', c))
        // console.log('during');
        // hitData.map(function (c) {
        //   return console.log('c:', hitData)
        // })
      // }
    }
    // console.log('after', hitData.length);
    // console.log('hitData', hitData);
    // console.log('typeof hitData', typeof hitData);

    // hitData.map((v, i) => {
    //   console.log('TESTTTTTT!');
    // })

    // testData.map((v, i) => {
    //   console.log(v, i);
    //
    // })
*/
    const { hit, inRig, inRigCount, matchedComponentId } = this.props
    // console.log('QuikView: hit', hit);
    return (
      <Modal className="QuickViewModal" show={this.props.QuickViewModalOpen} onHide={Actions.closeAllModals} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>
            {/* <i className="fa fa-cog" aria-hidden="true"></i> */}
            <span>{hit.title}</span>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="component-links">
            {/* <Button
              className="add-to-rig-button"
              bsStyle="default"
              bsSize="small"
              onClick={e => Actions.addToRig(hit) }>
                <i className="fa fa-plus" style={{marginRight: 5}}></i>
                <span>Add to Rig</span>
            </Button> */}

            <AddToRigButton component={hit} inRig={inRig} inRigCount={inRigCount} />
            { (inRig && inRigCount > 0) &&
              <span>
                <RemoveFromRigButton componentId={matchedComponentId} />
                {/* <Button className="minus" style={{marginLeft: 5}} bsSize="xsmall" onClick={ e => {e.preventDefault(); Actions.deleteFromRig(matchedComponentId);} }><i className="fa fa-minus"></i></Button> */}
                {/* <span className="count">{'(x'+inRigCount+')'}</span> */}
                <InRigCount count={inRigCount} />
              </span>
            }

            {hit.newegg_id &&
              <Button
                className="newegg-button"
                bsStyle="link"
                bsSize="small"
                href={`https://www.newegg.com/Product/Product.aspx?Item=${hit.newegg_id}`}
                target={hit.newegg_id}>
                  <i className="fa fa-lemon-o" style={{marginRight: 5}}></i>
                  <span>Newegg</span>
            </Button>}
            {hit.asin &&
              <Button
                className="amazon-button"
                bsStyle="link"
                bsSize="small"
                href={`https://www.amazon.com/dp/${hit.asin}`}
                target={hit.asin}>
                  <i className="fa fa-amazon" style={{marginRight: 5}}></i>
                  <span>Amazon</span>
            </Button>}
            {/* &nbsp; <a href={`https://www.newegg.com/Product/Product.aspx?Item=${hit.newegg_id}`}>Newegg</a> | <a href={`https://www.amazon.com/dp/${hit.asin}`}>Amazon</a> */}
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
}

// export default withTracker(() => {
//   return {
//     GuestUserData: Meteor.isClient ? GuestUser.findOne() : {}
//   }
// })(QuickViewModal)

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

  // const
  // 1. clone data variable
  // 2. and then use that in propertySuppressionList and for..in loop below
  // propertySuppressionList.map(prop => delete data[prop])
  const filtered_data = {...data}
  propertySuppressionList.map(prop => delete filtered_data[prop])

  for (var field in filtered_data) {
    // 1. Remove properties in supperssion list
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
          // const value = () => {return (<a href={${sources_obj[source]}} dangerouslySetInnerHTML={${sources_obj[source]}></a>)}
          // const value = <a href={sources_obj[source]} dangerouslySetInnerHTML={{__html: sources_obj[source]}} target="_source"></a>
          const value = <a href={sources_obj[source]} dangerouslySetInnerHTML={{__html: sources_obj[source]}} target="_source"></a>
          sources.push({name: source, value: value})
          // sources.push({name: source, value: sources_obj[source]})
        }
      }
    }
  }

  publicFieldsList.map(field => fields.push(<tr key={field.name} className="tableRow"><td className="label">{formatTitle(field.name)}</td><td className="value" dangerouslySetInnerHTML={{__html: field.value}}></td></tr>))
  sources && sources.map((field, id) => fields.push(<tr key={field+id} className="tableRow"><td className="label">{formatTitle(field.name)}</td><td className="value">{field.value}</td></tr>))

  return fields
}

// export default QuickViewModal
export default withTracker(() => {
  const hit = AppState.get('hit');
  const components = GuestRigComponents.find({rigId: AppState.get('currentRigId')}, {sort: {position: 1}}).fetch() || [];

  let inRig = false;
  let inRigCount = 0;
  let matchedComponentId = '';
  // console.log('hit', hit);
  hit && components.map(c => {
    if (c.componentId === hit._id) {
      inRigCount++;
      inRig = true;
      matchedComponentId = c._id;
    }
  });

  // console.log('components', components);
  // console.log('inRig', inRig);
  // console.log('inRigCount', inRigCount);
  // console.log('matchedComponentId', matchedComponentId);
  // console.log('hit', hit);
  return {
    // hit: AppState.get('hit'),
    hit,
    components,
    inRig,
    inRigCount,
    matchedComponentId
  }
})(QuickViewModal)
