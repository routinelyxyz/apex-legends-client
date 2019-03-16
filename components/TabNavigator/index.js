import css from './style.scss';
import { useState } from 'react';
import { flatMapTree } from '../../util';
import { useTransition, animated } from 'react-spring';

export const TabNavigator = ({ pages = [], header }) => {
  const homePath = pages && pages[0].id;

  const [router, setRouter] = useState([homePath, homePath]);
  const [prevPage, currentPage] = router;

  const flattened = flatMapTree(pages);

  const [transform, setTransform] = useState([
    'translate3d(100%,0,0)',
    'translate3d(0%,0,0)',
    'translate3d(0%,0,0)'
  ]);


  const normalized = pages
    .reduce((pages, page) => {

      const flattenPage = (id, pagesData) => {
        let url = id;

        pagesData.forEach(pageData => {
          if (id !== pageData.id) {
            url += '/' + pageData.id;
          }
          const { children = [], ...page } = pageData;
          pages[url] = page;

          if (children.length) flattenPage(page.id, children);

        });
      }

      flattenPage(page.id, [page]);
      
      return pages;
    }, {});

  const activePage = normalized[currentPage] //flattened[active];


  const goTo = path => {
    setRouter(([prev, current = homePath]) => [current, path]);
  }

  const goBack = () => {
    if (currentPage === homePath) {

    }
    setTransform([...transform].reverse());
    setRouter([currentPage, prevPage]);
  }

  const transitions = useTransition(currentPage, null, {
    from: { opacity: 1, transform: transform[0] },
    enter: { opacity: 1, transform: transform[1] },
    leave: { opacity: 0.5, transform: transform[2] },
  });

  return (
    <div className={css.container}>
      {transitions.map(({ item, key, props }) => (
        item &&
        <animated.div
          style={props}
          key={key}
        >
          <div className={css.header}>
            <img
              src="/static/img/arrow.svg"
              className={css.icon}
              onClick={() => goBack()}
            />
            <div>
              {/* {activePage.header} */}
            </div>
            {currentPage}
          </div>
          <div className={css.content}>
            {typeof activePage.content === 'function' 
              ? activePage.content({ goTo })
              : activePage.content
            }
          </div>
        </animated.div>
      ))}
    </div>
  )
}