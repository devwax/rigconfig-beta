import { Meteor } from 'meteor/meteor';
import React from 'react';
import {
  ButtonToolbar,
  Button,
  FormGroup,
  ControlLabel,
  FormControl,
  HelpBlock,
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap';
import { $ } from 'meteor/jquery';
import AppState from '/imports/startup/both/AppState.js';
import Actions from '/imports/startup/both/Actions.js';
import classnames from 'classnames';
import { GuestUser } from '/imports/api/user/guest_user.js';
import { GuestRigs } from '/imports/api/rigs/guest_rigs.js';
import { GuestRigComponents } from '/imports/api/rig_components/guest_rig_components.js';
import { insertPublicRig, makePublicRigPrivate } from '/imports/api/public_rigs/methods.js'
// import Sharer from 'sharer.npm.js';
import ImportRig from './ImportRig.jsx';

export default class RigToolbar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      confirmDeleteRigVisible: false,
      editRigVisible: false,
      rigTitle: props.rig.title,
      rigTitleValidationMsg: '',
      rigDesc: props.rig.desc,
      rigDescValidationMsg: '',
      forkRigVisible: false,
      shareRigVisible: false,
    }
  }

  getValidationRigTitleState() {
    const length = this.state.rigTitle.length;
    if (length >= 250) return 'error'
  }

  getValidationRigDescState() {
    let length = 0;
    const { rigDesc } = this.state

    if (rigDesc && rigDesc.hasOwnProperty("length")) {
      length = rigDesc.length
    }

    if (length >= 3000) return 'error'
  }

  createNewBlankRig(e) {
    e.preventDefault()
    this.closeAllTools();
    Actions.createNewBlankRig(e)
    $(e.target).closest('button').blur()
  }

  toggleDelete(e) {
    e.preventDefault()
    this.closeAllTools()
    this.setState({confirmDeleteRigVisible: !this.state.confirmDeleteRigVisible})
    $(e.target).closest('button').blur()
  }

  toggleEditRig(e) {
    e.preventDefault()
    this.closeAllTools()
    this.setState({editRigVisible: !this.state.editRigVisible})
    $(e.target).closest('button').blur()
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.rig.title !== this.props.rig.title) {
      this.setState({rigTitle: nextProps.rig.title})
    }

    if (nextProps.rig.desc !== this.props.rig.desc) {
      this.setState({rigDesc: nextProps.rig.desc})
    }
  }

  handleEditRigTitle(e) {
    if (e.target.value.length > 250) {
      this.setState({rigTitleValidationMsg: 'Title is more than 250 characters.'})
      return
    } else {
      if (this.state.rigTitleValidationMsg.length > 0) {
        this.setState({rigTitleValidationMsg: ''})
      }
      this.setState({rigTitle: e.target.value})
      Actions.updateRigTitle(e.target.value)
    }
  }

  toggleShareRig(e) {
    e.preventDefault()
    this.closeAllTools()
    this.setState({shareRigVisible: !this.state.shareRigVisible})
    $(e.target).closest('button').blur()
  }

/*
  shareRig(e) {
    e.preventDefault()
    console.log('e.target', e.target);
    const sharer = new Sharer(e.target)
    sharer.share()
  }
*/

  handleEditRigDesc(e) {
    if (e.target.value.length > 3000) {
      this.setState({rigDescValidationMsg: 'Description is more than 3000 characters.'})
      return
    } else {
      if (this.state.rigDescValidationMsg.length > 0) {
        this.setState({rigDescValidationMsg: ''})
      }
      this.setState({rigDesc: e.target.value})
      Actions.updateRigDesc(e.target.value)
    }
  }

  toggleForkRig(e) {
    this.closeAllTools()
    this.setState({ forkRigVisible: !this.state.forkRigVisible })
    $(e.target).closest('button').blur()
  }

  closeAllTools() {
    this.setState({
      editRigVisible: false,
      confirmDeleteRigVisible: false,
      forkRigVisible: false,
      shareRigVisible: false
    })
  }

  makeRigPublic() {
    /**
      @todo - validation:
          - If the user is not logged in then maximum filtering occurs (text only, links removed, social media embedds allowed from select services).
          - If logged in, make sure they have proper privileges then filter accordingly.
      @todo - Username 'Anonymous' unless specified.
    */
    const user = GuestUser.findOne()
    const rigId = this.props.rig._id
    const publicRig = GuestRigs.findOne(rigId)

    publicRig.owner = user._id
    publicRig.pk = user.pk
    publicRig.rigId = rigId
    publicRig.username = user.username
    // publicRig.components = GuestRigComponents.find({rigId}).fetch().map(c => c._id)
    publicRig.components = GuestRigComponents.find({rigId}).fetch().map(c => c)
    publicRig.components.map((c) => { delete c.details })

/*
    // testing / troubleshooting
    publicRig.components = GuestRigComponents.find({rigId}).fetch().map((c, i) => {
      c.priceNumeric = 44.44
      // if (i === 1) {
      //   return c
      // }
      return c
    })
*/

    publicRig.public = true

    delete publicRig._id
    delete publicRig.lastSelected
    delete publicRig.createdAt
    delete publicRig.publishedAt
    delete publicRig.updatedAt
    // delete publicRig.details

    /**
      SimpleSchema fix
      Couldn't get SimpleSchema to accept a blank 'publicRig.desc' property, so
      I'm manually checking for blank desc and adding a space to get it to pass validation.
      See: https://github.com/aldeed/meteor-simple-schema/issues/64
      (tried this, just got rejected w/ vlidation error again)
    */
    // console.log('publicRig', publicRig);
    insertPublicRig.call(publicRig, (e, r) => {
      if (r) {
        GuestRigs.update(rigId, {$set: {public: true}})
        console.log('insertPublicRig > success response:', r);
      } else if (e) {
        console.log('insertPublicRig > error:', e);
      }
    })
  }

  displayPublicLink() {
    const rigId = AppState.get('currentRigId')
    const { currentPublicRig } = this.props
    const slug = currentPublicRig.slug ? currentPublicRig.slug + '-' : ''
    let { protocol, hostname, port } = window.location
    port = port ? ':' + port : '' // add colon after port number if port is defined
    return protocol + '//' + hostname + port + '/rig/' + slug + rigId
  }

  makeRigPrivate() {
    console.log('makeRigPrivate');
    const pk = AppState.get('pk')
    const rigId = this.props.rig._id
    const opts = {
      pk,
      rigId
    }
    GuestRigs.update(rigId, {$set: {public: false}})
    makePublicRigPrivate.call(opts, (e, r) => {
      if (r) {
        GuestRigs.update(rigId, {$set: {public: false}})
        console.log('makePublicRigPrivate > success response:', r);
      } else if (e) {
        console.log('makePublicRigPrivate > error:', e);
      }
    })
  }

  selectAllText(e) {
    $(e.target).select()
  }

  render() {
    const { rig, GuestUserData } = this.props

    const RigToolbarToolOpen = classnames({
      open: this.state.editRigVisible || this.state.confirmDeleteRigVisible || this.state.forkRigVisible || this.state.shareRigVisible
    })
    const editRigOpen = classnames({
      open: this.state.editRigVisible
    })
    const confirmDeleteOpen = classnames({
      open: this.state.confirmDeleteRigVisible
    })
    const forkRigOpen = classnames({
      open: this.state.forkRigVisible
    })
    const shareRigOpen = classnames({
      open: this.state.shareRigVisible
    })

    const delayTime     = 1700
    const delayHideTime = 100

    const tooltipCreate = (
      <Tooltip id="tooltip">Create new blank rig.</Tooltip>
    )

    const tooltipFork = (
      <Tooltip id="tooltip">Fork / duplicate this rig.</Tooltip>
    )

    const tooltipEditRig = (
      <Tooltip id="tooltip">Edit rig.</Tooltip>
    )

    const tooltipShareRig = (
      <Tooltip id="tooltip">Share rig.</Tooltip>
    )

    const tooltipDeleteRig = (
      <Tooltip id="tooltip">Delete rig.</Tooltip>
    )

    return (
      <span>
        <ButtonToolbar id="RigToolbar">
          <OverlayTrigger placement="left" overlay={tooltipCreate} delay={delayTime} delayHide={delayHideTime}>
            <Button bsSize="small" onClick={(e) => { this.createNewBlankRig(e) }}>
              <i className="fa fa-plus"></i>
            </Button>
          </OverlayTrigger>

          <OverlayTrigger placement="bottom" overlay={tooltipFork} delay={delayTime} delayHide={delayHideTime} >
            <Button bsSize="small" className={forkRigOpen} onClick={(e) => { this.toggleForkRig(e) }}>
              <i className="fa fa-code-fork"></i>
            </Button>
          </OverlayTrigger>

          <OverlayTrigger placement="bottom" overlay={tooltipEditRig} delay={delayTime} delayHide={delayHideTime}>
            <Button bsSize="small" className={editRigOpen} onClick={(e) => { this.toggleEditRig(e) }}>
              <i className="fa fa-pencil"></i>
            </Button>
          </OverlayTrigger>

          <OverlayTrigger placement="bottom" overlay={tooltipShareRig} delay={delayTime} delayHide={delayHideTime}>
            <Button bsSize="small" className={shareRigOpen} onClick={(e) => { this.toggleShareRig(e) }}>
              <i className="fa fa-share-square"></i>
            </Button>
          </OverlayTrigger>

          <OverlayTrigger placement="bottom" overlay={tooltipDeleteRig} delay={delayTime} delayHide={delayHideTime}>
            <Button bsSize="small" className={confirmDeleteOpen} onClick={(e) => { this.toggleDelete(e) }}>
              <i className="fa fa-trash"></i>
            </Button>
          </OverlayTrigger>
        </ButtonToolbar>

        <div id="RigToolbarTools" className={RigToolbarToolOpen}>
        { this.state.confirmDeleteRigVisible &&
          <div className="tool-wrapper deleteRig">
            <Button
              className="deleteRigCancel"
              bsSize="small"
              onClick={(e) => {
                e.preventDefault();
                this.setState({confirmDeleteRigVisible: false}) }}
            >
              Cancel
            </Button>
            <Button
              className="deleteRig"
              bsSize="small"
              bsStyle="danger"
              onClick={(e) => {
                e.preventDefault();
                Actions.deleteRig();
                this.setState({confirmDeleteRigVisible: false}) }}
            >
              Delete Rig?
            </Button>
          </div>
        }

        { this.state.editRigVisible &&
          <div className="tool-wrapper">
            <form onSubmit={(e) => {e.preventDefault()}}>
              <FormGroup controlId="editRigTitle" validationState={this.getValidationRigTitleState()}>
                <ControlLabel>Rig Title</ControlLabel>
                <FormControl
                  type="text"
                  value={this.state.rigTitle}
                  placeholder="Rig title..."
                  onChange={(e) => { this.handleEditRigTitle(e) }}
                />
                <HelpBlock>{this.state.rigTitleValidationMsg}</HelpBlock>
              </FormGroup>

              <FormGroup controlId="editRigDesc" validationState={this.getValidationRigDescState()}>
                <ControlLabel>Rig Description</ControlLabel>
                <FormControl
                  componentClass="textarea"
                  value={this.state.rigDesc}
                  placeholder="Rig description or notes..."
                  onChange={(e) => { this.handleEditRigDesc(e) }}
                />
                <HelpBlock>{this.state.rigDescValidationMsg}</HelpBlock>
              </FormGroup>

              <Button bsSize="small" onClick={(e) => { this.toggleEditRig(e) }}>Done Editing</Button>
            </form>
          </div>
          }

          { this.state.forkRigVisible &&
            <div className="tool-wrapper forkRig">
              <Button bsSize="small" bsStyle="danger" onClick={(e) => { Actions.forkRig(e); this.setState({forkRigVisible: false }) }}>Duplicate / copy rig.</Button>
            </div>
          }

          { this.state.shareRigVisible &&
            <div className="tool-wrapper shareRig">
              {  this.props.rig.public ?
                <span>
                  <p className="clearfix">
                    <Button bsSize="small" className="button-make-private" onClick={ this.makeRigPrivate.bind(this) } title="Make rig private">Public <i style={{paddingLeft: '3px', paddingRight: '3px'}} className="fa fa-unlock"></i></Button>
                    <Button bsSize="small" className="button-update" onClick={ this.makeRigPublic.bind(this) } title="Update public rig with local changes">Update <i className="fa fa-cloud-upload" style={{fontSize: '16px'}}></i></Button>
                    <a href={this.displayPublicLink()} className="link-icon" onClick={ (e) => { e.preventDefault(); window.open(this.displayPublicLink()) } }><i className="fa fa-external-link"></i></a>
                  </p>

                  <p>
                    <span className="link-label">Public Link:</span>
                    <input type="text" onFocus={ this.selectAllText.bind(this) } style={{padding: '4px 4px 4px 7px', width: '100%', marginRight: '4px', border: '1px solid lightgray' }} value={this.displayPublicLink()} readOnly />
                  </p>

                  { GuestUserData.settings.showNotice_AnonymousPrivateKey &&
                    <div className="anonymous-private-key">
                      <h4>Anonymous Private Key:</h4>
                      <input
                        type="text"
                        style={{border: '1px solid lightgray', padding: 6, width: 108, marginBottom: 10}}
                        value={AppState.get('pk')}
                        onFocus={ this.selectAllText.bind(this) }
                        readOnly
                      />
                      <p style={{fontSize: 13}}><b>Note:</b> Anonymous rigs require a private key to edit or unpublish. Keep this key private. Authenticated accounts will be available in the future. See <a href="https://gitlab.com/rigconfig/rigconfig/">GitLab</a>.</p>

                      <Button
                        bsSize="small"
                        className="button-dismiss-notice"
                        onClick={() => {
                          GuestUser.update({_id: AppState.get('GuestUserId')}, {$set: {settings: {showNotice_AnonymousPrivateKey: false}}})
                        }}
                        title="Make rig private"
                      >
                        Dismiss <i style={{paddingLeft: '3px', paddingRight: '3px'}} className="fa fa-close"></i>
                      </Button>
                    </div>
                  }
                </span>
              :
                <span>
                  <Button bsSize="small" onClick={ this.makeRigPublic.bind(this) } title="Make rig public">Private <i style={{paddingLeft: '3px', paddingRight: '3px'}} className="fa fa-lock"></i></Button>
                  <span className="toggle-msg">(toggle public/private)</span>
                </span>
              }

              <br />
              <br />
              <Button bsSize="small" onClick={(e) => { Actions.exportRig(e) }}><i className="fa fa-download"></i> Export Rig</Button> &nbsp;
              <ImportRig />
              <div id="download-link-container"></div>

              {/*<ul>
                <li>Public Link / Copy link</li>
                <li>Print</li>
                <li>Email</li>
                <li>Embed</li>
                <li>Pastebin</li>
                <li>Facebook</li>
                <li>Twitter</li>
                <li>Twitter</li>
                <li>Github</li>
                <li>GitLab</li>
                <li>the chans</li>
                <li>Instagram</li>
              </ul>*/}
              {/*<Button bsSize="small" bsStyle="danger" onClick={(e) => { Actions.shareRig(e) }}>Share Rig!</Button>*/}

              {/*<button
               onClick={ this.shareRig.bind(this) }
               className='sharer button'
               data-sharer='twitter'
               data-title='Checkout Sharer.js!'
               data-url='https://ellisonleao.github.io/sharer.js/'>
               Share on Twitter
             </button>*/}

              {/*<button
               onClick={(e) => { this.shareRig(e) }}
               className='sharer button'
               data-sharer='viber'
               data-title='Checkout Sharer.js!'
               data-url='https://ellisonleao.github.io/sharer.js/'>
               Share on Viber
             </button>*/}

             {/*<button onClick={(e) => { this.shareRig(e) }} class="sharer button" data-sharer="pinterest" data-url="https://ellisonleao.github.io/sharer.js/" data-image="https://www.youtube.com/watch?v=A75PQLV-Nck">Share on Pinterest</button>*/}

            </div>
          }
        </div>
      </span>
    )
  }
}
