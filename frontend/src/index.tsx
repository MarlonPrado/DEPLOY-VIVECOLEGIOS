import { defaultColor, isDarkSwitchActive, isMultiColorActive } from './constants/defaultValues';
import { getCurrentColor, setCurrentColor } from './helpers/Utils';

import './assets/css/style.css';
import './assets/css/vendor/bootstrap.min.css';
import './assets/css/vendor/bootstrap.rtl.only.min.css';
//import './assets/fonts/iconsmind-s/css/iconsminds.css';
//import './assets/fonts/iconsmind/style.css';
//import './assets/fonts/simple-line-icons/css/simple-line-icons.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-circular-progressbar/dist/styles.css';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-time-picker/dist/TimePicker.css';
import 'react-image-lightbox/style.css';
import 'react-perfect-scrollbar/dist/css/styles.css';
import 'video-react/dist/video-react.css';
//import 'video.js/dist/video-js.css';

const color = isMultiColorActive || isDarkSwitchActive ? getCurrentColor() : defaultColor;
setCurrentColor(color);

const render = () => {
  import(`./assets/css/sass/themes/gogo.${color}.scss`).then(() => {
    require('./AppRenderer');
  });
};
render();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls. a
// Learn more about service workers: https://cra.link/PWA
// serviceWorkerRegistration.register(); //change the service worker registration from 'unregistered' to 'registered'

// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/service-worker.js')
//       .then(registration => {
//         console.log('SW registered: ', registration);
//       }).catch(registrationError => {
//         console.log('SW registration failed: ', registrationError);
//       });
//   });
// }