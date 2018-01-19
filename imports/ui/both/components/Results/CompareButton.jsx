import React from 'react'
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import AppState from '/imports/startup/both/AppState.js';
import Actions from '/imports/startup/both/Actions.js';

const CompareButton = ({componentId, compareState, component}) => {
  return (
    <span className="compare-components">
      <div className="ais-RefinementList__item ais-RefinementList__itemSelected">
        <label>
          <input
            type="checkbox"
            className="ais-RefinementList__itemCheckbox ais-RefinementList__itemCheckboxSelected"
            defaultChecked={compareState}
            checked={compareState}
            onChange={() => {
              !compareState ?
                Actions.addToComparison(component)
                :
                Actions.removeFromComparison(componentId)
            }}
          />
          <span className="ais-RefinementList__itemBox ais-RefinementList__itemBox ais-RefinementList__itemBoxSelected"></span>
        </label>
        <span
          onClick={() => {
            AppState.set({ComparisonModalOpen: true})
          }}
          className="ais-RefinementList__itemLabel ais-RefinementList__itemLabel ais-RefinementList__itemLabelSelected"
          style={{verticalAlign: 'middle'}}>COMPARE</span>
      </div>
    </span>
  )
}


export default withTracker(({componentId}) => {
  const componentComparisonList = AppState.get('componentComparisonList');
  return {
    compareState: componentComparisonList.find(c => c._id === componentId)
  }
})(CompareButton)
