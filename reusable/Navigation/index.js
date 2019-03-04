import css from './style.scss';
import { useState, useEffect, useRef } from 'react';
import { withRouter } from 'next/router';
import qs from 'querystringify';
import Link from 'next/link';

export const PaginationMenu = ({ links = [], page, pagesCount, url, href = '', }) => {
  return (
    <ul className={css.menu}>
      {links.map((p, index) => (
        <li
         className={`${css.menu_item} ${page === index + 1 && css.active}`}
         key={index}
        >
          <Link href={href + (index + 1)}>
            <a className={css.menu_link}>
              {index + 1}
            </a>
          </Link>
        </li>
      ))}
      <li className={css.menu_item}>
        <span>...</span>
      </li>
      <li className={`${css.menu_item} ${page === pagesCount && css.active}`}>
        <Link href={href + pagesCount}>
          <a className={css.menu_link}>
            {pagesCount}
          </a>
        </Link>
      </li>
    </ul>
  )
}

const Navigation = ({ router, page, pagesCount, count, children, ...props }) => {
  const [infMode, setInfMode] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const container = useRef(null);
  const renderBtns = pagesCount > 3 ? 3 : pagesCount;
  const url = `/leaderboards?page=${page}`;

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
    // observer.observe(container.current);
  }, []);

  const links = Array.from({ length: renderBtns });
  return (
    <div
      className={css.container}
      ref={container}
    >
      <PaginationMenu
        links={links}
        href={'/leaderboards?page='}
        pagesCount={pagesCount}
        page={page}
      />
      {children}
      <PaginationMenu
        links={links}
        href={'/leaderboards?page='}
        pagesCount={pagesCount}
      />
    </div>
  )
}

const NavWithRouter = withRouter(Navigation);

export { NavWithRouter as Navigation };