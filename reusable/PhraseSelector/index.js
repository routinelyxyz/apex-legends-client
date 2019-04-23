import css from './style.scss';
import React from 'react';


const PhraseSelector = ({ value, phrase }) => {
  const val = value.toLowerCase();
  const phrs = phrase.toLowerCase();

  const phraseStart = val.indexOf(phrs);
  if (phraseStart === -1) return value;
  const phraseEnd = phraseStart + phrase.length;

  return (
    <>
      {value.slice(0, phraseStart)}
      <strong className={css.selection}>
        {value.slice(phraseStart, phraseEnd)}
      </strong>
      {value.slice(phraseEnd)}
    </>
  )
}

const Memoized = React.memo(PhraseSelector);

export { Memoized as PhraseSelector };