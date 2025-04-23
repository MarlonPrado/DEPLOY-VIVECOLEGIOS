/* eslint-disable import/imports-first */
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import { NavLink } from 'react-router-dom';
import { Badge, Button, Card, CardBody, Input, Label, Row } from 'reactstrap';
import svgAddForum from '../../../../assets/img/svg/scene-dialog.svg';
import svgEmpty from '../../../../assets/img/svg/scene-empty.svg';
import IntlMessages from '../../../../helpers/IntlMessages';
import { createNotification } from '../../../../helpers/Notification';
import * as forumActions from '../../../../stores/actions/ForumAction';
import { Colxx, Separator } from '../../../common/CustomBootstrap';
import Pagination from '../../../common/Data/List/Pagination';

const ForumListApp = (props: any) => {
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const [currentMenu, setCurrentMenu] = useState({
    createAction: false,
    deleteAction: false,
    updateAction: false,
    readAction: false,
    fullAccess: false,
    activateAction: false,
    inactiveAction: false,
  });

  const methods = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const { handleSubmit, control, register, reset, setValue, getValues } = methods;

  const cleanForm = async () => {
    reset();
  };

  const location = useLocation();
  const history = useNavigate();
  const currentUrl = location.pathname;

  useEffect(() => {

    let { roleMenus } = props.loginReducer;
    let submenus: any = [];
    roleMenus.map((c: any) => {
      return submenus = submenus.concat(c.menuItemsLogin);
    });
    let cm = submenus.find((c: any) => { return (currentUrl.includes(c?.module?.url)) });
    if (cm && cm.readAction) {
      setCurrentMenu(cm);
    } else {
      history(`/home`);
      createNotification('warning', 'notPermissions', '');
    }

    props.getListAllForum(props?.loginReducer?.schoolId).then((listData: any) => {
      setItems(listData);
    });
    setTotalPage(items?.length);
    setIsLoading(false);
  }, [pageSize, currentPage]);

  const getData = async () => {
    props.getListAllForum(props?.loginReducer?.schoolId).then((listData: any) => {
      setItems(listData);
    });
  };


  const onSubmit = async (dataForm: any, data: any) => {
    dataForm.schoolId = props?.loginReducer?.schoolId;
    if (data === null) {
      await props.saveNewForum(dataForm).then((id: any) => {
        if (id !== undefined) {
          reset();
          getData();
        }
      });
    } else {
      await props.updateForum(dataForm, data.id).then((id: any) => {
        if (id !== undefined) {
          reset();
          getData();
        }
      });
    }
  };

  const deleteData = async (id: any) => {
    await props.deleteForum(id, true).then((formData: any) => {
      getData();
    });
  };

  const { ref: nameRef, ...nameRest } = register('name', {
    required: true,
    value: props?.data?.id ? props?.data?.name : '',
  });
  const { ref: descriptionRef, ...descriptionRest } = register('description', {
    required: true,
    value: props?.data?.id ? props?.data?.description : '',
  });
  const { ref: detailsRef, ...detailsRest } = register('details', {
    required: true,
    value: props?.data?.id ? props?.data?.details : '',
  });

  return (
    <>
      <Row>
        <Colxx xxs="12" className="d-flex flex-row">
          <i className="iconsminds-speach-bubble-dialog lead text-primary mr-2"></i>
          <div>
            <p className="lead font-bold mb-0">Mis foros</p>
            <p className="text-muted">Sección de foros participativos</p>
          </div>
        </Colxx>
      </Row>
      <Separator className="mb-5" />
      <Row>
        <Colxx xxs="12" className="mb-4">
          {/* FOR ADD FORUM */}
          {currentMenu.createAction ?
            <Card className="flex-row listing-card-container rounded-card mb-5">
              <div className="w-40 position-relative border-right">
                <NavLink to="blog-detail">
                  <img className="card-img-left" src={svgAddForum} alt="Card cap" />
                  <Badge
                    color="primary"
                    pill
                    className="position-absolute badge-top-left text-uppercase"
                  >
                    Nuevo foro
                  </Badge>
                </NavLink>
              </div>
              <div className="w-100 d-flex align-items-center">
                <CardBody>

                  <FormProvider {...methods}>
                    <form>
                      <div className="form-group">
                        <Label>
                          <IntlMessages id="forms.name" />
                        </Label>
                        <Input {...nameRest} innerRef={nameRef} className="form-control" />
                      </div>
                      <div className="form-group">
                        <Label>
                          <IntlMessages id="forms.description" />
                        </Label>
                        <Input {...descriptionRest} innerRef={descriptionRef} className="form-control" />
                      </div>
                      <div className="form-group">
                        <Label>
                          <IntlMessages id="layouts.details" />
                        </Label>
                        <Input type='textarea' rows="6" {...detailsRest} innerRef={detailsRef} className="form-control" />
                      </div>
                      <div className='d-flex justify-content-center'>
                        <Button
                          color="blue"
                          size="xs"
                          onClick={() => {
                            return onSubmit(methods.getValues(), null);
                          }}
                        >
                          <i className="simple-icon-check font-1rem mr-2" />
                          GUARDAR
                        </Button>
                      </div>
                    </form>
                  </FormProvider>
                </CardBody>
              </div>
            </Card>
            : ''}
          {/* FOR ADD FORUM */}

          {items.length > 0 ? (
            <Card className="rounded-card">
              <CardBody>
                {!isLoading ? (
                  items.map((item, i) => {
                    return (
                      <>
                        <div key={`item_${i}`} className={`${items.length !== i + 1 ? 'mb-3' : ''}`}>
                          <div className='d-flex align-items-center justify-content-between'>
                            <NavLink to={`/foro-detalle?id=${item?.node?.id}`} className="w-100">
                              <p className="list-item-heading mb-1 color-theme-1">{item?.node?.name}</p>
                              <p className="mb-1 text-muted text-small">
                                <IntlMessages id="forms.description" /> | {item?.node?.description}
                              </p>
                              <p className="mb-4 text-small">{item?.node?.details}</p>
                            </NavLink>
                            {currentMenu?.deleteAction ?
                              <i className='text-danger font-20 simple-icon-trash cursor-pointer' onClick={() => {
                                return deleteData(item.node.id);
                              }}></i>
                              : ''}
                          </div>
                          {items.length !== i + 1 && <Separator />}
                        </div>
                      </>
                    );
                  })
                ) : (
                  <div className="loading" />
                )}
              </CardBody>
            </Card>
          ) : (
            <>
              <div className='d-flex align-items-center justify-content-center flex-column'>
                {!currentMenu.createAction ?
                  <img className="card-img-left w-30" src={svgEmpty} alt="Card cap" />
                  : ''}
                <h4 className='font-bold mt-4 mb-1'>Sin registros</h4>
                <span className='font-bold text-muted'>No se encontraron foros</span>
              </div>
            </>
          )}
        </Colxx>
        <Pagination
          currentPage={currentPage}
          totalPage={totalPage}
          onChangePage={(i: any) => {
            return setCurrentPage(i);
          }}
        />
      </Row>
    </>
  );
};
const mapDispatchToProps = { ...forumActions };

const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

export default connect(mapStateToProps, mapDispatchToProps)(ForumListApp);
