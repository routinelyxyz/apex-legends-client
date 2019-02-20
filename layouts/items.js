import styled from 'styled-components';
import Link from 'next/link';
import Router from 'next/router';

const ItemsLayout = ({ children }) => {
  return (
    <article>
      <SubMenu>
        <Link href="/items" passHref>
          <NavLink
            active={Router.route === '/items'}
          >Weapons</NavLink>
        </Link>
        <Link href="/items/attachments" passHref>
          <NavLink
            active={Router.route === '/items/attachments'}
          >Attachments</NavLink>
        </Link>
      </SubMenu>
      {children}
    </article>
  )
};

const SubMenu = styled.nav`
  margin: 25px 0 100px 0;
`
const NavLink = styled.a`
  margin-right: 35px;
  font-size: 18px;
  color: ${props => props.active ? '#fff' : 'rgb(99, 99, 134)'};
  position: relative;
  padding: 20px;
  &:hover {
    color: #fff;
  }
  &:before {
    content: ${props => props.active ? "''" : ''};
    height: 100%;
    width: 100%;
    position: absolute;
    background: radial-gradient(
      #8289ff 0, transparent 80%
    ) no-repeat;
    background-position-y: 20px;
    left: 0;
    bottom: -10px;
    opacity: .15;
  }
  &:after {
    content: ${props => props.active ? "''" : ''};
    height: 3px;
    width: 100%;
    border-radius: 8px;
    background: #6770FA;
    position: absolute;
    left: 0;
    bottom: -10px;
    /* box-shadow: 0 0 10px 5px #6770FA; */
  }
`

export default ItemsLayout;