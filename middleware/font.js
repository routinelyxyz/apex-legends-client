const FontFaceObserver = require('fontfaceobserver');

const LoadFonts = () => {
  const link = document.createElement('link')
  link.href = 'https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700,800'
  link.rel = 'stylesheet'

  document.head.appendChild(link)

  const openSans = new FontFaceObserver('Open Sans')

  openSans.load().then(() => {
    document.documentElement.classList.add('open-sans')
  });
}

export default LoadFonts;