import React from 'react';
import { NavLink } from 'react-router-dom';
import { CardTitle } from 'reactstrap';
import { adminRoot } from '../../../constants/defaultValues';
import IntlMessages from '../../../helpers/IntlMessages';

const NotFound = () => {
  return (
    <>
      <div className="position-relative image-side ">
        <p className="text-white h2">MAGIC IS IN THE DETAILS</p>
        <p className="white mb-0">Yes, it is indeed!</p>
      </div>
      <div className="form-side">
        <NavLink to="/" className="white">
          <span className="logo-single" />
        </NavLink>
        <CardTitle className="mb-4">
          <IntlMessages id="pages.error-title" />
        </CardTitle>
        <p className="mb-0 text-muted text-small mb-0">
          <IntlMessages id="pages.error-code" />
        </p>
        <p className="display-1 font-weight-bold mb-5">404</p>
        <NavLink to={adminRoot} className="btn btn-primary btn-shadow btn-lg">
          <IntlMessages id="pages.go-back-home" />
        </NavLink>
      </div>
    </>
  );
};

export default NotFound;
