import css from './style.scss';
import 'isomorphic-unfetch';
import { HOST_URL, STATIC } from '../../helpers';

import Legend from '../../components/Legend';

const Legends = ({ legends }) => {
  return (
    <article>
      <h1 className={css.header}>
        Legends
      </h1>
      <ul className={css.legends}>
        {legends.map(legend => (
          <Legend
            key={legend.id}
            legend={legend}
          />
        ))}
      </ul>
    </article>
  )
}

Legends.getInitialProps = async () => {
  const data = await fetch(HOST_URL + '/legends');
  const legends = await data.json();
  return { legends };
}

export default Legends;