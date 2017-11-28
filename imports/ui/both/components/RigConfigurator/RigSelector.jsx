import { Meteor } from 'meteor/meteor';
import React from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import AppState from '/imports/startup/both/AppState.js';
import Actions from '/imports/startup/both/Actions.js';
import classnames from 'classnames';
import marked from 'marked'
import { truncateText } from '/imports/ui/both/helpers';
import { stripHTML } from '/imports/api/lib/stripHTML.js';

export default class RigSelector extends React.Component {
  render() {
    const { rigTitle, rigId, rigPublic, myrigs, rigSelectorOpen, forkSourceId } = this.props
    const RigSelectorClass = classnames({rigSelectorOpen})

    return (
      <form>
        <div id="RigSelector"
          className={RigSelectorClass}
          onClick={() => {
            AppState.set({rigSelectorOpen: !rigSelectorOpen})
          }}
        >
          <span className="selector-window">{(rigPublic ? <i className="fa fa-share-square"></i> : '')} {(!!forkSourceId ? <i className="fa fa-code-fork"></i> : '')} {rigTitle}</span>
          <i className="fa fa-sort"></i>
        </div>

        { rigSelectorOpen &&
          <ListGroup id="RigSelector-dropdown">
            { myrigs.map((rig, idx) => {
              if ((rig._id !== rigId) || (myrigs.length === 1)) { // Don't display a rig twice in the list when selected
                const even = idx % 2 == 0;
                return (
                  <ListGroupItem
                    // header={(rig.public && <i className="fa fa-share-square"></i>) (rig.forkSourceId && <i className="fa fa-code-fork"></i>) <span>{truncateText(rig.title, 51)}</span>}
                    header={<span>{(rig.public && <i className="fa fa-share-square"></i>)} {(rig.forkSourceId && <i className="fa fa-code-fork"></i>)} <span>{truncateText(rig.title, 51)}</span></span>}
                    key={idx}
                    className={(even ? '' : 'highlight') + ' ' + (rig.desc ? 'hasDesc' : '')}
                    onClick={(e) => {
                      e.preventDefault();
                      Actions.selectRig(rig._id);
                      AppState.set({rigSelectorOpen: false})
                    }}>
                      { rig.desc && truncateText(stripHTML(marked(rig.desc)), 80) }
                  </ListGroupItem>
                )
              }
            })}
          </ListGroup>
        }
      </form>
    )
  }
}
