import classnames from 'classnames';
import React, { useEffect, useState } from 'react';
import { ContextMenuTrigger } from 'react-contextmenu';
import { Button, Card, Input, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

import IntlMessages from '../../../../helpers/IntlMessages';
import { Colxx } from '../../CustomBootstrap';

const DataListView = ({
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
  filterChildren,
  type
}: any) => {

  const [modalBasicDelete, setModalBasicDelete] = useState({ status: false, id: null });
  const [modalBasicActivate, setModalBasicActivate] = useState({ status: false, id: null });
  const [modalBasicInactivate, setModalBasicInactivate] = useState({ status: false, id: null });
  const [secs, setSeconds] = useState(45);


  useEffect(() => {
    let sampleInterval = setInterval(() => {
      if (secs > 0) {
        setSeconds(secs - 1);
      }
    }, 1000);
    return () => {
      clearInterval(sampleInterval);
    };
  }, [secs]);

  return (
    <Colxx xxs="12" className="mb-3">
      {/* <ContextMenuTrigger id="context_menu" collect={collect}> */}
      <Card
        onClick={(event) => {
          return onCheckItem(event, item);
        }}
        className={classnames('d-flex flex-row', {
          active: isSelect,
        })}
      >
        <div className="pl-2 d-flex flex-grow-1 min-width-zero">
          <div className="p-3 card-body align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero align-items-lg-center">
            {columns.filter((c: any) => { return c.column?.length > 0; }).map((column: any) => {
              let classNameProps = "";
              if (column?.textCenter) {
                classNameProps += "text-center";
              }
              if (classNameProps.length > 0) {
                classNameProps += " ";
              }
              classNameProps += column?.badge ? `mb-1 text-small badge badge-${column.color ? column.color : "primary"} badge-pill` : `mb-1 text-muted text-small`
              return (
                <div key={column.column} style={{ 'width': column.width }} className="mb-1">
                  <p key={column.column} className={classNameProps}>
                    {item[`${column.column}`] != null && column.translate ? <IntlMessages id={"display." + item[`${column.column}`] + ""} /> : item[`${column.column}`]?.toString()}
                  </p>
                </div>
              );
            })}
            {columns
              ?.filter((c: any) => {
                return (c.column?.length == 0 || c.column == undefined) && (currentMenu?.activateAction || currentMenu?.deleteAction || currentMenu?.inactiveAction || currentMenu?.updateAction || childrenButtons?.length > 0);
              })
              .map((column: any) => {
                return (
                  <p className={"mb-0 flex-gap text-muted text-small"} style={{ width: column.width }}>
                    {withChildren === true ? (
                      (filterChildren ? childrenButtons.filter((c: any) => { return (c.action === item[filterChildren]) }) : childrenButtons).map((button: any) => {
                        switch (type) {
                          case "valuationReferents":
                            switch (button.id) {
                              case 1:
                                return <>
                                  {
                                    !button.hide && item?.academicAsignature?.generalAcademicAsignature?.hasDba ?
                                      <Button
                                        key={button.id}
                                        color={button.color}
                                        size="xs"
                                        onClick={() => {
                                          return additionalFunction(item, button);
                                        }}>
                                        <i className={button.icon + ' font-1rem mr-2'} />
                                        {button.label}
                                      </Button> : ''
                                  }
                                </>
                                break;
                              default:
                                return <>
                                  {
                                    !button.hide ?
                                      <Button
                                        key={button.id}
                                        color={button.color}
                                        size="xs"
                                        onClick={() => {
                                          return additionalFunction(item, button);
                                        }}>
                                        <i className={button.icon + ' font-1rem mr-2'} />
                                        {button.label}
                                      </Button> : ''
                                  }
                                </>
                                break;
                            }
                            break;
                          default:
                            return <>
                              {
                                !button.hide ?
                                  <Button
                                    key={button.id}
                                    color={button.color}
                                    size="xs"
                                    onClick={() => {
                                      return additionalFunction(item, button);
                                    }}
                                    disabled={button?.disabled ? button?.disabled : false}>
                                    <i className={button.icon + ' font-1rem mr-2'} />
                                    {button.label}
                                  </Button> : ''
                              }
                              {' '}
                            </>
                            break;
                        }
                      })
                    ) : (
                      ''
                    )}
                    {currentMenu.updateAction ?
                      <Button
                        color="blue"
                        size="xs"
                        onClick={() => {
                          return viewEditData(item.id);
                        }}
                      >
                        <i className="simple-icon-eye font-1rem mr-2" />
                        <IntlMessages id="pages.detail" />
                      </Button> : ''}
                    {' '}
                    {currentMenu.deleteAction ?
                      <Button
                        color="orange"
                        size="xs"
                        onClick={() => {
                          // return deleteData(item.id);
                          setSeconds(45);
                          setModalBasicDelete({ status: !modalBasicDelete?.status, id: item.id })
                        }}
                      >
                        <i className="simple-icon-trash font-1rem mr-2" />
                        <IntlMessages id="pages.delete" />
                      </Button> : ''}{' '}
                    {currentMenu.inactiveAction ?
                      <Button
                        color={item.active ? 'danger' : 'green'}
                        size="xs"
                        onClick={() => {
                          // return changeActiveData(!item.active, item.id);
                          item.active ?
                            setModalBasicInactivate({ status: !modalBasicInactivate?.status, id: item.id }) : setModalBasicActivate({ status: !modalBasicActivate?.status, id: item.id });
                        }}
                      >
                        <i className={item.active ? 'simple-icon-close font-1rem mr-2' : 'simple-icon-check font-1rem mr-2'} />
                        {item.active ? <IntlMessages id="pages.inactivate" /> : <IntlMessages id="pages.activate" />}
                      </Button> : ''}{' '}
                  </p>
                );
              })}
            <div className="custom-control custom-checkbox pl-1 align-self-center pr-2 pl-4">
              <Input
                className="item-check mb-0"
                type="checkbox"
                id={`check_${item.id}`}
                checked={isSelect}
                onChange={() => { }}
                label=""
              />
            </div>
          </div>
        </div>
      </Card>
      {/* </ContextMenuTrigger> */}
      <Modal
        isOpen={modalBasicDelete?.status}
        toggle={() => setModalBasicDelete({ status: false, id: null })}
      >
        <ModalHeader>
          <IntlMessages id="pages.delete" />
        </ModalHeader>
        <ModalBody>
          Esta seguro que desea eliminar el registro ?
          <p></p>
          <b>Recuerde que si elimina el registro no podra recuperar la información por ningun medio, para continuar el proceso por favor espere {`${secs}`} segundos </b>
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary" outline
            onClick={() => setModalBasicDelete({ status: false, id: null })}
          >
            <IntlMessages id="pages.cancel" />
          </Button>
          <Button
            color="danger"
            onClick={() => {
              deleteData(modalBasicDelete?.id);
              setModalBasicDelete({ status: false, id: null })
            }}
            disabled={secs != 0}
          >
            <IntlMessages id="pages.delete" />
          </Button>{' '}
        </ModalFooter>
      </Modal>

      <Modal
        isOpen={modalBasicActivate?.status}
        toggle={() => setModalBasicActivate({ status: false, id: null })}
      >
        <ModalHeader>
          <IntlMessages id="pages.activate" />
        </ModalHeader>
        <ModalBody>
          Esta seguro que desea cambiar el estado del registro de Inactivo a Activo ?
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary" outline
            onClick={() => setModalBasicActivate({ status: false, id: null })}
          >
            <IntlMessages id="pages.cancel" />
          </Button>
          <Button
            color="primary"
            onClick={() => {
              changeActiveData(true, modalBasicActivate.id);
              setModalBasicActivate({ status: false, id: null })
            }}
          >
            <IntlMessages id="pages.activate" />
          </Button>{' '}
        </ModalFooter>
      </Modal>

      <Modal
        isOpen={modalBasicInactivate?.status}
        toggle={() => setModalBasicInactivate({ status: false, id: null })}
      >
        <ModalHeader>
          <IntlMessages id="pages.inactivate" />
        </ModalHeader>
        <ModalBody>
          Esta seguro que desea cambiar el estado del registro de Activo a Inactivo?
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary" outline
            onClick={() => setModalBasicInactivate({ status: false, id: null })}
          >
            <IntlMessages id="pages.cancel" />
          </Button>
          <Button
            color="warning"
            onClick={() => {
              changeActiveData(false, modalBasicInactivate.id);
              setModalBasicInactivate({ status: false, id: null })
            }}
          >
            <IntlMessages id="pages.inactivate" />
          </Button>{' '}
        </ModalFooter>
      </Modal>

    </Colxx>
  );
};

export default React.memo(DataListView);


