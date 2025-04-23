import React from 'react';
import { NavLink } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';

import IntlMessages from '../../../helpers/IntlMessages';

const getMenuTitle = (sub: any) => {
  return <IntlMessages id={`menu.${sub}`} />;
};

const getUrl = (path: any, sub: any, index: any) => {
  return path.split(sub)[0] + sub;
};

const BreadcrumbContainer = ({ heading, match, currentMenu }: any) => {
  //console.log(currentMenu)
  return (
    <>
      {heading && (
        <h1>
          <i className={currentMenu.icon} />{' '} <IntlMessages id={`menu.${heading}`} />
        </h1>
      )}
      {/* <BreadcrumbItems match={match} /> */}
    </>
  );
};

const BreadcrumbItems = ({ match }: any) => {
  const path = match.substr(1);
  let paths = path.split('/');
  if (paths[paths.length - 1].indexOf(':') > -1) {
    paths = paths.filter((x: any) => {
      return x.indexOf(':') === -1;
    });
  }
  return (
    <>
      <Breadcrumb className="pt-0 breadcrumb-container d-none d-sm-block d-lg-inline-block">
        {paths.map((sub: any, index: any) => {
          return (
            <BreadcrumbItem key={index} active={paths.length === index + 1}>
              {paths.length !== index + 1 ? (
                <NavLink to={`/${getUrl(path, sub, index)}`}>
                  {getMenuTitle(sub)}
                </NavLink>
              ) : (
                getMenuTitle(sub)
              )}
            </BreadcrumbItem>
          );
        })}
      </Breadcrumb>
    </>
  );
};

export default BreadcrumbContainer;
