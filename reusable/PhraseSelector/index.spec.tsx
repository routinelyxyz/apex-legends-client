import React from 'react';
import {
  render
} from '@testing-library/react';
import { PhraseSelector } from '.';

test('Selects phrase correctly', () => {
  const { container } = render(
    <div>
      <PhraseSelector
        value="Interstellar"
        phrase="inter"
      />
    </div>
  );
  expect(container.firstChild).toMatchSnapshot();
});