import styled from 'styled-components';

const BasicInput = props => (
  <Input {...props}/>
);

const Input = styled.input`
  border: none;
  border-radius: 10px;
  padding: 12px 16px;
  font-family: Lato;
  box-shadow: 4px 4px 10px rgba(1,1,1,.3);
  transition: background-color .2s ease;
  border: 1px solid #fff;
  &:focus {
    /* border: 1px solid #FE8EC1; */
  }
  &:not(:focus) {
    // background: rgba(255,255,255,.8);
  }
  transition: box-shadow .2s ease;
  outline: none;
  /* font-family: Segoe UI; */
  font-weight: 400;
  &::placeholder {
    color: rgba(255,255,255,.8);
    color: rgb(122, 127, 145);
  }
  box-sizing: border-box;
`

export default BasicInput;
