import css from './style.scss';
import { useState, useEffect, useRef } from 'react';
import { withRouter } from 'next/router';
import qs from 'querystringify';
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
            <span>...</span>
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

/*
const handle = entries => {
  const ratio = entries[0].intersectionRatio;

  if (isFetching) return;


  if (ratio >= 0.8) {
    setIsFetching(true);
    
    const href = '/leaderboards' + qs.stringify({ page: Number(page) + 1 }, true);
    const as = href;
    router.replace(href, as, { shallow: false });

    setIsFetching(false);
  }
}


useEffect(() => {
  const observer = new IntersectionObserver(handle, {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  });
  observer.observe(container.current);
}, []);
*/

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
      <PaginationMenu
        page={page}
        pages={pages}
        href={href}
      />
      {children}
      {/* <PaginationMenu
        links={links}
        href={'/leaderboards?page='}
        pagesCount={pagesCount}
      /> */}
    </div>
  )
}

const NavWithRouter = withRouter(Navigation);

export { NavWithRouter as Navigation };