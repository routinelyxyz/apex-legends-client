import React from 'react';
import {
  render
} from '@testing-library/react';
import { PhraseSelector } from '.';


test('Selects phrase correctly', () => {
  const { container } = render(
    <PhraseSelector
      value="Interstellar"
      phrase="inter"
    />
  );

  expect(container.firstChild).toMatchSnapshot();
});