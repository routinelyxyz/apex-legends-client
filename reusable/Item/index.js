import css from './style.scss';
import styled from 'styled-components';
import { animated } from 'react-spring';

const Item = ({ item, ...springProps }) => {
  return (
    <Container
      className={css.item_rare}
      {...springProps}
    >
      <Name>{item.name}</Name>
      <div className={css.item__container}>
        <img
          className={css.item__img}
          src={"/static/VK-47%20Flatline.png"}
        />
      </div>
    </Container>
  )
}

const Container = styled(animated.div)`
  margin: 0 0 60px 60px;
`
const Name = styled.p`
  margin: 0;
  position: relative;
  bottom: 5px;
  font-size: 13px;
  text-shadow: 0 1px 4px #000;
  text-align: center;
  &:after {
    width: 12px;
    height: 2px;
    content: "";
    position: absolute;
    bottom: -4px;
    left: 22%;
  }
`


export default Item;