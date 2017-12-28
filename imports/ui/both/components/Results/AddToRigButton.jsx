import React from 'react';
import { Button } from "react-bootstrap";

export default ({component, inRig, inRigCount}) =>
  <Button
    className={"add-to-rig-button" + (inRig ? " inRig" : "")}
    bsStyle="default"
    bsSize="small"
    title="Add to Rig"
    onClick={e => Actions.addToRig(component) }>
    <i className="fa fa-plus"></i>
  </Button>
