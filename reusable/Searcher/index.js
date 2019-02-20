import css from './style.scss';

import Input from '../Input';

export const Result = ({ item }) => (
  <li
    className={css.result}
    key={item.name}
  >
    {item.name}
  </li>
);

export const Searcher = ({
  phrase, results,
  keyProvider = 'name',
  ...inputProps,
}) => {
  return (
    <div className={css.container}>
      <Input
        {...inputProps}
      />
      {!!inputProps.value.length && results.length && (
        <div className={css.results_parent}>
          <ul className={css.results}>
            {results.map(result => 
              <Result
                item={result}
                key={result[keyProvider]}
              />
            )}
          </ul>
        </div>
      )}
    </div>
  )
}