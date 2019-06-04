import React, { useState, useMemo, useEffect } from 'react';
import css from './style.scss';
import { weaponProps, STATIC } from '../../helpers';
import { withRouter } from 'next/router';
import qs from 'querystringify';
import { filterTruthyEntry, filterUnique } from '../../util';
import Head from 'next/head';
import axios from 'axios';

import Input from '../../reusable/Input';
import Checkmark from '../../reusable/Checkmark';
import Select from '../../reusable/Select';
import { SortDirection } from '../../reusable/SortDirection';
import { WeaponsGrid } from '../../components/WeaponsGrid';
import { MobileModal } from '../../components/MobileModal';

const initialUpdateKey = '00nametrue';

const sortProps = [
  ['name', 'Name'],
  ...weaponProps,
  ['ammoType', 'Ammo type']
];
const initialSort = 'name';

const initialSortProp = 'name';
const initialSortAsc = true;

const WeaponsPage = ({ items, router }) => {
  const [phrase, setPhrase] = useState('');
  const [sortProp, setSortProp] = useState(initialSortProp);
  const [sortAsc, setSortAsc] = useState(initialSortAsc);

  const ammoTypes = useMemo(() => 
    items.reduce((ammoTypes, item) => ({
      ...ammoTypes,
      [item.ammo.name]: item.ammo
    }), {})
  , [items]);

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

  const selectedWeaponTypeNames = useMemo(() => filterTruthyEntry(selectedWeaponTypes), [selectedWeaponTypes]);
  
  const [selectedAmmoTypes, setAmmoTypes] = useState(() =>
    items.reduce((types, weapon) => ({
      ...types,
      [weapon.ammo.name]: false
    }), {})
  );

  const selectedAmmoTypeNames = useMemo(filterTruthyEntry(selectedAmmoTypes), [selectedAmmoTypes]);

  const updateKey = phrase + selectedWeaponTypeNames.length + selectedAmmoTypeNames.length + sortProp + sortAsc;
  const appliedFilters = updateKey !== initialUpdateKey;

  const handleClearFilters = () => {
    if (!appliedFilters) {
      return;
    }
    setPhrase('');
    setSortProp(initialSortProp);
    setSortAsc(initialSortAsc);

    setWeaponTypes(selectedWeaponTypeNames
      .reduce((unselected, type) => ({
        ...unselected,
        [type]: false
      }), selectedWeaponTypes)
    );
    setAmmoTypes(selectedAmmoTypeNames
      .reduce((unselected, name) => ({
        ...unselected,
        [name]: false
      }), ammoTypes)
    );
  }

  const ammoTypeNames = useMemo(() => Object.keys(selectedAmmoTypes), []);
  const weaponTypeNames = useMemo(() => Object.keys(selectedWeaponTypes), []);

  const filteredWeapons = useMemo(() => items
    .filter(item =>
      item.name.toLowerCase().includes(phrase.toLowerCase())
    )
    .filter(item => selectedWeaponTypeNames.length
      ? selectedWeaponTypes[item.type]
      : true
    )
    .filter(item => selectedAmmoTypeNames.length
      ? selectedAmmoTypes[item.ammo.name]  
      : true
    )
    .sort((a, b) => {
      const sortDir = sortAsc ? 1 : -1;
      if (sortProp === 'name') {
        return (a[sortProp] > b[sortProp] ? 1 : -1) * sortDir;
      }
      if (sortProp === 'ammoType') {
        const indexA = ammoTypeNames.indexOf(a.ammo.name);
        const indexB = ammoTypeNames.indexOf(b.ammo.name);

        return (indexA > indexB ? 1 : -1) * sortDir;
      }
      return (a[sortProp] - b[sortProp]) * sortDir;
    })
  , [updateKey]);

  useEffect(() => {
    if (router.pathname === '/items') {
      const query = {};

      if (phrase.length) query.name = phrase;
      if (selectedAmmoTypeNames.length) query.ammo = selectedAmmoTypeNames;
      if (sortProp !== initialSortProp) query.sortBy = sortProp;
      if (sortAsc !== initialSortAsc) query.sortDesc = true;
      if (selectedWeaponTypeNames.length) query.category = selectedWeaponTypeNames;

      const href = '/items' + qs.stringify(query, true);
      const as = href;

      router.replace(href, as, { shallow: true });
    }
  }, [updateKey]);

  useEffect(() => {
    const { name, ammo, sortBy, sortDesc, category } = router.query;
    
    const timeoutId = setTimeout(() => {
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
      if (sortDesc != null && sortDesc !== initialSortAsc) setSortAsc(false);
    }, 150);

    return () => clearTimeout(timeoutId);
  }, []);

  const handleWeaponTypeChange = (weaponType) => (event) => {
    setWeaponTypes({
      ...weaponTypes,
      [weaponType]: event.target.checked
    });
  }

  const handleAmmoTypeChange = (ammoType) => (event) => {
    setAmmoTypes({
      ...selectedAmmoTypes,
      [ammoType]: event.target.checked
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
              value={phrase}
              onChange={e => setPhrase(e.target.value)}
            />
          </label>
          <div className={css.filters_section} data-testid="Items__category">
            <h3 className={css.h3}>Category</h3>
            {weaponTypeNames.map(type => (
              <Checkmark
                title={type}
                key={type}
                checked={selectedWeaponTypes[type]}
                onChange={handleWeaponTypeChange(type)}
              /> 
            ))}
          </div>
          <div className={css.filters_section} data-testid="Items__ammo">
            <h3 className={css.h3}>Ammo type</h3>
            {ammoTypeNames.map(type => (
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
                onChange={handleAmmoTypeChange(type)}
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
              onChange={e => setSortProp(e.target.value)}
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
              onChange={e => setSortAsc(e.target.checked)}
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

  const categories = data
    .map(item => item.type)
    .filter(filterUnique)
    .sort();

  return { items: data, categories };
}

export default withRouter(WeaponsPage);