import classnames from 'classnames';
import React from 'react';
import { ContextMenuTrigger } from 'react-contextmenu';
import { NavLink } from 'react-router-dom';
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardSubtitle,
  CardText,
  Row,
  Input
} from 'reactstrap';
import ProfileImg from '../../../../assets/img/profiles/l-1.jpg';
import IntlMessages from '../../../../helpers/IntlMessages';
import { Colxx } from '../../CustomBootstrap';

const ImageListView = ({
  item,
  isSelect,
  collect,
  onCheckItem,
  columns,
  viewEditData,
  changeActiveData,
  withChildren,
  childrenButtons,
  deleteData,
  additionalFunction,
  currentMenu,
}: any) => {
  return (
    <Colxx sm="6" lg="4" xl="3" className="mb-3" key={item.id}>
      {/* <ContextMenuTrigger id={item.id} collect={collect}> */}
      <Card
        onClick={(event) => {
          return onCheckItem(event, item.id);
        }}
        className={classnames({
          active: isSelect,
        })}
      >
        {/* REEMPLAZAR PROFILE IMG POR LA IMAGEN REAL */}
        {ProfileImg ?
          <div className="position-relative">
            <NavLink to={`?p=${item.id}`} className="w-40 w-sm-100">
              <CardImg top alt={item.title} src={ProfileImg} />
            </NavLink>
          </div> : ''
        }
        <CardBody>
          <Row>
            {/* <Colxx xxs="2">
                <CustomInput
                  className="item-check mb-0"
                  type="checkbox"
                  id={`check_${item.id}`}
                  checked={isSelect}
                  onChange={() => {}}
                  label=""
                />
              </Colxx> */}
            <Colxx xxs="12" className="mb-3">
              <CardSubtitle className="d-flex mb-2 align-items-center">
                <strong className="col-11 p-0">{item[`${columns[0].column}`]}</strong>
                <Input
                  className="item-check mb-0 col-1"
                  type="checkbox"
                  id={`check_${item.id}`}
                  checked={isSelect}
                  onChange={() => { }}
                  label=""
                />
              </CardSubtitle>
              {columns.map((column: any) => {
                return columns[0] !== column ? (
                  <CardText
                    key={column.column}
                    className="text-muted text-small mb-0 font-weight-light"
                  >
                    {item[`${column.column}`]}
                  </CardText>
                ) : (
                  ''
                );
              })}
              <p className="w-100 mt-2">
                <Button
                  className="mt-2"
                  color="blue"
                  disabled={!currentMenu.updateAction}
                  size="xs"
                  onClick={() => {
                    return viewEditData(item.id);
                  }}
                >
                  <i className="simple-icon-eye font-1rem mr-2" />
                  <IntlMessages id="pages.detail" />
                </Button>{' '}
                <Button
                  className="mt-2"
                  color="orange"
                  disabled={!currentMenu.deleteAction}
                  size="xs"
                  onClick={() => {
                    return deleteData(item.id);
                  }}
                >
                  <i className="simple-icon-trash font-1rem mr-2" />
                  <IntlMessages id="pages.delete" />
                </Button>{' '}
                <Button
                  className="mt-2"
                  color={item.active ? 'danger' : 'green'}
                  disabled={
                    item.active ? !currentMenu.inactiveAction : !currentMenu.activateAction
                  }
                  size="xs"
                  onClick={() => {
                    return changeActiveData(!item.active, item.id);
                  }}
                >
                  <i
                    className={
                      item.active
                        ? 'simple-icon-close font-1rem mr-2'
                        : 'simple-icon-check font-1rem mr-2'
                    }
                  />
                  {item.active ? <IntlMessages id="pages.inactivate" /> : <IntlMessages id="pages.activate" />}
                </Button>{' '}
                {withChildren === true
                  ? childrenButtons.map((button: any) => {
                    return (
                      <Button
                        className="mt-2"
                        key={button.id}
                        color={button.color}
                        size="xs"
                        onClick={() => {
                          return additionalFunction(item, button.action);
                        }}
                      >
                        <i className={button.icon + ' font-1rem mr-2'} />
                        {button.label}
                      </Button>
                    );
                  })
                  : ''}
              </p>
            </Colxx>
          </Row>
        </CardBody>
      </Card>
      {/* </ContextMenuTrigger> */}
    </Colxx >
  );
};

export default React.memo(ImageListView);
