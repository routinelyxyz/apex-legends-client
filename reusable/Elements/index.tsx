import React, { ReactNode } from 'react';
import css from './style.scss';

interface H3Props {
  children: ReactNode
}
export const H3 = (_props: H3Props) => (
  <h3 className={css.h3} />
);