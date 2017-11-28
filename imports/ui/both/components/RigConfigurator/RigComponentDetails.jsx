import { Meteor } from 'meteor/meteor';
import React from 'react';
import {
  Panel,
  ListGroup,
  ListGroupItem
} from 'react-bootstrap';
import { formatTitle } from '/imports/api/lib/formatTitle.js';

export default class RigComponentDetails extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
    }
  }

  render() {
    return (
      <Panel
        className="RigComponentDetails"
        collapsible
        defaultExpanded={false}
        expanded={this.state.open}
        onClick={ (e) => { e.preventDefault(); this.setState({ open: !this.state.open }) }}
        header="Specs"
      >
        <ListGroup fill onClick={ (e) => { e.stopPropagation(); }}>

        { this.props.details &&
          <ListGroupItem>
            { this.props.details.map((detail, i) => <ListGroupItem key={i} header={formatTitle(detail.name)}>{detail.value}</ListGroupItem>) }
          </ListGroupItem>
        }

        </ListGroup>
      </Panel>
    )
  }
}
