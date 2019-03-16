import css from './style.scss';
import { useState } from 'react';
import { flatMapTree } from '../../util';

export const TabNavigator = ({ pages = [], header }) => {
  const homePath = pages && pages[0].id;

  const [router, setRouter] = useState([homePath, homePath]);
  const [prevPage, currentPage] = router;

  const flattened = flatMapTree(pages);


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
    setRouter([currentPage, prevPage]);
  }

  console.log(router)

  return (
    <div className={css.container}>
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
    </div>
  )
}