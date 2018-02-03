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
import AppState from '/imports/startup/both/AppState.js';
import Actions from '/imports/startup/both/Actions.js';
// import { truncateText } from '/imports/ui/both/helpers';
// import { formatTitle } from '/imports/api/lib/formatTitle.js';

class ComparisonModal extends React.Component {
  constructor(...args) {
    super(...args);

    this._columns = []
    this._displayProperties = []
    this._propertySuppressionList = [
      "_id",
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
    this.props.componentComparisonList.map(c => {
      this._columns.push({ key: 'title', name: c.title, _id: c._id, type: c.type,  width: 200 })
    })
  }

  createRows = () => {
    let rows = [];

    this._displayProperties.map(property => {
      this.props.componentComparisonList.map(c => {
        if (c.hasOwnProperty(property)) {
          const values = this.getPropertyValues(property) // array
          rows.push({ property, values })
        }
      })
    })

    this._rows = rows;
  }

  getPropertyValues = property => {
    let values = []
    this.props.componentComparisonList.map(c => {
      if (c.hasOwnProperty(property)) {
        values.push(c[property])
      }
    })
    return values
  }

  getProperties = () => {
    const objects = this.props.componentComparisonList
    let displayProperties = []

    // put all properties from all selected components, minus those in supressionList, into displayProperties array
    objects.map(o => {
      Object.getOwnPropertyNames(o).map(prop => (this._propertySuppressionList.indexOf(prop) === -1) && displayProperties.push(prop))
    })

    // dedupe / unique properties
    const displayPropertiesUnique = [...displayProperties.filter((v, i, a) => a.indexOf(v) === i)]

    // supression list (if declared)
    // prioritize list (if declared)
    // return list as array or set instance variable "componentProperties"

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

  render() {
    return (
      <Modal show={this.props.ComparisonModalOpen} onHide={Actions.closeAllModals} animation={false} className="ComparisonModal">
        <Modal.Header closeButton>
          <Modal.Title>
            { (this.props.componentComparisonList.length > 0) ?
              <Button className="compare-clear-all"
                bsSize="xsmall"
                onClick={ e => { e.preventDefault(); AppState.set({componentComparisonList: []}) } }>
                  <i className="fa fa-close"></i>
                  {" "}
                  <span>Clear All</span>
              </Button>
              :
              <span>No components selected to compare...</span>
            }
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
            { (this.props.componentComparisonList.length > 0) &&
            <table>
              <tbody>
                <tr className="column-header">
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

                { this._displayProperties.map(property => {
                    const rowData = this._rows.find(r => r.property === property)
                    return (
                      <tr>
                        <td>{ property.split('_').join(" ").toUpperCase() }</td>
                        { rowData.values.map(cell => <td>{ this.formatCell(cell) }</td>)}
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
            }
        </Modal.Body>
      </Modal>
    )
  }
}

export default withTracker(({handleClearSearchState, history}) => {
  return {
    ComparisonModalOpen: AppState.get('ComparisonModalOpen'),
    componentComparisonList: AppState.get('componentComparisonList')
  }
})(ComparisonModal)
