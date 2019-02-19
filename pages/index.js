import LoadFonts from '../middleware/font';
import Layout from '../layouts';

class Index extends React.Component {
  componentDidMount() {
    LoadFonts();
  }

  render() {
    return (
      <Layout>
        <div>Witaj</div>
      </Layout>
    )
  }
}


export default Index;