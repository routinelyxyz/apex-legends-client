import { useState, useRef } from 'react';
import css from './style.scss';


/*
<button className={css.dropdown_btn}>
  <img
    className={`${css.platform_img} ${css.dropdown_btn}`}
    src={`/static/img/${platform}.svg`}
  />
</button>
*/

const DropdownButton = (props) => (
  <button {...props}>Click me</button>
)

export const Dropdown = ({ children, Button = DropdownButton }) => {
  const [opened, setOpened] = useState(true);
  // const { } = 
  const containerRef = useRef();

  return (
    <div className={css.wrapper}>
    <Button onClick={() => setOpened(!opened)}/>
    {opened && (
      <div className={css.container} ref={containerRef}>
        {children}
      </div>
    )}
    </div>
  )
}