import css from './style.scss';
import { Flipper, Flipped } from 'react-flip-toolkit';
 
import Item from '../../reusable/Item';

export const WeaponsGrid = ({ items, flipKey }) => {
  return (
    <Flipper
      flipKey={flipKey}
      spring="veryGentle"
      staggerConfig={{ default: { speed: 1.5 }}}
      opacity={true}
    >
      <div className={css.container} data-testid="WeaponsGrid">
        {items.map(item => (
          <Flipped key={item.id} flipId={item.id}>
            <Item item={item} key={item.id}/>
          </Flipped>
        ))}
      </div>
    </Flipper>
  )
}