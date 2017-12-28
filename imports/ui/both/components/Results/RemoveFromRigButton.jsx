import React from 'react';
import { Button } from "react-bootstrap";

export default ({componentId}) =>
  <Button
    className="minus"
    style={{marginLeft: 5}}
    bsSize="xsmall"
    title="Add to Rig"
    onClick={ e => {e.preventDefault(); Actions.deleteFromRig(componentId);} }>
      <i className="fa fa-minus"></i>
    </Button>
