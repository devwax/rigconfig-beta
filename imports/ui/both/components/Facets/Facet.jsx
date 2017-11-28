import { Meteor } from 'meteor/meteor';
import React from 'react';
import AppState from '/imports/startup/both/AppState.js';
import FacetItem from './FacetItem.jsx'
import classnames from 'classnames';
import { numberWithCommas } from '/imports/ui/both/helpers'
import { formatTitle } from '/imports/api/lib/formatTitle.js';

export default class Facet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: true,
      userInitialedCollapsing: false
    }
  }

  handleFacetCollapseToggle(e) {
    this.setState({userInitialedCollapsing: true});
    this.setState({collapsed: !this.state.collapsed});

  }

  render() {
    let { collapsed } = this.state
    const { facetName, facetValues } = this.props

    if ((facetName === 'type' || facetName === 'mftr')) {
      collapsed = false
    }
    if ((this.state.userInitialedCollapsing === true) && (facetName === 'type' || facetName === 'mftr')) {
      collapsed = !this.state.collapsed
    }

    var facetClass = classnames({
      'facet': true,
      'collapsed': collapsed
    });
    var facetControlIcon = classnames({
      'fa': true,
      'fa-chevron-circle-down': !collapsed,
      'fa-chevron-circle-right': collapsed,
      'facet-control-icon': true
    });

    const facetNameFormatted = formatTitle(facetName)
    const facet_values = facetValues

    return (
      <dl className={facetClass}>
        <dt onClick={this.handleFacetCollapseToggle.bind(this)}>
          <span className="facet-title">{facetNameFormatted}</span>
          {/* { showCollapseArrow && <i className={facetControlIcon}></i> } */}
          <i className={facetControlIcon}></i>
        </dt>
        {
          facet_values.map((facet_value, idx) => {
            let { name, count, isRefined } = facet_value
            nameFormatted = (facetName === 'type') ? formatTitle(name) : name
            // nameFormatted = name
            const checked = isRefined
            const checkedClass = checked ? "active" : "inactive"
            count = numberWithCommas(count)
            return <FacetItem key={name + idx} facetName={facetName} valueName={name} valueNameFormatted={nameFormatted} count={count} checked={checked} checkedClass={checkedClass} algoliaActive={this.props.algoliaActive} />
          })
        }
      </dl>
    )
  }
}
