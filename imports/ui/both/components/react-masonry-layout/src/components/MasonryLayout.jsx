/**
  Modified npm package: react-masonry-layout
  https://www.npmjs.com/package/react-masonry-layout
  GPL-3.0
  By: scarletsky
  https://www.npmjs.com/~scarletsky
*/
import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { $ } from 'meteor/jquery'
import Bricks from 'bricks.js'
import InfiniteScroll from './InfiniteScroll'
import AppState from '/imports/startup/both/AppState.js';

class MasonryLayoutClass extends Component {
  componentDidMount() {
    // console.log('componentDidMount()');
    const sizesOpen   = [ { columns: 2, gutter: 20 }, { mq: '768px', columns: 2, gutter: 20 }, { mq: '1000px', columns: 3, gutter: 20 }, { mq: '1260px', columns: 4, gutter: 20 }, { mq: '1500px', columns: 5, gutter: 20 } ];
    const sizesClosed = [ { columns: 2, gutter: 20 }, { mq: '768px', columns: 4, gutter: 20 }, { mq: '1024px', columns: 5, gutter: 20 }, { mq: '1402px', columns: 5, gutter: 20 } ];
    // const sizes = this.props.LeftDrawerOpen ? sizesOpen : sizesClosed;

/**
  @todo - When manually resizing the browser, Bricks seems to be intermittently using the wrong 'sizes' media queries,
  but it seems to be working otherwise. All the duplication of sizesOpen / sizesClosed, etc were an attempt to track
  down why it's performing that way. Leaving it this way for now. Will refactor later. It's getting confusing af.
  See the render method for ResultsForRigs.jsx for the parent component using this one.

              > goes to doctor

  ( ͡°_ʖ ͡°)  > "It confused when I go like this.." (manually resizes browser)

      (ಠ_ಠ)  > doctor: "Well, don't go 'like this'?" (manually resizes browser)

  ¯\_ツ_/¯  > broblem zolved..
*/

    const instance = Bricks({
      container: `#${this.props.id}`,
      packed: this.props.packed,
      // sizes: this.props.sizes,
      // sizes: this.props.LeftDrawerOpen ? sizesOpen : sizesClosed
      sizes: AppState.get('LeftDrawerOpen') ? sizesOpen : sizesClosed
    });

    instance.on('pack', () => {
      $('#MasonryItems').removeClass('loading')
    })

    instance.resize(true)

    if (this.props.children.length > 0) {
      instance.pack()
    }

    /* eslint react/no-did-mount-set-state: 0 */
    this.setState({ instance });
  }

  componentDidUpdate(prevProps) {
    const { instance } = this.state
    const sizesOpen   = [ { columns: 2, gutter: 20 }, { mq: '768px', columns: 2, gutter: 20 }, { mq: '1000px', columns: 3, gutter: 20 }, { mq: '1260px', columns: 4, gutter: 20 }, { mq: '1500px', columns: 5, gutter: 20 } ];
    const sizesClosed = [ { columns: 2, gutter: 20 }, { mq: '768px', columns: 4, gutter: 20 }, { mq: '1024px', columns: 4, gutter: 20 }, { mq: '1402px', columns: 5, gutter: 20 } ];
    // console.log('componentDidUpdate()');

    let newInstance;
    if (prevProps.LeftDrawerOpen !== this.props.LeftDrawerOpen) {
      // console.log('componentDidUpdate(): LeftDrawerOpen Changed');

      newInstance = Bricks({
        container: `#${this.props.id}`,
        packed: this.props.packed,
        sizes: AppState.get('LeftDrawerOpen') ? sizesOpen : sizesClosed
      })
      this.setState({instance: newInstance})
      // newInstance.resize(true)
      newInstance.resize(true)
      return newInstance.pack()
    }


    if (prevProps.children.length === 0 && this.props.children.length === 0) {
      // console.log('componentDidUpdate(): prevProps.children.length === 0 && this.props.children.length === 0');
      return
    }

    if (prevProps.children.length === 0 && this.props.children.length > 0) {
      // console.log('componentDidUpdate(): prevProps.children.length === 0 && this.props.children.length > 0 [children.length goes from 0 to 1 or more]');
      return newInstance ? newInstance.pack() : instance.pack()
    }

    if (prevProps.children.length !== this.props.children.length) {
      // console.log('componentDidUpdate(): prevProps.children.length !== this.props.children.length [a change in children.length]');
      return newInstance ? newInstance.update() : instance.update()
    }
  }

  componentWillUnmount() {
    this.state.instance.resize(false)
  }

  render() {
    const { id, className, style, children } = this.props;
    // console.log('children', children);
    return (
      <div
        id={id}
        className={className}
        style={style}
        >
        {children}
      </div>
    );
  }
}

MasonryLayoutClass.propTypes = {
  id: PropTypes.string.isRequired,
  packed: PropTypes.string,
  sizes: PropTypes.array,
  style: PropTypes.object,
  className: PropTypes.string,
  children: PropTypes.arrayOf(PropTypes.element).isRequired
}

MasonryLayoutClass.defaultProps = {
  packed: 'data-packed',
  sizes: [
    { columns: 2, gutter: 20 },
    { mq: '768px', columns: 3, gutter: 20 },
    { mq: '1024px', columns: 6, gutter: 20 }
  ],
  style: {},
  className: ''
}

const MasonryLayout = InfiniteScroll(MasonryLayoutClass)
export default MasonryLayout;
