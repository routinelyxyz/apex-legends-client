import React, { ReactNode } from 'react';
import css from './style.scss';
import { useMemo } from 'react';
import Link from 'next/link';
import { applyCss } from '../../helpers';

interface PaginationMenuProps {
  activePage: number
  pagesCount: number
  href: (page: number) => string
}
export const PaginationMenu = ({
  activePage,
  pagesCount,
  href = p => '?activePage=' + p
}: PaginationMenuProps) => {

  const buttons = useMemo<(number|string)[]>(() => {

    if (pagesCount <= 5) {
      return Array
        .from({ length: pagesCount })
        .map((_, index) => index + 1);
    }

    function getPagesArray(activePage: number, pagesCount: number) {
      if (pagesCount - 3 >= activePage) {
        if (activePage === 1) {
          return [activePage , activePage + 1, activePage + 2, pagesCount];
        }
        return [activePage - 1, activePage, activePage + 1, pagesCount];
      }
      return [1, pagesCount - 2, pagesCount - 1, pagesCount];
    }

    const pagesArray = getPagesArray(activePage, pagesCount);
    const isBelowOrEqHalf = activePage / pagesCount <= 0.5;

    if (isBelowOrEqHalf) {
      return pagesArray.splice(pagesArray.length - 1, 0, '...');
    }
    return pagesArray.splice(1, 0, '...');
  }, [activePage, pagesCount]);

  return (
    <ul className={css.menu}>
      {buttons.map(button => (
        typeof button === 'string' ? (
          <li
            key={button}
            className={css.menu_item}
          >
            <span>{button}</span>
          </li>
        ) : (
          <li
            key={button}
            {...applyCss(
              css.menu_item,
              button === activePage && css.active
            )}
          >
            <Link href={href(button)}>
              <a className={css.menu_link}>
                {button}
              </a>
            </Link>
          </li>
        )
      ))}
    </ul>
  );
}

interface NavigationProps extends PaginationMenuProps {
  menuBottom?: boolean
  menuTop?: boolean
  children?: ReactNode
}
export const Navigation = ({
  menuBottom = true,
  menuTop,
  children,
  ...menuProps
}: NavigationProps) => (
  <div className={css.container}>
    {menuTop && <PaginationMenu {...menuProps} />}
    {children}
    {menuBottom && <PaginationMenu {...menuProps} />}
  </div>
);