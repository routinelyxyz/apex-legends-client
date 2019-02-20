import styled from 'styled-components';

const RouteLink = ({ children, ...styleProps }) => (
  <StyledLink {...styleProps}>
    {children}
  </StyledLink>
);

const StyledLink = styled.a`
  margin-right: 35px;
  font-size: 16px;
  color: ${props => props.active ? '#fff' : 'rgba(255,255,255,.8)'};
  position: relative;
  padding: 20px;
  &:hover { color: #fff; }
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
  }
`

export default RouteLink;