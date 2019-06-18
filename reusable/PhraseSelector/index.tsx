import React, { ReactNode, ReactElement } from 'react';
import css from './style.scss';

interface PhraseSelectorProps {
  value: string
  phrase: string
}
export const PhraseSelector = ({
  value,
  phrase
}: PhraseSelectorProps): ReactElement => {
  const valueLowered = value.toLowerCase();
  const phraseLowered = phrase.toLowerCase();

  const phraseStart = valueLowered.indexOf(phraseLowered);
  if (phraseStart === -1) {
    return (
      <>
        {value}
      </>
    );
  }
  const phraseEnd = phraseStart + phrase.length;

  return (
    <>
      {value.slice(0, phraseStart)}
      <strong className={css.selection}>
        {value.slice(phraseStart, phraseEnd)}
      </strong>
      {value.slice(phraseEnd)}
    </>
  );
}