import React from 'react';
import {
  Button,
  Modal,
  FormControl,
  FormGroup,
  ControlLabel,
  ListGroup,
  ListGroupItem,
  // Table
} from "react-bootstrap";
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import AppState from '/imports/startup/both/AppState.js';
import Actions from '/imports/startup/both/Actions.js';
// import { truncateText } from '/imports/ui/both/helpers';
// import { formatTitle } from '/imports/api/lib/formatTitle.js';

class ComparisonModal extends React.Component {
  constructor(...args) {
    super(...args);
    // console.log('ComparisonModal > constructor fired');
  }

  // componentWillUpdate() {
  //   console.log('ComparisonModal > updated');
  // }

  render() {
    return (
      <Modal show={this.props.ComparisonModalOpen} onHide={Actions.closeAllModals} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>
            {/* <i className="fa fa-cog" aria-hidden="true"></i> */}
            <span>Comparison Modal</span>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Button className="compare-clear-all"
            bsSize="xsmall"
            onClick={ e => { e.preventDefault(); AppState.set({componentComparisonList: []}) } }>
              <i className="fa fa-close"></i>
              {" "}
              <span>Clear All</span>
            </Button>
          {/* <h4>{this.props.hit.title}</h4> */}
          {/* <Table striped bordered condensed hover className="ComponentDetails"> */}
            {/* <tbody> */}
              {/* { hitData.map((field, id) => <tr key={id}><td className="label">{formatTitle(field.name)}</td><td dangerouslySetInnerHTML={{__html: field.value}}></td></tr>) } */}
              {/* <ComponentDataList data={this.props.hit} /> */}
              {/* { sources && sources.map((field, id) => <tr key={id}><td className="label">{formatTitle(field.name)}</td><td>{field.value}</td></tr>) } */}
            {/* </tbody> */}
          {/* </Table> */}
          <ul>
            { this.props.componentComparisonList.map(c => <li key={c._id}>{c.title}</li>) }
          </ul>

        </Modal.Body>
      </Modal>
    )
  }
}

export default withTracker(() => {
  return {
    ComparisonModalOpen: AppState.get('ComparisonModalOpen'),
    componentComparisonList: AppState.get('componentComparisonList')
  }
})(ComparisonModal)
