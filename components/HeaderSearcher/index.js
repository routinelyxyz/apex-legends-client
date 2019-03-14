import css from './style.scss';
import { ModalContext } from '../../helpers/context';

{/* <div className={css.searcher_container} onClick={() => setOpened(false) || setScroll(true)}>
{scroll.toString()}
</div> */}

export const HeaderSearcher = () => {
  return (
    <ModalContext.Consumer>
      {context => {
      console.log(context)
      return (
        <button
          onClick={() => context.setOpened()}
          className={css.search_btn}
        >
          <img
            className={css.search_btn_img}
            src="/static/img/loupe.svg"
          />
        </button>
      )}}
    </ModalContext.Consumer>
  )
}