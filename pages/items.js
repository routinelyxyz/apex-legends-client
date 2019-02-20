import Layout from '../layouts';
import css from '../assets/css/items.scss';
import fetch from 'isomorphic-unfetch';
import styled from 'styled-components';
import Link from 'next/link';

import Item from '../reusable/Item';
import Input from '../reusable/Input';
import Checkmark from '../reusable/Checkmark';

const Items = ({ items }) => {
  const weaponTypes = items
    .reduce((types, weapon) => {
      if (!types.some(type => type === weapon.type)) {
        types.push(weapon.type);
      }
      return types;
    }, []);

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
        <ItemsContainer>
          <SearchFilters>
            <label>
              <H3>Name</H3>
              <Input
                placeholder="Weapon name..."
              />
            </label>
            <CategoryFilters>
              <H3>Category</H3>
              {weaponTypes.map(type => (
                <Checkmark
                  title={type}
                  key={type}                  
                />
              ))}
              
            </CategoryFilters>
          </SearchFilters>
          <div className={css.items__container}>
            {items.map(item =>
              <Item
                key={item.id}
                item={item}
              />
            )}
          </div>
        </ItemsContainer>
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
const ItemsContainer = styled.article`
  justify-content: space-between;
  display: flex;
`
const H3 = styled.h3`
  font-size: 12px;
  letter-spacing: 2px;
  margin: 0 0 10px 0;
  text-transform: uppercase;
`
const SearchFilters = styled.nav`
`
const CategoryFilters = styled.div`
  margin-top: 40px;
`

Items.getInitialProps = async () => {
  const data = await fetch('http://localhost:4000/items/weapons');
  const items = await data.json();
  return { items }
}

export default Items;