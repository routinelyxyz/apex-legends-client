import React from 'react';
import css from './style.scss';
import { Flipper, Flipped } from 'react-flip-toolkit';
import { Weapons } from '../../types';
 
import Item from '../../reusable/Item';

interface WeaponsGridProps {
  items: Weapons
  flipKey: string
}
export const WeaponsGrid = ({ items, flipKey }: WeaponsGridProps) => {
  return (
    <Flipper
      flipKey={flipKey}
      spring="veryGentle"
      staggerConfig={{ default: { speed: 1.5 }}}
    >
      <div className={css.container} data-testid="WeaponsGrid">
        {items.map(item => (
          <Flipped key={item.id} flipId={item.id.toString()}>
            <Item item={item} key={item.id}/>
          </Flipped>
        ))}
      </div>
    </Flipper>
  )
}