import React, { useState, ReactNode } from 'react';
import css from './style.scss';
import { applyCss } from '../../util';

interface HorizontalNavTabProps {
  tabs: {
    title: string
    content: ReactNode
  }[]
  className?: string
  navCss?: string
  withMargin?: boolean
  children?: (tab: ReactNode) => ReactNode
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