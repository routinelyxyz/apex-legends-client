import LoadFonts from '../middleware/font';
import css from '../assets/css/index.scss';
import Header from '../components/Header';


class Index extends React.Component {
  componentDidMount() {
    LoadFonts();
  }

  render() {
    return (
      <div className={css.app_container}>
        <Header/>
        <div>Witaj</div>
      </div>
    )
  }
}


export default Index;