import React, { useState, useMemo, useEffect, useRef } from 'react';
import css from './style.scss';
import fetch from 'isomorphic-unfetch';
import Link from 'next/link';
import { useTransition } from 'react-spring';
import { weaponProps, STATIC } from '../../helpers';
import { withRouter } from 'next/router';
import qs from 'querystringify';
import { debounce, useDebounce } from '../../util';

import Item from '../../reusable/Item';
import Input from '../../reusable/Input';
import Checkmark from '../../reusable/Checkmark';
import Select from '../../reusable/Select';
import { SortDirection } from '../../reusable/SortDirection';
import { WeaponsGrid } from '../../components/WeaponsGrid';

const debounceA = debounce(500);
const [debounceB, timeoutB] = useDebounce(500);
const sortProps = [
  ['name', 'Name'],
  ...weaponProps
];
const initialSort = 'name';

const Items = ({ items, router }) => {
  const [phrase, setPhrase] = useState('');
  const [sortDir, setSortDir] = useState(1);
  const [sortProp, setSortProp] = useState('name');

  const ammoTypes = useMemo(() => 
    items.reduce((ammoTypes, item) => ({
      ...ammoTypes,
      [item.ammo.name]: item.ammo
    }), {})
  , [items]);

  // const ammTypes = useMemo(() =>
  //   Object.values(items
  //     .reduce((ammoTypes, item) => ({
  //       ...ammoTypes,
  //       [item.ammo.name]: item.ammo
  //     }), {})
  //   )
  // , [items]);

  const weaponTypes = useMemo(() => items
    .reduce((weaponTypes, weapon) => [
      ...weaponTypes,
      ...weaponTypes.includes(weapon.type)
        ? []
        : [weapon.type]
    ], [])
  , [items]);

  const [selectedWeaponTypes, setWeaponTypes] = useState(() =>
    weaponTypes.reduce((selected, type) => ({
      ...selected,
      [type]: false
    }), {})
  );

  const selectedTypeNames = useMemo(() => 
    Object.entries(selectedWeaponTypes)
      .filter(([prop, val]) => val)
      .map(([prop]) => prop)
  , [selectedWeaponTypes]);

  
  const [selectedAmmoTypes, setAmmoTypes] = useState(() =>
    items.reduce((types, weapon) => ({
      ...types,
      [weapon.ammo.name]: false
    }), {})
  );

  const selectedAmmoNames = useMemo(() => 
    Object
      .entries(selectedAmmoTypes)
      .filter(([prop, val]) => val)
      .map(([prop]) => prop)
  , [selectedAmmoTypes]);


  const filteredWeapons = items
    .filter(item =>
      item.name.toLowerCase().includes(phrase.toLowerCase())
    )
    .filter(item => selectedTypeNames.length
      ? selectedWeaponTypes[item.type]
      : true
    )
    .filter(item => selectedAmmoNames.length
      ? selectedAmmoTypes[item.ammo.name]  
      : true
    )
    .sort((a, b) => 
      +(a[sortProp] > b[sortProp]) * sortDir
    );

  useEffect(() => {
    // Redirects even if router is on other page
    if (router.pathname === '/items') {
      const query = {};

      if (!phrase.length) delete query.name;
      else query.name = phrase;
      if (selectedAmmoNames.length) query.ammo = selectedAmmoNames;
      if (sortProp !== 'name') query.sortBy = sortProp;
      if (sortDir !== 1) query.sortDir = sortDir;
      if (selectedTypeNames.length) query.category = selectedTypeNames;

      const href = '/items' + qs.stringify(query, true);
      const as = href;
      
      router.replace(href, as, { shallow: true });
    }
  }, [phrase, sortDir, sortProp, selectedAmmoNames.length, selectedTypeNames.length]);

  useEffect(() => {
    const handleRouteChange = url => {
      if (
        url !== '/items' ||
        !url.includes('/items?')
      ) {
        clearTimeout(timeoutB);
      }
    }
    router.events.on('routeChangeStart', handleRouteChange)
    return () => router.events.off('routeChangeStart', handleRouteChange)
  }, []);

  useEffect(() => {
    const { name, ammo, sortBy, sortDir, category } = router.query;
    
    if (name) setPhrase(name);
    if (ammo) setAmmoTypes(
      ammo
        .split(',')
        .reduce((updatedTypes, type) => ({
          ...updatedTypes,
          [type]: true
        }), selectedAmmoTypes)
    );
    if (category) setWeaponTypes(
      category
        .split(',')
        .reduce((updatedCats, category) => ({
          ...updatedCats,
          [category]: true
        }), selectedWeaponTypes)
    )
    if (sortBy != null && sortBy !== initialSort) setSortProp(sortBy);
    if (sortDir != null && sortDir !== 1) setSortDir(sortDir);

  }, []);

  return (
    <article className={css.container}>
      <nav className={css.search_filters}>
        <label className={css.filters_searcher}>
          <h3 className={css.h3}>Name</h3>
          <Input
            placeholder="Weapon name..."
            value={phrase}
            onChange={e => setPhrase(e.target.value)}
          />
        </label>
        <div className={css.filters_section}>
          <h3 className={css.h3}>Category</h3>
          {Object.keys(selectedWeaponTypes).map(type => (
            <Checkmark
              title={type}
              key={type}
              checked={selectedWeaponTypes[type]}
              onChange={e => setWeaponTypes({
                ...selectedWeaponTypes,
                [type]: e.target.checked
              })}
            /> 
          ))}
        </div>
        <div className={css.filters_section}>
          <h3 className={css.h3}>Ammo type</h3>
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
              checked={selectedAmmoTypes[type]}
              onChange={e => setAmmoTypes({
                ...selectedAmmoTypes,
                [type]: e.target.checked
              })}
            />
          ))}
        </div>
      </nav>
      <div className={css.items_wrapper}>
        <div className={css.sort_container}>
          <div className={css.sort_item}>
            <h3 className={css.h3}>
              Sort By
            </h3>
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
          </div>
          <div className={css.sort_item}>
            <h3 className={css.h3}>
              Direction
            </h3>
            <SortDirection
              value={sortDir}
              onChange={e => setSortDir(
                e.target.checked ? 1 : -1
              )}
            />
          </div>
        </div>
        <WeaponsGrid items={filteredWeapons}/>
      </div>
    </article>
  )
};

Items.getInitialProps = async () => {
  const data = await fetch('http://localhost:4000/items/weapons');
  const items = await data.json();
  return { items }
}

export default withRouter(Items);