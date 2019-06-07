import css from './style.scss';
import { useRef } from 'react';
import { withRouter } from 'next/router';
import Link from 'next/link';
import { applyCss } from '../../helpers';

export const PaginationMenu = ({ page, pages, href = p => '?page=' + p }) => {

  const buttons = useMemo(() => {

    if (pages <= 5) {
      return Array
        .from({ length: pages })
        .map((_, index) => index + 1);
    }

    function getPagesArray(page, pages) {
      if (pages - 3 >= page) {
        if (page === 1) {
          return [page , page + 1, page + 2, pages];
        }
        return [page - 1, page, page + 1, pages];
      }
      return [1, pages - 2, pages - 1, pages];
    }

    const pagesArray = getPagesArray(page, pages);
    const isBelowOrEqHalf = page / pages <= 0.5;

    if (isBelowOrEqHalf) {
      return pagesArray.splice(pagesArray.length - 1, 0, '...');
    }
    return pagesArray.splice(1, 0, '...');
    
  }, [page, pages]);

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
              button === page && css.active
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