import css from './style.scss';
import { useState, useEffect, useRef } from 'react';
import { withRouter } from 'next/router';
import qs from 'querystringify';
import Link from 'next/link';
import { applyCss } from '../../helpers';

export const PaginationMenu = ({ links = [], page: active, pagesCount, url, href = '', }) => {
  const Button = page => {
    if (typeof page === 'string') {
      return (
        <li
          key={page}
          className={css.menu_item}
        >
          <span>...</span>
        </li>
      );
    }

    return (
      <li
        {...applyCss(
          css.menu_item,
          page === active && css.active
        )}
        key={page}
      >
        <Link href={href + page}>
          <a className={css.menu_link}>
            {page}
          </a>
        </Link>
      </li>
    );
  }

  return (
    <ul className={css.menu}>
      {links.map(Button)}
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
  href, pages,
  pagination = true,
  count, children, ...props
}) => {
  const container = useRef(null);

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
    <div
      className={css.container}
      ref={container}
    >
      <PaginationMenu
        links={buttons()}
        href={'/leaderboards?page='}
        pagesCount={pagesCount}
        page={page}
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