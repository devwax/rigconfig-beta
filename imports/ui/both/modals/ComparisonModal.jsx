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
import ReactDataGrid from 'react-data-grid/dist/react-data-grid.min.js'; // https://github.com/adazzle/react-data-grid/issues/625#issuecomment-321362494
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import AppState from '/imports/startup/both/AppState.js';
import Actions from '/imports/startup/both/Actions.js';
// import { truncateText } from '/imports/ui/both/helpers';
// import { formatTitle } from '/imports/api/lib/formatTitle.js';

class ComparisonModal extends React.Component {
  constructor(...args) {
    super(...args);

    this._columns = []
    this.createRows();
    this.createColumns();

    // this._columns = [
    //   { key: 'id', name: 'ID' },
    //   { key: 'title', name: 'Title' },
    //   { key: 'count', name: 'Count' } ];

    // this.props.componentComparisonList.map(c => {
    //   this._columns.push({ key: 'title', name: 'Title' })
    // })

    // this.state = null;
  }

  /*
    - need to create first column w/ property names
    - lock first column
    - rest of columns have corresponding property values
    - horizontal scroll for more than 4 or 5
    - close / remove w/ X next to title or 'delete' button under it


  */

  createColumns = () => {
    this._columns = []
    // this.props.componentComparisonList.map(c => {
    //   this._columns.push({ key: 'title', name: 'Title', width: 200 })
    // })
    this._columns.push({ key: 'property_name', name: 'Property Name', width: 200 })
    this.props.componentComparisonList.map(c => {
      this._columns.push({ key: 'title', name: c.title, width: 200 })
    })
    console.log('this.props.componentComparisonList', this.props.componentComparisonList);
  }

  createRows = () => {
    let rows = [];
    rows.push({ properties: 'Properties' })
    this.props.componentComparisonList.map(c => {
      rows.push({ title: c.title + 'lksajd aslkdj aslkdj aslkdsl sadlkj asdllsakjdlkasdj alsdkj lsdkj' })
    })

    this._rows = rows;
  }

  rowGetter = (i) => {
    return this._rows[i];
  }

  componentWillUpdate() {
    this.createRows();
    this.createColumns();
    // this.props.componentComparisonList.map(c => {
    //   this._columns.push({ key: 'title', name: 'Title' })
    // })
  }

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
          {/* <ReactDataGrid /> */}

          { (this.props.componentComparisonList.length > 0) &&
            <ReactDataGrid
              columns={this._columns}
              rowGetter={this.rowGetter}
              rowsCount={this._rows.length}
              minHeight={500} />
          }

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
