import { Meteor } from 'meteor/meteor';
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
import { withTracker } from 'meteor/react-meteor-data';
import AppState from '/imports/startup/both/AppState.js';
import Actions from '/imports/startup/both/Actions.js';
import { truncateText } from '/imports/ui/both/helpers';
import { GuestUser } from '/imports/api/user/guest_user.js';

class UserSettingsModal extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      username: this.props.GuestUserData.username
    }
  }

  handleUsernameChange(e) {
    // Note: 'username' is also filtered in imports/api/public_rigs/methods.js
    const username = truncateText(e.target.value.replace(/[^\w\s]/gi, ''), 30)
    this.setState({username})
    GuestUser.update({_id: AppState.get('GuestUserId')}, {$set: {username}})
  }

  render() {
    const { GuestUserData } = this.props
    return (
      <Modal show={this.props.UserSettingsModalOpen} onHide={Actions.closeAllModals} animation={true}>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fa fa-cog" aria-hidden="true"></i>
            <span style={{paddingLeft: 10}}>Settings</span>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form onSubmit={(e) => {e.preventDefault()}}>
            <FormGroup controlId="formControlsUsername">
              <ControlLabel>Username: <span className="username-preview">{GuestUserData.username ? GuestUserData.username : 'Anonymous'}</span></ControlLabel>
              <FormControl type="text" name="username" onChange={this.handleUsernameChange.bind(this)} placeholder="Anonymous" value={this.state.username} />
            </FormGroup>

            <p><strong>Private Key:</strong> {AppState.get('pk')}</p>

            <div className="clearfix" style={{marginTop: 30}}>
              <Button
                bsStyle="default"
                onClick={Actions.closeAllModals}
              >Close</Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    )
  }
}

export default withTracker(() => {
  return {
    GuestUserData: Meteor.isClient ? GuestUser.findOne() : {}
  }
})(UserSettingsModal)
