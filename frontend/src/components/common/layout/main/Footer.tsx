import React from 'react';
import { Row } from 'reactstrap';
import FooterImg1 from '../../../../assets/img/logos/mintic.png';
import FooterImg2 from '../../../../assets/img/logos/minciencias.png';
import { Colxx } from '../../../common/CustomBootstrap';
import NavImg2 from '../../../../assets/img/logos/gobernacion.png';
import NavImg1 from '../../../../assets/img/logos/ufps.png';

const Footer = () => {
  return (
    <footer className="page-footer">
      <div className="footer-content">
        <div className="container-fluid">
          <Row>
            <Colxx xxs="12" sm="2" lg="2"></Colxx>
            <Colxx xxs="12" sm="10" lg="10" className="d-none d-sm-block">
              <ul className="breadcrumb pt-0 pr-0 float-right" style={{height: "60px"}}>
                <li className="breadcrumb-item mb-0 h-100">
                  <img alt="LOGO" className="h-100" src={FooterImg2} />
                </li>
                <li className="breadcrumb-item mb-0 h-100">
                  <img className="mr-3 h-100" alt="LOGO" src={NavImg2} />
                </li>
                <li className="breadcrumb-item mb-0 h-100">
                  <img className="mr-3 h-100" alt="LOGO" src={NavImg1} />
                </li>
              </ul>
            </Colxx>
          </Row>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
