import React, { useState, useMemo, useEffect, useRef, useReducer } from 'react';
import css from './style.scss';
import fetch from 'isomorphic-unfetch';
import Link from 'next/link';
import { useTransition } from 'react-spring';
import { weaponProps, STATIC, applyCss } from '../../helpers';
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

const initialSortProp = 'name';
const initialSortAsc = true;

const WeaponsPage = ({ items, router }) => {
  const [state, dispatch] = useReducer(weaponsReducer, items, initWeaponsReducer);

  const {
    filteredWeapons
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
    const {
      name: phrase = '',
      sortBy = initialState.sortBy,
      sortDesc: sortAsc = initialState.sortAsc,
      ammo = '',
      category = ''
    } = router.query;

    const timeoutId = setTimeout(() => {
      dispatch({
        type: 'LOAD_FILTERS',
        payload: {
          phrase,
          categoryNames: category.split(','),
          ammoTypeNames: ammo.split(','),
          sortAsc,
          sortBy
        }
      });
    }, 150);

    return () => clearTimeout(timeoutId);
  }, []);

  const handleCategoryToggle = (categoryName) => {
    dispatch({
      type: 'TOGGLE_CATEGORY',
      payload: categoryName
    });
  }

  const handleAmmoTypeToggle = (ammoTypeName) => {
    dispatch({
      type: 'TOGGLE_AMMO_TYPE',
      payload: ammoTypeName
    });
  }

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
              value={state.phrase}
              onChange={e => dispatch({
                type: 'UPDATE_PHRASE',
                payload: e.target.value
              })}
            />
          </label>
          <div className={css.filters_section} data-testid="Items__category">
            <h3 className={css.h3}>Category</h3>
            {state.categories.map(category => (
              <Checkmark
                title={category.name}
                key={category.name}
                checked={category.selected}
                onChange={() => handleCategoryToggle(category.name)}
              />
            ))}
          </div>
          <div className={css.filters_section} data-testid="Items__ammo">
            <h3 className={css.h3}>Ammo type</h3>
            {state.ammoTypes.map(ammoType => (
              <Checkmark
                content={(
                  <div className={`${css.ammo_checkmark}`}>
                    <img
                      {...applyCss(
                        css.ammo_icon,
                        ammoType.selected && css.ammo_icon__checked
                      )}
                      src={STATIC + ammoType.img}
                    />
                    <span>{ammoType.name}</span>
                  </div>
                )}
                key={ammoType.name}
                checked={ammoType.selected}
                onChange={() => handleAmmoTypeToggle(ammoType.name)}
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
              value={state.sortBy}
              active={state.sortBy !== initialState.sortBy}
              onChange={e => dispatch({
                type: 'UPDATE_SORT_BY',
                payload: e.target.value
              })}
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
              checked={state.sortAsc}
              onChange={e => dispatch({
                type: 'TOGGLE_ORDER',
                payload: e.target.checked
              })}
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