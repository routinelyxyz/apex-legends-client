import { useState } from 'react';
import css from './style.scss';
import fetch from 'isomorphic-unfetch';
import styled from 'styled-components';
import Link from 'next/link';
import { useTransition, animated } from 'react-spring';

import Item from '../../reusable/Item';
import Input from '../../reusable/Input';
import Checkmark from '../../reusable/Checkmark';
import Select from '../../reusable/Select';
import { SortDirection } from '../../reusable/SortDirection';

const sortProps = [
  ['bodyDamage', 'Body damage'],
  ['headshotDamage', 'Headshot damage'],
  ['bodyDPS', 'Body DPS'],
  ['headshotDPS', 'Headshot DPS'],
  ['reload', 'Reload time'],
  ['emptyReload', 'Empty reload time'],
  ['magazine', 'Magazine size']
];

const Items = ({ items }) => {
  const [phrase, setPhrase] = useState('');
  const [sortDir, setSortDir] = useState(1);
  const [sortProp, setSortProp] = useState('');
  const [selectedTypes, setTypes] = useState(
    items.reduce((types, weapon) => ({
      ...types,
      [weapon.type]: false
    }), {})
  );

  const selectedTypesCount = Object.values(selectedTypes)
    .filter(val => val === true).length;

  const filteredWeapons = items
    .filter(item =>
      item.name.toLowerCase().includes(phrase.toLowerCase())
    )
    .filter(item => selectedTypesCount > 0
        ? selectedTypes[item.type]
        : true
    )
    .sort((a, b) => 
      +(a[sortProp] > b[sortProp]) * sortDir
    );

  const transitions = useTransition(filteredWeapons, item => item.id, {
    from: { opacity: 0, transform: 'scale(0)' },
    enter: { opacity: 1, transform: 'scale(1)' },
    leave: { position: 'absolute', transform: 'scale(0)', opacity: 0 }
  });

  return (
    <div>
      <SubMenu>
        <Link href="/items" passHref>
          <NavLink active>Weapons</NavLink>
        </Link>
        <Link href="/items/attachments" passHref>
          <NavLink>Attachments</NavLink>
        </Link>
      </SubMenu>
      <ItemsContainer>
        <SearchFilters>
          <label>
            <H3>Name</H3>
            <Input
              placeholder="Weapon name..."
              value={phrase}
              onChange={e => setPhrase(e.target.value)}
            />
          </label>
          <CategoryFilters>
            <H3>Category</H3>
            {Object.keys(selectedTypes).map(type => (
              <Checkmark
                title={type}
                key={type}
                value={selectedTypes[type]}
                onChange={e => setTypes({
                  ...selectedTypes,
                  [type]: e.target.checked
                })}
              /> 
            ))}
          </CategoryFilters>
        </SearchFilters>
        <div className={css.items__wrapper}>
          <div className={css.sort__container}>
            <H3 margin={'0 10px 0 0'}>
              Sort By
            </H3>
            <Select
              value={sortProp}
              onChange={e => setSortProp(
                e.target.value
              )}
            >
              {sortProps.map(([prop, title]) => (
                <option value={prop} key={prop}>
                  {title}
                </option>
              ))}
            </Select>
            <H3 margin={'0 10px 0 40px'}>
              Direction
            </H3>
            <SortDirection
              value={sortDir}
              onChange={e => setSortDir(
                e.target.checked ? 1 : -1
              )}
            />
          </div>
          <div className={css.items__container}>
            {transitions.map(({ item, props, key }) =>
              <Item
                key={key}
                item={item}
                style={props}
              />
            )}
          </div>
        </div>
      </ItemsContainer>
    </div>
  )
};

const SubMenu = styled.nav`
  margin: 25px 0 100px 0;
`
const NavLink = styled.a`
  margin-right: 35px;
  font-size: 18px;
  color: ${props => props.active ? '#fff' : 'rgb(99, 99, 134)'};
  position: relative;
  padding: 20px;
  &:hover {
    color: #fff;
  }
  &:before {
    content: ${props => props.active ? "''" : ''};
    height: 100%;
    width: 100%;
    position: absolute;
    background: radial-gradient(
      #8289ff 0, transparent 80%
    ) no-repeat;
    background-position-y: 20px;
    left: 0;
    bottom: -10px;
    opacity: .15;
  }
  &:after {
    content: ${props => props.active ? "''" : ''};
    height: 3px;
    width: 100%;
    border-radius: 8px;
    background: #6770FA;
    position: absolute;
    left: 0;
    bottom: -10px;
    /* box-shadow: 0 0 10px 5px #6770FA; */
  }
`
const ItemsContainer = styled.article`
  justify-content: space-between;
  display: flex;
`
const H3 = styled.h3`
  font-size: 12px;
  letter-spacing: 2px;
  margin: ${props => props.margin ? props.margin : '0 0 10px 0'};
  text-transform: uppercase;
`
const SearchFilters = styled.nav`
  margin-right: 20px;
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