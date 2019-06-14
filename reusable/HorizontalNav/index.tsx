import css from './style.scss';
import React, { useState } from 'react';
import { applyCss } from '../../util';
import Link from 'next/link';
import { withRouter } from 'next/router';

export const StaticLink = ({ active, title, ...linkProps }) => {
  <Link
    {...linkProps}
  >
    <a
      {...applyCss(
        css.link,
        active(router.route) && css.active
      )}
    >
      {title}
    </a>
  </Link>
}

const HorizontalNav2 = ({ className, children, links, router }) => (
  <nav
    {...applyCss(
      css.nav_container,
      className
    )}
  >
    <ul className={css.nav_list}>
      {children && React.Children.map(children, (LinkComp, index) =>
        <LinkComp key={index}/>
      )}
      {links && links.map(({ title, active, dynamic, ...linkProps }, index) => (
        <li key={index}>
          <Link
            {...linkProps}
            {...dynamic(router)}
          >
            <a {...applyCss(css.link, active(router.route) && css.active)}>
              {title}
            </a>
          </Link>
        </li>
      ))}
    </ul>
  </nav>
)

interface HorizontalNavTabProps {
  tabs: {
    title: string
    content: JSX.Element
  }[]
  className?: string
  navCss?: string
  withMargin?: boolean
  children: (tab: JSX.Element) => JSX.Element
}

export const HorizontalNavTab = ({
  tabs,
  className,
  navCss,
  withMargin,
  children = (tab) => tab
}: HorizontalNavTabProps) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className={className}>
      <ul
        {...applyCss(
          css.nav_list,
          navCss,
          withMargin && css.margin
        )}
      >
        {tabs.map((tab, index) => (
          <li
            {...applyCss(
              css.link,
              activeTab === index && css.active
            )}
            onClick={() => setActiveTab(index)}
            key={index}
          >
            {tab.title}
          </li>
        ))}
      </ul>
      {children(tabs[activeTab].content)}
    </div>
  );
}

const NavWithRouter = withRouter(HorizontalNav2);

export { NavWithRouter as HorizontalNav2 };