import React, { useMemo, useEffect, useReducer } from 'react';
import css from './style.scss';
import { weaponPropsArr, applyCss } from '../../helpers';
import { withRouter, RouterProps } from 'next/router';
import qs from 'querystringify';
import { debounce } from '../../util';
import Head from 'next/head';
import axios from 'axios';
import { Weapons, WeaponSortProp } from '../../types';
import { STATIC } from '../../helpers/consts';
import { weaponsReducer, initWeaponsReducer, weaponsFilter, initialState } from './reducer';

import { BasicInput } from '../../reusable/Input';
import { Checkmark } from '../../reusable/Checkmark';
import { Select } from '../../reusable/Select';
import { SortDirection } from '../../reusable/SortDirection';
import { WeaponsGrid } from '../../components/WeaponsGrid';
import { MobileModal } from '../../components/MobileModal';

const debounceA = debounce(500);
const initialUpdateKey = 'truename00';
const sortProps = [
  ['name', 'Name'],
  ...weaponPropsArr.map(({ prop, title }) => [prop, title]),
  ['ammoType', 'Ammo type']
] as [string, string][];


interface WeaponsPageProps {
  items: Weapons
  router: RouterProps<QueryParams>
}
const WeaponsPage = ({ items, router }: WeaponsPageProps) => {
  const { query } = router;
  const [state, dispatch] = useReducer(
    weaponsReducer,
    { items, query },
    initWeaponsReducer
  );
  const {
    filteredWeapons,
    selectedCategoryNames,
    selectedAmmoTypeNames
  } = useMemo(() => weaponsFilter(state), [state]);
  
  const updateKey = state.phrase +
    state.sortAsc +
    state.sortBy +
    selectedCategoryNames.length +
    selectedAmmoTypeNames.length;

  const areFiltersApplied = updateKey !== initialUpdateKey;

  useEffect(() => {
    const query: any = {};

    if (state.phrase.length) query.name = state.phrase;
    if (state.sortBy !== initialState.sortBy) query.sortBy = state.sortBy;
    if (state.sortAsc !== initialState.sortAsc) query.sortDesc = state.sortAsc;
    if (selectedCategoryNames.length) query.category = selectedCategoryNames;
    if (selectedAmmoTypeNames.length) query.ammo = selectedAmmoTypeNames;

    const href = '/items' + qs.stringify(query, true);
    const as = href;

    const timeout = debounceA(() => handleQueryUpdate(href, as));

    return () => clearTimeout(timeout);
  }, [updateKey]);

  function handleQueryUpdate(href: string, as: string) {
    if (router.pathname === '/items' && areFiltersApplied) {
      router.replace(href, as, { shallow: true });
    }
  }

  const handleCategoryToggle = (categoryName: string) => {
    dispatch({
      type: 'TOGGLE_CATEGORY',
      payload: categoryName
    });
  }

  const handleAmmoTypeToggle = (ammoTypeName: string) => {
    dispatch({
      type: 'TOGGLE_AMMO_TYPE',
      payload: ammoTypeName
    });
  }

  const handlePhraseUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: 'UPDATE_PHRASE',
      payload: event.target.value
    });
  }

  const handleSortByUpdate = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({
      type: 'UPDATE_SORT_BY',
      payload: event.target.value as WeaponSortProp
    });
  }

  const handleOrderToggle = () => {
    dispatch({ type: 'TOGGLE_ORDER' });
  }

  return (
    <article className={css.container}>
      <Head>
        <title>Weapons explorer | Apex-Legends.win</title>
      </Head>
      <MobileModal title={'Show filters ' + (areFiltersApplied ? '' : '(*)')}>
        <nav className={css.search_filters}>
          <label className={css.filters_searcher} data-testid="Items__input">
            <h3 className={css.h3}>Name</h3>
            <BasicInput
              placeholder="Weapon name..."
              value={state.phrase}
              onChange={handlePhraseUpdate}
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
                body={(
                  <div className={css.ammo_checkmark}>
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
              onChange={handleSortByUpdate}
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
              onChange={handleOrderToggle}
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
  return { items: data };
}

export default withRouter(WeaponsPage);

export interface QueryParams {
  name?: string
  sortBy?: WeaponSortProp
  sortDesc?: boolean
  ammo?: string,
  category?: string
}