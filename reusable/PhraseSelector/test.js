import React from 'react';
import { create } from "react-test-renderer";
import { PhraseSelector } from './';

test('it matches the snapshot', () => {
  const component = create(
    <PhraseSelector
      value="Rockalone"
      phrase="alone"
    />
  );
  expect(component.toJSON()).toMatchSnapshot();
    
  component.update(
    <PhraseSelector
      value="veryLongPhraseWith Some Text"
      phrase="longPhr"
    />
  );
  expect(component.toJSON()).toMatchSnapshot();
});