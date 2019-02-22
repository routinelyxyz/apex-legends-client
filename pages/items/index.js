import { useState, useMemo, useEffect } from 'react';
import css from './style.scss';
import fetch from 'isomorphic-unfetch';
import styled from 'styled-components';
import Link from 'next/link';
import { useTransition, animated } from 'react-spring';
import { weaponProps, STATIC } from '../../helpers';
import { Router, withRouter } from 'next/router';
import qs from 'querystringify';
import { debounce } from '../../util';

import Item from '../../reusable/Item';
import Input from '../../reusable/Input';
import Checkmark from '../../reusable/Checkmark';
import Select from '../../reusable/Select';
import { SortDirection } from '../../reusable/SortDirection';

const debounceA = debounce(500);
const sortProps = [
  ['name', 'Name'],
  ...weaponProps
];
const initialSort = 'name';

const Items = ({ items, router }) => {
  const [phrase, setPhrase] = useState('');
  const [sortDir, setSortDir] = useState(1);
  const [sortProp, setSortProp] = useState('name');

  const ammoTypes = useMemo(() => items
    .reduce((ammoTypes, item) => ({
      ...ammoTypes,
      [item.ammo.name]: item.ammo
    }), {})
  , [items]);

  const [selectedTypes, setTypes] = useState(() =>
    items.reduce((types, weapon) => ({
      ...types,
      [weapon.type]: false
    }), {})
  );

  const [selectedAmmoTypes, setAmmoTypes] = useState(() =>
    items.reduce((types, weapon) => ({
      ...types,
      [weapon.ammoType]: false
    }), {})
  );

  const selectedAmmoTypes2 = useMemo(() => 
    Object
      .entries(selectedAmmoTypes)
      .filter(([prop, val]) => val)
      .map(([prop]) => prop)
  , [selectedAmmoTypes]);
  
  // memoize it to prevent re-running useEffect
  const selectedTypesArray = Object.values(selectedTypes)
    .filter(val => val === true);

  const selectedAmmoTypesCount = Object.values(selectedAmmoTypes)
    .filter(val => val === true).length;

  const filteredWeapons = items
    .filter(item =>
      item.name.toLowerCase().includes(phrase.toLowerCase())
    )
    .filter(item => selectedTypesArray.length > 0
        ? selectedTypes[item.type]
        : true
    )
    .filter(item => selectedAmmoTypesCount > 0
      ? selectedAmmoTypes[item.ammoType]  
      : true
    )
    .sort((a, b) => 
      +(a[sortProp] > b[sortProp]) * sortDir
    );

  useEffect(() => {
    if (router.pathname !== '/items') return;
    debounceA(() => {
        const query = {};
  
        if (!phrase.length) delete query.name;
        else query.name = phrase;
        if (selectedAmmoTypes2.length) query.ammo = selectedAmmoTypes2;
        if (sortProp !== 'name') query.sortBy = sortProp;
        if (sortDir !== 1) query.sortDir = sortDir;
  
        const href = '/items' + qs.stringify(query, true);
        const as = href;
  
        router.push(href, as, { shallow: true });
    });
  }, [phrase, sortDir, sortProp, selectedAmmoTypes2]);

  useEffect(() => {
    const { name, ammo, sortBy, sortDir } = router.query;
    
    if (name) setPhrase(name);
    if (ammo) setAmmoTypes(ammo.split(',')
      .reduce((updatedTypes, type) => ({
        ...updatedTypes,
        [type]: true
      }), { ...selectedAmmoTypes })
    );
    if (sortBy != null && sortBy !== initialSort) setSortProp(sortBy);
    if (sortDir != null && sortDir !== 1) setSortDir(sortDir);

  }, []);

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
          <CategoryFilters>
            <H3>Ammo type</H3>
            {Object.keys(selectedAmmoTypes).map(type => (
              <Checkmark
                content={
                  <div className={`${css.ammo_checkmark}`}>
                    <img
                      className={`${css.ammo_icon} ${selectedAmmoTypes[type] && css.ammo_icon__checked}`}
                      src={STATIC + ammoTypes[type].img}
                    />
                    <span>{type}</span>
                  </div>
                }
                key={type}
                value={selectedAmmoTypes[type]}
                onChange={e => setAmmoTypes({
                  ...selectedAmmoTypes,
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
              <Link
                key={key}
                href={`/items/weapon?slug=${item.slug}`}
                as={`/items/weapon/${item.slug}`}
                passHref
              >
                <Item
                  item={item}
                  style={props}
                />
              </Link>
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

// export default Items;
export default withRouter(Items);