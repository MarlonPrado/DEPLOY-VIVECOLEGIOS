import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import * as loginActions from '../stores/actions/LoginActions';
import { Colxx } from './common/CustomBootstrap';
import { Button, Card, CardBody, CardTitle, Collapse, Row } from 'reactstrap';
import { adminRoot } from '../constants/defaultValues';
import { NavLink } from 'react-router-dom';

const Home = (props: any) => {
  const [menuItems, setMenuItems] = useState([]);

  const [showingIndex, setShowIndex] = useState(0);

  useEffect(() => {
    let { roleMenus } = props.loginReducer;
    roleMenus = roleMenus.map((c: any) => {
      return {
        id: c.name,
        icon: c.icon,
        label: c.name,
        to: `${adminRoot}/${c.name}`,
        newWindow: false,
        subs: c.menuItemsLogin
          .filter((x: any) => {
            return x.isHidden !== true;
          })
          .map((x: any) => {
            return {
              icon: x.icon,
              label: x.name,
              to: x.module ? x.module.url : null,
            };
          }),
      };
    });
    setMenuItems(roleMenus);
    console.log(roleMenus);
  }, []);

  return (
    <>
      <Colxx xxs="12" className="mb-4">
        <>
          {menuItems.map((item, index) => {
            return (
              <Card className="d-flex mb-3" key={`faqItem_${index}`}>
                <div className="d-flex flex-grow-1 min-width-zero">
                  <Button
                    color="link"
                    className="card-body  btn-empty btn-link list-item-heading text-left text-one"
                    onClick={() => setShowIndex(index)}
                    aria-expanded={showingIndex === index}
                  >
                    <h3>
                      <i className={item.icon} /> {item.label}
                    </h3>
                  </Button>
                </div>
                <Collapse isOpen={showingIndex === index}>
                  <Row className="mr-4 ml-4">
                    {item?.subs?.map((item2: any) => {
                      return (
                        <Colxx xl="3" lg="6" className="mb-4" key={1}>
                          <Card className="h-100">
                            <CardBody className="d-flex justify-content-between align-items-center">
                              <CardTitle className="mb-0">
                                <NavLink to={item2.to} data-flag={item2.id}>
                                  <i className={item2.icon} /> {item2.label}
                                  {/* <IntlMessages id={item.label} /> */}
                                </NavLink>
                              </CardTitle>
                            </CardBody>
                          </Card>
                        </Colxx>
                      );
                    })}
                  </Row>
                </Collapse>
              </Card>
            );
          })}
        </>
      </Colxx>
    </>
  );
};

const mapDispatchToProps = {
  ...loginActions,
};

const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
