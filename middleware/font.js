const FontFaceObserver = require('fontfaceobserver');

const LoadFonts = () => {
  const link = document.createElement('link')
  link.href = 'https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700,800'
  link.rel = 'stylesheet'

  document.head.appendChild(link)

  const roboto = new FontFaceObserver('Roboto')

  roboto.load().then(() => {
    document.documentElement.classList.add('roboto')
  });
}

export default LoadFonts;