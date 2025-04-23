import React, { useEffect, useState } from 'react';

import TopNav from './TopNav';
import Sidebar from './Sidebar';
import { injectIntl } from 'react-intl';
import Footer from './Footer';
import moment from 'moment';

const Main = (props: any) => {
  const intlProps = {
    intl: props.intl,
  };

  document.body.classList.remove('background');

  const date = new Date();

  const [dateTime, setDateTime] = useState({
    hours: date.getHours(),
    minutes: date.getMinutes(),
    seconds: date.getSeconds(),
    date: date,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const date = new Date();
      setDateTime({
        hours: date.getHours(),
        minutes: date.getMinutes(),
        seconds: date.getSeconds(),
        date,
      });
    }, 1000);
    return () => {
      return clearInterval(timer);
    };
  }, []);

  return (
    <>
      <div id="app-container" className={props.containerClassnames}>
        <TopNav {...intlProps} />
        <Sidebar />
        <main>
          <div className="container" style={{ marginTop: '-30px', marginBottom: '20px' }}>
            <div className="row text-muted text-small">
              <div className="col-sm d-flex p-0">
                <i className="simple-icon-globe d-block mr-2" />
                Última Conexión: 02/02/2024 03:00 - IP: 200.200.200.200
              </div>
              <div className="col-sm text-right container">
                <div className="row">
                  <i className="col-sm simple-icon-clock d-block" />
                  {moment(date).format('DD/MM/YYYY')} - {dateTime.hours}:{dateTime.minutes}:
                  {dateTime.seconds}
                </div>
              </div>
            </div>
          </div>
          <div className="container-fluid">{props.children}</div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default injectIntl(Main);
