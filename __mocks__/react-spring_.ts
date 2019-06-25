import 'core-js/features/object/from-entries';
import * as React from 'react';
import * as ReactSpring from 'react-spring';
const { animated, ...withoutAnimated } = ReactSpring;

const animatedMock = Object.keys(animated)
  .reduce((elements: any, element) => ({
    ...elements,
    [element](props: any) {
      return React.createElement(element, null, props.children)
    }
  }), {});

export default {
  ...withoutAnimated,
  animated: animatedMock
}