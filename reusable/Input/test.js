import React from 'react';
import {
  render,
  fireEvent,
  wait,
  cleanup,
  waitForElement,
  Simulate,
  getByTestId,
} from 'react-testing-library';

import { BasicInput } from './index';

test('input works properly', async () => {
  let value = '';
  const handleOnChange = e => value = e.target.value;

  const { container, getByLabelText, getByTestId, rerender, getByText } = render(
    <BasicInput
      data-testid="BasicInput"
      name="firstName"
      type="text"
      title="checkyn"
      value={value}
      onChange={handleOnChange}
    />
  );

  const input = getByTestId('BasicInput');
  expect(value).toBe("");
  fireEvent.change(input, { target: { value: "hello" }});
  expect(value).toBe("hello");
});