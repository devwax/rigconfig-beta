/**
  Modified npm package: react-masonry-layout
  https://www.npmjs.com/package/react-masonry-layout
  GPL-3.0
  By: scarletsky
  https://www.npmjs.com/~scarletsky
*/
import React, { Component } from 'react'
import PropTypes from 'prop-types';

const InfiniteScroll = (ComposedComponent) => class I extends Component {
  constructor(props) {
    super(props)
    this.handleScroll = this.handleScroll.bind(this)
    // console.log(props);
  }

  componentDidMount() {
    if (!this.props.infiniteScrollDisabled) {

      const { infiniteScrollContainer } = this.props

      if (infiniteScrollContainer === 'window') {
        window.addEventListener('scroll', this.handleScroll)
      } else {
        document
          .getElementById(infiniteScrollContainer)
          .addEventListener('mousewheel', this.handleScroll)
      }

    }
  }

  componentWillUnmount() {
    if (!this.props.infiniteScrollDisabled) {

      const { infiniteScrollContainer } = this.props

      if (infiniteScrollContainer === 'window') {
        window.removeEventListener('scroll', this.handleScroll)
      } else {
        document
          .getElementById(infiniteScrollContainer)
          .removeEventListener('mousewheel', this.handleScroll)
      }

    }
  }


  handleScroll() {
    const { infiniteScroll, infiniteScrollLoading, infiniteScrollEnd } = this.props
    if ( this.edgeDistance < this.props.infiniteScrollDistance
      && !infiniteScrollLoading
      && !infiniteScrollEnd ) {
      infiniteScroll()
    }
  }

  get edgeDistance() {
    const { id } = this.props
    return this.props.infiniteScrollEdge === 'bottom'
      ? this.refs[id].getBoundingClientRect().bottom - window.innerHeight
      : this.refs[id].getBoundingClientRect().top * (-1)
  }

  render() {
    return (
      <div>
        <div ref={this.props.id} >
          <ComposedComponent {...this.props} />
        </div>
        {this.props.infiniteScrollLoading && this.props.infiniteScrollSpinner}
        {this.props.infiniteScrollEnd && this.props.infiniteScrollEndIndicator}
      </div>
    )
  }

}

// InfiniteScroll.propTypes = {
//   id: PropTypes.string.isRequired,
//   infiniteScroll: PropTypes.func.isRequired,
//   infiniteScrollContainer: PropTypes.string,
//   infiniteScrollLoading: PropTypes.bool,
//   infiniteScrollEnd: PropTypes.bool,
//   infiniteScrollEdge: PropTypes.oneOf(['top', 'bottom']),
//   infiniteScrollDistance: PropTypes.number,
//   infiniteScrollDisabled: PropTypes.bool,
//   infiniteScrollSpinner: PropTypes.element,
//   infiniteScrollEndIndicator: PropTypes.element
// }

// InfiniteScroll.defaultProps = {
//   infiniteScrollContainer: 'window',
//   infiniteScrollLoading: false,
//   infiniteScrollEnd: false,
//   infiniteScrollEdge: 'bottom',
//   infiniteScrollDistance: 200,
//   infiniteScrollDisabled: false,
//   infiniteScrollSpinner: <div>this is a loader</div>,
//   infiniteScrollEndIndicator: <div>no more data</div>
// }

export default InfiniteScroll;
