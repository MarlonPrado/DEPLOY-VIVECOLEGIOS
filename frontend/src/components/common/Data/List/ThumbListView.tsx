import classnames from 'classnames';
import React from 'react';
import { ContextMenuTrigger } from 'react-contextmenu';
import { NavLink } from 'react-router-dom';
import { Badge, Button, Card, Input } from 'reactstrap';
import { Colxx } from '../../CustomBootstrap';
import ProfileImg from '../../../../assets/img/profiles/l-1.jpg';
import IntlMessages from '../../../../helpers/IntlMessages';

const ThumbListView = ({
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
    <Colxx xxs="12" key={item.id} className="mb-3">
      {/* <ContextMenuTrigger id={item.id} collect={collect}> */}
      <Card
        onClick={(event) => {
          return onCheckItem(event, item.id);
        }}
        className={classnames('d-flex flex-row', {
          active: isSelect,
        })}
      >
        {ProfileImg ?
          <NavLink to={`?p=${item.id}`} className="d-flex">
            <img
              alt={item.title}
              src={ProfileImg}
              className="list-thumbnail responsive border-0 card-img-left"
            />
          </NavLink>
          : ''}
        <div className="pl-2 d-flex flex-grow-1 min-width-zero">
          <div className="card-body align-self-center d-flex flex-column flex-lg-row justify-content-around min-width-zero align-items-lg-center">
            {columns.map((column: any) => {
              return (
                <p
                  key={column.column}
                  className="text-muted text-small mb-0 font-weight-light"
                >
                  {item[`${column.column}`]}
                </p>
              );
            })}
          </div>
          <div className="custom-control custom-checkbox pl-1 align-self-center pr-4">
            <p className={withChildren === true ? "mb-0 text-center text-muted text-small w-sm-100 d-flex align-items-center" : "mb-0 text-center text-muted text-small w-sm-100 d-flex align-items-center"}>
              <Button
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
                color={item.active ? 'danger' : 'green'}
                disabled={item.active ? !currentMenu.inactiveAction : !currentMenu.activateAction}
                size="xs"
                onClick={() => {
                  return changeActiveData(!item.active, item.id);
                }}
              >
                <i className={item.active ? 'simple-icon-close font-1rem mr-2' : 'simple-icon-check font-1rem mr-2'} />
                {item.active ? <IntlMessages id="pages.inactivate" /> : <IntlMessages id="pages.activate" />}
              </Button>{' '}
              {withChildren === true ? (
                childrenButtons.map((button: any) => {
                  return <Button
                    key={button.id}
                    color={button.color}
                    size="xs"
                    onClick={() => {
                      return additionalFunction(item, button.action);
                    }}>
                    <i className={button.icon + ' font-1rem mr-2'} />
                    {button.label}
                  </Button>
                })
              )
                : (
                  ''
                )}
              <Input
                className="item-check mb-0 ml-3"
                type="checkbox"
                id={`check_${item.id}`}
                checked={isSelect}
                onChange={() => { }}
                label=""
              />
            </p>
          </div>
        </div>
      </Card>
      {/* </ContextMenuTrigger> */}
    </Colxx >
  );
};

export default React.memo(ThumbListView);
