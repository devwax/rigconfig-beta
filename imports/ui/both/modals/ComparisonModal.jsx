import React from 'react';
import {
  Button,
  Modal,
  FormControl,
  FormGroup,
  ControlLabel,
  ListGroup,
  ListGroupItem,
} from "react-bootstrap";
import { BrowserRouter as Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { GuestRigComponents } from '/imports/api/rig_components/guest_rig_components.js';
import AppState from '/imports/startup/both/AppState.js';
import Actions from '/imports/startup/both/Actions.js';
import AddToRigButton from "/imports/ui/both/components/Results/AddToRigButton.jsx";
import RemoveFromRigButton from "/imports/ui/both/components/Results/RemoveFromRigButton.jsx";
import InRigCount from "/imports/ui/both/components/Results/InRigCount.jsx";
// import { truncateText } from '/imports/ui/both/helpers';
// import { formatTitle } from '/imports/api/lib/formatTitle.js';

class ComparisonModal extends React.Component {
  constructor(...args) {
    super(...args);

    this._columns = []
    this._displayProperties = []
    this._componentComparisonList = this.props.componentComparisonList
    this._propertySuppressionList = [
      // "_id",
      "objectID",
      "created_at",
      "updated_at",
      "other",
      "_highlightResult",
      "title_custom"
    ]

    this.getProperties()
    this.createColumns()
    this.createRows()
  }

  createColumns = () => {
    this._columns = []
    this._componentComparisonList.map(c => {
      this._columns.push({ key: 'title', name: c.title, _id: c._id, type: c.type,  width: 200, component: c })
    })
  }

  createRows = () => {
    let rows = [];

    this._displayProperties.map(property => {
      this._componentComparisonList.map(c => {
        if (c.hasOwnProperty(property)) {
          const values = this.getPropertyValues(property) // array
          // console.log('values', values);
          rows.push({ property, values })
        }
      })
    })

    this._rows = rows;
  }

  getPropertyValues = property => {
    let values = []
    let inRig = false;
    this._componentComparisonList.map(c => {
      if (c.hasOwnProperty(property)) {
        values.push(c[property])
      }
    })
    return values
  }

  // this.props.componentsInRig && this.props.componentsInRig.map(component => {
  //   inRig = false
  //   if (component.componentId === c._id) {
  //     values.push({value: c[property], inrig: true})
  //   } else {
  //     values.push({value: c[property], inrig: false})
  //   }
  // })

  getProperties = () => {
    const objects = this._componentComparisonList
    let displayProperties = []

    // put all properties from all selected components, minus those in supressionList, into displayProperties array
    objects.map(o => {
      Object.getOwnPropertyNames(o).map(prop => (this._propertySuppressionList.indexOf(prop) === -1) && displayProperties.push(prop))
    })

    // dedupe / unique properties
    const displayPropertiesUnique = [...displayProperties.filter((v, i, a) => a.indexOf(v) === i)]

    this._displayProperties = displayPropertiesUnique
  }

  formatCell = data => {
    if (typeof data === 'string') {
      return data
    } else if (typeof data === 'number') {
      return data.toString()
    } else if (data.constructor === Array) {
      return data.join(", ");
    }
  }

  componentWillUpdate() {
    this.getProperties()
    this.createColumns()
    this.createRows()
  }

  componentWillReceiveProps(nextProps) {
    this._componentComparisonList = nextProps.componentComparisonList
    this.getProperties()
    this.createColumns()
    this.createRows()
  }

  render() {
    return (
      <Modal show={this.props.ComparisonModalOpen} onHide={Actions.closeAllModals} animation={false} className={"ComparisonModal " + ((this._componentComparisonList.length > 4) && "wide")}>
        <Modal.Header closeButton>
          <Modal.Title>
            <span className="title-text">Comparison Grid</span>
            { (this._componentComparisonList.length > 0) &&
              <Button className="compare-clear-all"
                bsSize="xsmall"
                onClick={ e => { e.preventDefault(); AppState.set({componentComparisonList: []}) } }>
                  <i className="fa fa-close"></i>
                  {" "}
                  <span>Clear All</span>
              </Button>
            }
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
            { (this._componentComparisonList.length > 0) &&
            <table>
              <tbody>
                <tr key={"column-header"} className="column-header">
                  <td className="property"></td>
                  { this._columns.map(c => {
                      return (
                        <td key={c.name}>
                          <a
                            href=""
                            onClick={e => {
                              e.preventDefault()
                              Actions.closeAllModals()
                              this.props.handleClearSearchState()
                              this.props.history.replace(
                                ('/c/' + c.type + '/' + c._id),
                                {}
                              )
                            }}
                          >{c.name}</a>
                        </td>
                      )
                    })
                  }
                </tr>

                <tr key={"column-add-remove"} className="column-add-remove">
                  <td className="column-add-remove-label">Add/Remove from Rig</td>
                  { this._columns.map(c => {
                    console.log('this._columns', this._columns);
                      let inRig = false;
                      let inRigCount = 0;
                      let matchedComponentId = '';

                      this.props.componentsInRig && this.props.componentsInRig.map(component => {
                        if (component.componentId === c._id) {
                          inRigCount++;
                          inRig = true;
                          matchedComponentId = component._id;
                        }
                      })

                      return (
                        <td key={c.name} className={"add-to-rig-cell " + (inRig ? "inRig" : "")}>
                          <AddToRigButton component={c.component} inRig={inRig} inRigCount={inRigCount} />
                          { (inRig && inRigCount > 0) &&
                            <span>
                              <RemoveFromRigButton componentId={matchedComponentId} />
                              <InRigCount count={inRigCount} />
                            </span>
                          }
                          <i
                            className="fa fa-close pull-right"
                            onClick={e => Actions.removeFromComparison(c._id)}
                          ></i>
                        </td>
                      )
                    })
                  }
                </tr>

                { this._displayProperties.map((property, i) => {
                    const rowData = this._rows.find(r => r.property === property)
                    return (
                      // <tr key={"row-data" + i} className={(inRig && "inRig")}>
                      <tr key={"row-data" + i}>
                        <td key={property}>{ property.split('_').join(" ").toUpperCase() }</td>
                        { rowData.values.map((cell, i) => (<td key={i}>{ this.formatCell(cell) }</td>))
                        }
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
            }

            { (this._componentComparisonList.length <= 0) && <h4 style={{fontStyle: 'italic', display: 'inline-block', textAlign: 'center', margin: '20px 0', color: 'gray'}}>No components selected to compare...</h4>}
        </Modal.Body>
      </Modal>
    )
  }
}

export default withTracker(({handleClearSearchState, history}) => {
  const componentsInRig = GuestRigComponents.find({rigId: AppState.get('currentRigId')}, {sort: {position: 1}}).fetch() || [];

  return {
    ComparisonModalOpen: AppState.get('ComparisonModalOpen'),
    componentComparisonList: AppState.get('componentComparisonList'),
    componentsInRig: componentsInRig
  }
})(ComparisonModal)
