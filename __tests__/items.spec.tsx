import React from 'react';
import { render } from '@testing-library/react';
import ItemsPage from '../pages/items';
import { withRouter } from 'next/router';
import { Weapon } from '../types';

const itemsMock: Weapon[] = [
  {
    id: 1,
    name: 'M4',
    slug: 'm4',
    type: 'Assault Rifle',
    ammo: {
      name: '',
      img: ''
    },
    bodyDPS: 31,
    bodyDamage: 12,
    emptyReload: 4.31,
    headshotDPS: 3.21,
    img: '',
    magazine: 13,
    reloadTime: 1.23
  }
]

describe('Items page', () => {
  test('renders correctly', () => {
    const PageWithRouter = withRouter(ItemsPage);
    render(
      <PageWithRouter
        items={itemsMock}
      />
    );
  });
});