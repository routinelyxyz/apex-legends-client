import css from './style.scss';
import { useRef } from 'react';
import { withRouter } from 'next/router';
import Link from 'next/link';
import { applyCss } from '../../helpers';

export const PaginationMenu = ({
  page: activePage,
  pages: pagesCount,
  href = p => '?activePage=' + p
}) => {

  const buttons = useMemo(() => {

    if (pagesCount <= 5) {
      return Array
        .from({ length: pagesCount })
        .map((_, index) => index + 1);
    }

    function getPagesArray(activePage, pagesCount) {
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

const Navigation = ({
  page,
  pages,
  href,
  children
}) => {
  const container = useRef(null);

  return (
    <div
      className={css.container}
      ref={container}
    >
      {children}
      <PaginationMenu
        page={page}
        pages={pages}
        href={href}
      />
    </div>
  )
}

const NavWithRouter = withRouter(Navigation);

export { NavWithRouter as Navigation };