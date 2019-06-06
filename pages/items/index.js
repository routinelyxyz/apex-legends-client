import React, { useState, useMemo, useEffect, useRef, useReducer } from 'react';
import css from './style.scss';
import fetch from 'isomorphic-unfetch';
import Link from 'next/link';
import { useTransition } from 'react-spring';
import { weaponProps, STATIC } from '../../helpers';
import { withRouter } from 'next/router';
import qs from 'querystringify';
import {
  debounce, useDebounce, useDispatch, filterUnique,
  reduceToObjectProps
} from '../../util';
import Head from 'next/head';
import axios from 'axios';
import { weaponsReducer, initialState, initWeaponsReducer, weaponsFilter } from '../../store/hooks-reducers/weapon-filters';

import Item from '../../reusable/Item';
import Input from '../../reusable/Input';
import Checkmark from '../../reusable/Checkmark';
import Select from '../../reusable/Select';
import { SortDirection } from '../../reusable/SortDirection';
import { WeaponsGrid } from '../../components/WeaponsGrid';
import { MobileModal } from '../../components/MobileModal';
import { BasicButton } from '../../reusable/BasicButton';

const initialUpdateKey = '00nametrue';

const sortProps = [
  ['name', 'Name'],
  ...weaponProps,
  ['ammoType', 'Ammo type']
];
const initialSort = 'name';

const initialSortProp = 'name';
const initialSortAsc = true;

const WeaponsPage = ({ items, router, ammoTypes: newAmmoTypes, categories }) => {
  const [state, dispatch] = useReducer(weaponsReducer, initialState, initWeaponsReducer(items));
  // dispatch({ type: 'LOAD_ITEMS', payload: items });

  const {
    filteredWeapons,
    selectedAmmoTypeNames,
    selectedCategoryNames
  } = useMemo(() => weaponsFilter(state), [state]);

  const updateKey = phrase + selectedTypeNames.length + selectedAmmoNames.length + sortProp + sortAsc;
  const appliedFilters = updateKey !== initialUpdateKey;
  const areFiltersApplied = updateKey !== initialUpdateKey;

  useEffect(() => {
    if (router.pathname === '/items') {
      const query = {};

      if (phrase.length) query.name = phrase;
      if (selectedAmmoNames.length) query.ammo = selectedAmmoNames;
      if (sortProp !== initialSortProp) query.sortBy = sortProp;
      if (sortAsc !== initialSortAsc) query.sortDesc = true;
      if (selectedTypeNames.length) query.category = selectedTypeNames;

      const href = '/items' + qs.stringify(query, true);
      const as = href;

      router.replace(href, as, { shallow: true });
    }
  }, [updateKey]);

  useEffect(() => {
    const { name, ammo, sortBy, sortDesc, category } = router.query;
    
    const timeoutId = setTimeout(() => {
      if (name) setPhrase(name);
      if (ammo) setSelectedAmmoTypes(
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
      if (sortDesc != null && sortDesc !== initialSortAsc) setSortAsc(false);
    }, 150);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <article className={css.container}>
      <Head>
        <title>Weapons explorer | Apex-Legends.win</title>
      </Head>
      <MobileModal title={'Show filters ' + (updateKey === initialUpdateKey ? '' : '(*)')}>
        <nav className={css.search_filters}>
          <label className={css.filters_searcher} data-testid="Items__input">
            <h3 className={css.h3}>Name</h3>
            <Input
              placeholder="Weapon name..."
              value={phrase}
              onChange={e => setPhrase(e.target.value)}
            />
          </label>
          <div className={css.filters_section} data-testid="Items__category">
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
          <div className={css.filters_section} data-testid="Items__ammo">
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
      </MobileModal>
      <div className={css.items_wrapper}>
        <div className={css.sort_container}>
          <div className={css.sort_item}>
            <h3 className={css.h3}>
              Sort By
            </h3>
            <Select
              value={sortProp}
              active={sortProp !== initialSortProp}
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
              checked={sortAsc}
              onChange={e => setSortAsc(
                e.target.checked
              )}
            />
          </div>
        </div>
        <WeaponsGrid 
          items={filteredWeapons}
          flipKey={updateKey}
        />
      </div>
    </article>
  )
};

WeaponsPage.getInitialProps = async () => {
  const { data: { data }} = await axios.get('/items/weapons');

  const ammoTypes = data
    .map(item => item.ammo.name)
    .filter(filterUnique);

  return { items: data, ammoTypes, categories };
}

export default withRouter(WeaponsPage);