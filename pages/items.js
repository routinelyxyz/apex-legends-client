import Layout from '../layouts';
import css from '../assets/css/items.scss';
import fetch from 'isomorphic-unfetch';
import styled from 'styled-components';
import Link from 'next/link';

import Item from '../reusable/Item';
import Input from '../reusable/Input';

const Items = ({ items }) => {
  return (
    <Layout>
      <div>
        <Nav>
          <Link href="/items" passHref>
            <NavLink>Weapons</NavLink>
          </Link>
          <Link href="/items/attachments" passHref>
            <NavLink>Attachments</NavLink>
          </Link>
        </Nav>
        <div>
          <Input
            placeholder="Weapon name..."
          />
          <div className={css.items__container}>
            {items.map(item =>
              <Item
                key={item.id}
                item={item}
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
};

const Nav = styled.nav`
  margin-bottom: 50px;
`
const NavLink = styled.a`
  margin-right: 15px;
`

Items.getInitialProps = async () => {
  const data = await fetch('http://localhost:4000/items/weapons');
  const items = await data.json();
  return { items }
}

export default Items;