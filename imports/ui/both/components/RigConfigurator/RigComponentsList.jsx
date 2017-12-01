import React from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { Meteor } from 'meteor/meteor';
import RigComponent from './RigComponent.jsx';
import NoComponentsMessage from './NoComponentsMessage.jsx';

const RigComponentsList = SortableContainer(({
    components,
    hasComponents,
    totalRigCostNumeric,
    componentsCount,
    currencySymbol,
    totalRigCostFormatted
  }) => {
  return (
    <div id="components-list">
      <h4 className="section-title">
        <span>Components ({componentsCount})</span>
        {' '}
        <span id="totalRigCostFormatted-header">{currencySymbol + totalRigCostFormatted}</span>
      </h4>

      { hasComponents ?
        components.map((component, index) => {
          return (<RigComponent component={component} key={component._id} index={index} />)
        })
        :
        <NoComponentsMessage />
      }
    </div>
  )
})

export default RigComponentsList;
