import LoadFonts from '../middleware/font';

class Index extends React.Component {
  componentDidMount() {
    LoadFonts();
  }

  render() {
    return (
      <div>Witaj</div>
    )
  }
}


export default Index;