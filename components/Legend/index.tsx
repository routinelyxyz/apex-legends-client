import React from 'react';
import css from './style.scss';
import Link from 'next/link';
import { Legend } from '../../types';
import { STATIC } from '../../helpers/consts';

interface LegendCardProps {
  legend: Legend
}
export const LegendCard = ({ legend }: LegendCardProps) => (
  <li>
    <Link
      href={`/legends/legend?slug=${legend.slug}`}
      as={`/legends/${legend.slug}`}
    > 
      <a className={css.container}>
        <img
          src={STATIC + legend.img}
          className={css.img}
        />
        <p className={css.name}>
          {legend.name}
        </p>
      </a>
    </Link>
  </li>
);