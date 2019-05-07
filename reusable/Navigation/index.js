import css from './style.scss';
import { useRef } from 'react';
import { withRouter } from 'next/router';
import Link from 'next/link';
import { applyCss } from '../../helpers';

export const PaginationMenu = ({ page, pages, href = p => '?page=' + p }) => {

  const buttons = () => {
    if (pages <= 5) return Array
      .from({ length: pages })
      .map((_, index) => index + 1);

    const btns = pages - 3 >= page
      ? page === 1
        ? [page , page + 1, page + 2, pages]
        : [page - 1, page, page + 1, pages]
      : [1, pages - 2, pages - 1, pages];

    page / pages <= 0.5
      ? btns.splice(btns.length - 1, 0, '...')
      : btns.splice(1, 0, '...');

    return btns;
  }

  return (
    <ul className={css.menu}>
      {buttons().map(button => (
        typeof button === 'string'
        ? <li
            key={button}
            className={css.menu_item}
          >
            <span>{button}</span>
          </li>
        : <li
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
      ))}
    </ul>
  );
}

const Navigation = ({
  router, page, pagesCount,
  isFetching,
  pages,
  pagination = true,
  href,
  count, children, ...props
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