import { Meteor } from 'meteor/meteor';
import React from 'react';
import {
  Panel,
  ListGroup,
  ListGroupItem,
  OverlayTrigger,
  ButtonToolbar,
  Button,
  Tooltip
} from 'react-bootstrap';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import RigComponentDetails from '/imports/ui/both/components/RigConfigurator/RigComponentDetails.jsx'
import { $ } from 'meteor/jquery'
import classnames from 'classnames';
import AppState from '/imports/startup/both/AppState.js'
import Actions from '/imports/startup/both/Actions.js';
import { GuestRigComponents } from '/imports/api/rig_components/guest_rig_components.js';
import { truncateText } from '/imports/ui/both/helpers';
import { formatTitle } from '/imports/api/lib/formatTitle.js';
import { componentLink } from '/imports/api/lib/componentLink.js';
import marked from 'marked'
import markdownRenderer from '/imports/api/lib/markdownRenderer.js'

// export default class RigComponent extends React.Component {
class RigComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      editingDesc: false,
      expandedDesc: false,
      descLength: 0,
    };
  }

  componentDidMount() {
    const descLength = this.props.component.desc ? parseInt(this.props.component.desc.length) : 0
    this.setState({ descLength })
  }

  _handleEscKey(e) {
    // console.log('e.keyCode', e.keyCode);
    if(e.keyCode == 27 || e.keyCode == 13){ // 27 = [esc] key, 13 = [enter]
      $('.editing').removeClass('editing')
      $(e.target).blur()
    }
  }

  editComponentTitle(e, componentId) {
    const title = e.target.value
    const rigId = AppState.get('currentRigId')
    GuestRigComponents.update({ _id: componentId, rigId },  { $set: { title } })
  }

  editComponentLink(e, componentId) {
    const link = e.target.value
    const rigId = AppState.get('currentRigId')
    GuestRigComponents.update({ _id: componentId, rigId },  { $set: { link } })
  }

  editComponentPrice(e, componentId) {
    // e.g. "$34.95 + 8.99 S/H + 1.79 Tax"
    const price = e.target.value
    let priceNumeric = 0.00
    let priceNumericTotal = 0.00
    let priceValues = []

    if (!(price.indexOf('+') === -1)) {
      priceValues = price.split('+').forEach((v, i) => {

        priceNumeric = parseFloat( v.replace(/[^\d.-]/g, '') )

        // If this value is a number (and is truthy), then add it, otherwise skip it.
        if (priceNumeric && !isNaN(priceNumeric)) {
          priceNumericTotal += parseFloat( priceNumeric )
        }
      })
    } else {
      priceNumeric = parseFloat( price.replace(/[^\d.-]/g, '') )
      priceNumeric = parseFloat( (priceNumeric).toFixed(2) )
      priceNumericTotal += parseFloat( priceNumeric )
    }

    priceNumeric = priceNumericTotal

    const rigId = AppState.get('currentRigId')
    GuestRigComponents.update({ _id: componentId, rigId },  { $set: { price, priceNumeric } })
  }

  editComponentDesc(e, componentId) {
    const desc = e.target.value
    const rigId = AppState.get('currentRigId')
    GuestRigComponents.update({ _id: componentId, rigId },  { $set: { desc } })
  }

  deleteFromRig(e) {
    e.preventDefault()
    const rigComponentId = this.props.component._id
    Actions.deleteFromRig(rigComponentId)
  }

  render() {
    const { component } = this.props
    const title = component.title
    const truncatedTitle = truncateText(title, 60)

    const panelClasses = classnames({
      "rig-component":    true,
      "custom-component": component.custom,
    })

    const componentDescContentClasses = classnames({
      "componentDescContent": true,
      "expanded": this.state.expandedDesc,
      "editing": this.state.editingDesc
    })

    const delayTime     = 1700
    const delayHideTime = 100

    const tooltipDeleteComponent = (
      <Tooltip id="tooltip">Delete component.</Tooltip>
    )

    const tooltipIsCustomComponent = (
      <Tooltip id="tooltip">This is a custom component that either you or someone else has added to this rig or the rig that it was forked from.</Tooltip>
    )

    const details = (component && component.hasOwnProperty("details")) ? component.details : null

    return (
      <Panel
        className={panelClasses}
        collapsible
        defaultExpanded={false}
        expanded={this.state.open}
        onClick={ (e) => { e.preventDefault(); this.setState({ open: !this.state.open }) }}
        header={truncatedTitle ? truncatedTitle : "Untitled Component"}
        data-untitled={truncatedTitle ? false : true}
        data-rig-component-id={component._id}
        data-position={component.position}
      >
        <ListGroup fill onClick={ (e) => { e.stopPropagation(); }}>

          <ListGroupItem>
            {/* <b className="fieldLabel">Title:</b> */}
            <input
              type="text"
              className="componentTitle editable"
              defaultValue={component.title}
              placeholder="e.g. Raspberry Pi 3 Model B Motherboard"
              onChange={ (e) => { this.editComponentTitle(e, component._id) } }
              onFocus={ (e) => {
                  $(e.target).addClass('editing')
                  document.addEventListener("keydown", this._handleEscKey, false)
                }
              }
              onBlur={ (e) => {
                  $(e.target).removeClass('editing')
                  document.removeEventListener("keydown", this._handleEscKey, false)
                }
              }
            />
            {/* <span className="static-text">{component.title}</span> */}
          </ListGroupItem>

          <ListGroupItem>
            {/*<b className="fieldLabel">Link:</b>*/}
              <span>
                <input
                  type="text"
                  className="componentLink editable"
                  defaultValue={component.link}
                  placeholder="http://"
                  onChange={ (e) => { this.editComponentLink(e, component._id) } }
                  onFocus={ (e) => {
                      $(e.target).addClass('editing')
                      document.addEventListener("keydown", this._handleEscKey, false)
                    }
                  }
                  onBlur={ (e) => {
                      $(e.target).removeClass('editing')
                      document.removeEventListener("keydown", this._handleEscKey, false)
                    }
                  }
                />
                { component.link ?
                  <a href={component.link} target="_blank"><i className="fa fa-external-link"></i></a>
                  :
                  <i className={ component.link ? 'fa fa-external-link' : 'fa fa-external-link disabled' }></i>
                }
              </span>
          </ListGroupItem>

          <ListGroupItem>
            {/* <b className="fieldLabel">Price:</b> */}
            <input
              type="text"
              className="componentPrice editable"
              defaultValue={component.price}
              placeholder='e.g. "$34.95 + 8.99 S/H + 1.79 Tax"'
              onChange={ (e) => { this.editComponentPrice(e, component._id) } }
              onFocus={ (e) => {
                  $(e.target).addClass('editing')
                  document.addEventListener("keydown", this._handleEscKey, false)
                }
              }
              onBlur={ (e) => {
                  $(e.target).removeClass('editing')
                  document.removeEventListener("keydown", this._handleEscKey, false)
                }
              }
            />
          </ListGroupItem>

          { details &&
            <ListGroupItem className="ListGroupItem_RigComponentDetails">
              <RigComponentDetails component={component} details={details} />
            </ListGroupItem>
          }

          <ListGroupItem>
            <b className="fieldLabel">Description / Notes:</b>

            <textarea
              className={this.state.editingDesc ? 'componentDesc editing' : 'componentDesc' }
              defaultValue={component.desc}
              placeholder='Description and notes. e.g. This component is a *super* **yenius**. **Markdown enabled**'
              onChange={ (e) => { this.editComponentDesc(e, component._id) } }
              onBlur={ (e) => {
                  const descLength = this.props.component.desc ? parseInt(this.props.component.desc.length) : 0
                  this.setState({ descLength })
                }
              }
            />

            <div>
              <div
                className={componentDescContentClasses}
                dangerouslySetInnerHTML={{__html: (component.desc ? marked(component.desc, {renderer: markdownRenderer}) : '') }}>
              </div>

              { this.state.descLength > 200 && !this.state.editingDesc ?
                <Button
                  className="expandDescButton"
                  bsSize="xsmall"
                  block
                  onClick={(e) => {
                    this.setState({expandedDesc: !this.state.expandedDesc})
                  }
                }>
                  { this.state.expandedDesc ? <i className="fa fa-caret-up"></i> : <i className="fa fa-caret-down"></i> }
                </Button>
                : null }
            </div>

            <div>
              <Button
                className={this.state.editingDesc ? 'editDescButton editing' : 'editDescButton' }
                bsSize="small"
                onClick={(e) => {
                  this.setState({editingDesc: true})
                }
              }>
                Edit <i className="fa fa-pencil"></i>
              </Button>
              <Button
                className={this.state.editingDesc ? 'doneEditingDescButton editing' : 'doneEditingDescButton' }
                bsSize="small"
                bsStyle="primary"
                onClick={(e) => {
                  this.setState({editingDesc: false})
                }
              }>
                Done
              </Button>
              { this.state.editingDesc && <p className="light-text-saved">Auto-saved + Markdown enabled</p> }
            </div>
          </ListGroupItem>

          <ListGroupItem className="component-tools-container">
            <ButtonToolbar className="component-tools">
              <OverlayTrigger placement="left" overlay={tooltipDeleteComponent} delay={delayTime} delayHide={delayHideTime}>
                <Button bsSize="xsmall" onClick={ this.deleteFromRig.bind(this) }>
                  <i className="fa fa-trash"></i>
                  {/*<p>@todo - Confirm delete?</p>*/}
                </Button>
              </OverlayTrigger>
              { component.custom &&
                <OverlayTrigger placement="top" overlay={tooltipIsCustomComponent} delay={delayTime} delayHide={delayHideTime}>
                  <Button bsSize="xsmall" className="custom-component-user-icon">
                    <i className="fa fa-user"></i>
                  </Button>
                </OverlayTrigger>
              }
              { !component.custom &&
                <Button bsSize="xsmall" className="button-link-style" bsStyle="link" href={componentLink(component.componentId, component.type, component.title)}>
                  <i className="fa fa-link"></i>
                </Button>
              }
            </ButtonToolbar>
          </ListGroupItem>
        </ListGroup>
      </Panel>
    )
  }
}

export default SortableElement(RigComponent);
