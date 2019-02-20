import styled from 'styled-components';

const Select = ({ children }) => (
  <StyledSelect>
    {children}
  </StyledSelect>
);

const StyledSelect = styled.select`
  background: #2B2B3C;
  border-radius: 8px;
  border: 2px solid #6770FA;
  color: #fff;
  /* color: #636386; */
  font-family: Cabin;
  padding: 8px;
  min-width: 170px;
`

export default Select;