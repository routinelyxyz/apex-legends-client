import css from './style.scss';
import React from 'react';

interface PhraseSelectorProps {
  value: string
  phrase: string
}

export const PhraseSelector = ({ value, phrase }: PhraseSelectorProps) => {
  const valueLowered = value.toLowerCase();
  const phraseLowered = phrase.toLowerCase();

  const phraseStart = valueLowered.indexOf(phraseLowered);
  if (phraseStart === -1) {
    return (
      <>{value}</>
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