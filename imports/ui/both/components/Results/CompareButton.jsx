import React from 'react'
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import AppState from '/imports/startup/both/AppState.js';

class CompareButton extends React.PureComponent {
  state = {
    compareState: false
  }

  addToComparison = (componentId, componentComparisonList = []) => {
    componentComparisonList = AppState.get('componentComparisonList');
    componentComparisonList.push(componentId);
    AppState.set({componentComparisonList});
  }

  removeFromComparison = (componentId, componentComparisonList = []) => {
    componentComparisonList = AppState.get('componentComparisonList');
    componentComparisonList = componentComparisonList.filter((i) => i !== componentId);
    AppState.set({componentComparisonList});
  }

  // Need to check to see if they are in compare store (appstate) in a lifecycle method or constructor
  // componentWillMount() {
  //   console.log('Mounted! componentId', this.props.componentId);
  // }

  render() {
    return (
      <span className="compare-components">
        <div className="ais-RefinementList__item ais-RefinementList__itemSelected">
          <label>
            <input
              type="checkbox"
              className="ais-RefinementList__itemCheckbox ais-RefinementList__itemCheckboxSelected"
              checked={this.state.compareState}
              onChange={() => {
                this.setState(state => ({compareState: !state.compareState}));
                !this.state.compareState ?
                  this.addToComparison(this.props.componentId)
                  :
                  this.removeFromComparison(this.props.componentId)
              }}
            />
            <span className="ais-RefinementList__itemBox ais-RefinementList__itemBox ais-RefinementList__itemBoxSelected"></span>
            <span className="ais-RefinementList__itemLabel ais-RefinementList__itemLabel ais-RefinementList__itemLabelSelected" style={{verticalAlign: 'middle'}}>COMPARE</span>
          </label>
        </div>
      </span>
    )
  }
}

// const CompareButton = ({componentId, compareState}) =>
//   <span className="compare-components">
//     <div className="ais-RefinementList__item ais-RefinementList__itemSelected">
//       <label>
//         <input
//           type="checkbox"
//           class="ais-RefinementList__itemCheckbox ais-RefinementList__itemCheckboxSelected"
//           checked={compareState}
//           onChange={e => { e.preventDefault(); AppState.set({compareState: !compareState}); }}
//         />
//         <span className="ais-RefinementList__itemBox ais-RefinementList__itemBox ais-RefinementList__itemBoxSelected"></span>
//         <span className="ais-RefinementList__itemLabel ais-RefinementList__itemLabel ais-RefinementList__itemLabelSelected">COMPARE</span>
//       </label>
//     </div>
//   </span>

export default withTracker(() => {
  return {
    compareState: AppState.get('compareState')
  }
})(CompareButton)
