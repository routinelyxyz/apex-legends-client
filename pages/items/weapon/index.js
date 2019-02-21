
const WeaponPage = (props) => {
  console.log(props)
  return (
    <div>Weapon page - id {props.id}</div>
  )
}

WeaponPage.getInitialProps = async ({ query: { id }}) => {
  return { id }
}

export default WeaponPage;

