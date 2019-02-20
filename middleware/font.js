const FontFaceObserver = require('fontfaceobserver');

const LoadFonts = () => {
  const link = document.createElement('link')
  link.href = 'https://fonts.googleapis.com/css?family=Cabin:400,500,600,700'
  link.rel = 'stylesheet'

  document.head.appendChild(link)

  const openSans = new FontFaceObserver('Cabin')

  openSans.load().then(() => {
    document.documentElement.classList.add('Cabin')
  });
}

export default LoadFonts;