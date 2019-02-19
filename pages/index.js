import LoadFonts from '../middleware/font';
import css from '../assets/css/index.scss';


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