import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Button } from 'react-bootstrap';
import AppState from '/imports/startup/both/AppState.js'
import Actions from '/imports/startup/both/Actions.js';
import { GuestRigs } from '/imports/api/rigs/guest_rigs.js';
import { GuestRigComponents } from '/imports/api/rig_components/guest_rig_components.js';

export default class ImportRig extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      importRigVisible: false,
    };
  }

  handleFileSelect(e) {
    var files = e.target.files; // FileList object
    $('#import-message').html('')

    for (var i = 0, f; f = files[i]; i++) {
      var reader = new FileReader();
      reader.onload = (e) => {
        var rig_data = JSON.parse(e.target.result);

        // Create new rig and swtich to it.
        const newRigid = Actions.createNewBlankRig()
        console.log('rig_data:', rig_data);
        console.log('rig_data.title:', rig_data.title);
        // @todo - The rig properties are duplicated in Actions.js... props/schema/validation need to be centralized / normalized.
        GuestRigs.update({_id: newRigid}, { $set: {
            title: rig_data.title,
            desc: rig_data.desc,
            public: rig_data.public,
            username: rig_data.username,
            price: rig_data.price,
            lastSelected: new Date(),
            createdAt: rig_data.createdAt,
          }
        })

        rig_data.components.map((c) => {
          var rigComponent = {
            rigId: newRigid,
            componentId: c._id,
            title: c.title,
            desc: c.desc
          }
          GuestRigComponents.insert(rigComponent)
        })
        $('#import-message').append('<p>Rig imported!</p>')

      }
      reader.readAsText(f)
    }
  }

  render() {
    return (
      <span>
        <Button bsSize="small" onClick={(e) => { this.setState({importRigVisible: !this.state.importRigVisible }) }}><i className="fa fa-upload"></i> Import Rig</Button>
        <br />
        { this.state.importRigVisible &&
          <form action="#" onChange={this.handleFileSelect}>
            <input type="file" id="files" name="files[]" />
            <span id="list"></span>
            <div id="import-message"></div>
          </form>
        }
      </span>
    )
  }
}
