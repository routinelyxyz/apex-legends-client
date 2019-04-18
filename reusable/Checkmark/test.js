import React from 'react';
import {
  render,
  fireEvent,
  wait,
  cleanup,
  waitForElement,
  Simulate,
} from 'react-testing-library';

import { Checkmark } from './index';

test('gets checked properly', async () => {
  let checked = false;
  const handleOnChange = jest.fn();

  const { container, getByText } = render(
    <Checkmark
      title="checkyn"
      value={false}
      onChange={handleOnChange}
    />
  );

  fireEvent.click(getByText('checkyn'));

  expect(handleOnChange).toHaveBeenCalledTimes(1);
  expect(container.querySelector('input[type=checkbox]').checked).toBe(true);
});