import React, { useEffect, useState } from 'react';
import { useForm, useFormContext } from 'react-hook-form';
import { Loader } from '../../common/Loader';
import { connect } from 'react-redux';
import Select from 'react-select';
import {
  Button,
  Input,
  InputGroup,
  Label,
  ModalBody,
  ModalFooter,
  Table,
} from 'reactstrap';
import IntlMessages from '../../../helpers/IntlMessages';
import * as menuActions from '../../../stores/actions/MenuModelActions';
import * as moduleActions from '../../../stores/actions/ModuleActions';
import * as roleActions from '../../../stores/actions/RoleActions';
import { Colxx } from '../../common/CustomBootstrap';
import AddNewModal from '../../common/Data/AddNewModal';
import CreateEditAuditInformation from '../../common/Data/CreateEditAuditInformation';
import Icons from '../../common/Data/Icon/Icons';

const MenuCreateEdit = (props: any) => {
  const [loading, setLoading] = useState(true);
  const [menuItems, setMenuItems] = useState(null);
  const [modalOpen, setModalIcon] = useState(false);
  const [icon, setIcon] = useState();
  const [rolesList, setRolesList] = useState([]);
  const [role, setRole] = useState([]);

  const methods = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const { handleSubmit, control, register, reset, setValue, getValues } = methods;

  useEffect(() => {
    cleanForm();
    getDropdowns();
    if (props?.data?.id) {
      if (props?.data?.icon !== undefined && props?.data?.icon != null) {
        setIcon(props?.data?.icon);
      }
      if (props?.data?.menuItems !== undefined && props?.data?.menuItems != null) {
        setMenuItems(props?.data?.menuItems);
      }
      if (props?.data?.roles !== undefined && props?.data?.roles != null) {
        setRole(props?.data?.roles.map((c: any) => {
          return { label: c.name, value: c.id, key: c.id };
        }));
      }
    }
    setLoading(false);
  }, [props?.data]);

  const cleanForm = async () => {
    reset();
    setRole(null);
    setMenuItems(null);
  };

  const getDropdowns = async () => {
    props.getDropdownsMenu().then((data: any) => {
      setRolesList(
        data.dataRoles.edges.map((c: any) => {
          return { label: c.node.name, value: c.node.id, key: c.node.id };
        }),
      );
    });
  };

  const { ref: nameRef, ...nameRest } = register('name', {
    required: true,
    value: props?.data?.id ? props?.data?.name : '',
  });
  const { ref: iconRef, ...iconRest } = register('icon', {
    required: true,
    value: props?.data?.id ? props?.data?.icon : '',
  });
  const { ref: orderRef, ...orderRest } = register('order', {
    required: true,
    value: props?.data?.id ? props?.data?.order : '',
  });
  register('rolesId', {
    required: true,
    value: props?.data?.id ? props?.data?.rolesId : '',
  });

  const data: any = {
    readAction:
      props?.data?.id || props?.data?.readAction === methods.getValues('readAction')
        ? props?.data?.readAction
        : methods.getValues('readAction'),
    createAction:
      props?.data?.id || props?.data?.createAction === methods.getValues('createAction')
        ? props?.data?.createAction
        : methods.getValues('createAction'),
    deleteAction:
      props?.data?.id || props?.data?.deleteAction === methods.getValues('deleteAction')
        ? props?.data?.deleteAction
        : methods.getValues('deleteAction'),
    updateAction:
      props?.data?.id || props?.data?.updateAction === methods.getValues('updateAction')
        ? props?.data?.updateAction
        : methods.getValues('updateAction'),
    fullAccess:
      props?.data?.id || props?.data?.fullAccess === methods.getValues('fullAccess')
        ? props?.data?.fullAccess
        : methods.getValues('fullAccess'),
    activateAction:
      props?.data?.id || props?.data?.activateAction === methods.getValues('activateAction')
        ? props?.data?.activateAction
        : methods.getValues('activateAction'),
    inactiveAction:
      props?.data?.id || props?.data?.inactiveAction === methods.getValues('inactiveAction')
        ? props?.data?.inactiveAction
        : methods.getValues('inactiveAction'),
  };

  const auditInfo = {
    createdAt: props?.data?.id ? props?.data?.createdAt : null,
    updatedAt: props?.data?.id ? props?.data?.createdAt : null,
    createdByUser: props?.data?.id ? props?.data?.createdByUser : null,
    updatedByUser: props?.data?.id ? props?.data?.updatedByUser : null,
    version: props?.data?.id ? props?.data?.version : null,
  };

  return (
    <>
      {loading ? (
        <>
          <Colxx sm={12} className="d-flex justify-content-center">
            <Loader />
          </Colxx>
        </>
      ) : (
        <>
          <AddNewModal
            isLg={true}
            modalOpen={props.modalOpen}
            toggleModal={() => {
              cleanForm();
              props.toggleModal();
            }}
            onSubmit={props.onSubmit}
            data={props.data}
            methods={methods}
            control={control}
            handleSubmit={handleSubmit}
          >
            <ModalBody>
              <div className="form-group">
                <Label>
                  <IntlMessages id="forms.name" />
                </Label>
                <Input {...nameRest} innerRef={nameRef} className="form-control" />
              </div>
              <div className="form-group">
                <Label>
                  <IntlMessages id="forms.sorting" />
                </Label>
                <Input {...orderRest} innerRef={orderRef} className="form-control" />
              </div>
              <div className="form-group">
                <Label>
                  <IntlMessages id="forms.icon" />
                </Label>
                <InputGroup className="input-group-prepend">
                  <Input {...iconRest} innerRef={iconRef} className="form-control" />
                  <Button
                    onClick={() => {
                      return setModalIcon(true);
                    }}
                    color="primary"
                    size="xs"
                  >
                    <IntlMessages id="forms.seeIcons" />
                  </Button>
                </InputGroup>
                <Icons
                  modalOpen={modalOpen}
                  icon={icon}
                  toggleModal={() => {
                    return setModalIcon(!modalOpen);
                  }}
                  setIcon={(i: any) => {
                    methods.setValue('icon', i);
                    setIcon(i);
                    setModalIcon(!modalOpen);
                  }}
                />
              </div>
              <div className="form-group">
                <Label>
                  <IntlMessages id="menu.roles" />
                </Label>
                <Select
                  isClearable
                  placeholder={<IntlMessages id="forms.select" />}
                  isMulti
                  {...register('rolesId', { required: true })}
                  className="react-select"
                  classNamePrefix="react-select"
                  options={rolesList}
                  value={role}
                  onChange={(selectedOption: any) => {
                    setValue('rolesId', selectedOption.map((c: any) => { return c.key }));
                    setRole(selectedOption);
                  }}
                />
              </div>
              <div className="form-group col-md-12 p-0">
                <Table basic>
                  <thead>
                    <tr>
                      <th scope="col" className="text-center">
                        <div className="d-flex align-items-center flex-column">
                          <i className="font-20 text-info simple-icon-eye" />
                          <small className="mt-1">Ver</small>
                        </div>
                      </th>
                      <th scope="col" className="text-center">
                        <div className="d-flex align-items-center flex-column">
                          <i className="font-20 text-success simple-icon-plus" />
                          <small className="mt-1">Crear</small>
                        </div>
                      </th>
                      <th scope="col" className="text-center">
                        <div className="d-flex align-items-center flex-column">
                          <i className="font-20 text-primary simple-icon-pencil" />
                          <small className="mt-1">Editar</small>
                        </div>
                      </th>
                      <th scope="col" className="text-center">
                        <div className="d-flex align-items-center flex-column">
                          <i className="font-20 text-danger simple-icon-trash" />
                          <small className="mt-1">Eliminar</small>
                        </div>
                      </th>
                      <th scope="col" className="text-center">
                        <div className="d-flex align-items-center flex-column">
                          <i className="font-20 text-success simple-icon-check" />
                          <small className="mt-1">Activar</small>
                        </div>
                      </th>
                      <th scope="col" className="text-center">
                        <div className="d-flex align-items-center flex-column">
                          <i className="font-20 text-dark simple-icon-close" />
                          <small className="mt-1">Inactivar</small>
                        </div>
                      </th>
                      <th scope="col" className="text-center">
                        <div className="d-flex align-items-center flex-column">
                          <i className="font-20 text-warning iconsminds-gear" />
                          <small className="mt-1">Full Acceso</small>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <>
                      <tr>
                        <th className="text-center" key={`check_read`}>
                          <Input
                            className="itemCheck mb-0"
                            type="checkbox"
                            id={`check_read`}
                            defaultChecked={data.readAction}
                            onChange={() => {
                              setValue('readAction', !data.readAction);
                            }}
                            label=""
                          />
                        </th>
                        <th className="text-center" key={`check_create`}>
                          <Input
                            className="itemCheck mb-0"
                            type="checkbox"
                            id={`check_create`}
                            defaultChecked={data.createAction}
                            onChange={() => {
                              setValue('createAction', !data.createAction);
                            }}
                            label=""
                          />
                        </th>
                        <th className="text-center" key={`check_update`}>
                          <Input
                            className="itemCheck mb-0"
                            type="checkbox"
                            id={`check_update`}
                            defaultChecked={data.updateAction}
                            onChange={() => {
                              setValue('updateAction', !data.updateAction);
                            }}
                            label=""
                          />
                        </th>
                        <th className="text-center" key={`check_delete`}>
                          <Input
                            className="itemCheck mb-0"
                            type="checkbox"
                            id={`check_delete`}
                            defaultChecked={data.deleteAction}
                            onChange={() => {
                              setValue('deleteAction', !data.deleteAction);
                            }}
                            label=""
                          />
                        </th>
                        <th className="text-center" key={`check_activate`}>
                          <Input
                            className="itemCheck mb-0"
                            type="checkbox"
                            id={`check_activate`}
                            defaultChecked={data.activateAction}
                            onChange={() => {
                              setValue('activateAction', !data.activateAction);
                            }}
                            label=""
                          />
                        </th>
                        <th className="text-center" key={`check_inactive`}>
                          <Input
                            className="itemCheck mb-0"
                            type="checkbox"
                            id={`check_inactive`}
                            defaultChecked={data.inactiveAction}
                            onChange={() => {
                              setValue('inactiveAction', !data.inactiveAction);
                            }}
                            label=""
                          />
                        </th>
                        <th className="text-center" key={`check_fullAccess}`}>
                          <Input
                            className="itemCheck mb-0"
                            type="checkbox"
                            id={`check_fullAccess`}
                            defaultChecked={data.fullAccess}
                            onChange={() => {
                              setValue('fullAccess', !data.fullAccess);
                            }}
                            label=""
                          />
                        </th>
                      </tr>
                    </>
                  </tbody>
                </Table>
              </div>
              <div className="form-group">
                <Table borderless>
                  <thead>
                    <tr>
                      <th scope="col">
                        <IntlMessages id="forms.submenus" />
                        <hr className="m-0" />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {menuItems ? (
                      menuItems.map((c: any) => {
                        return (
                          <>
                            <tr>
                              <th key={c.name}>
                                <i className={`font-20 text-info mr-2 ${c.icon}`} />
                                {c.name}
                              </th>
                            </tr>
                          </>
                        );
                      })
                    ) : (
                      <tr />
                    )}
                  </tbody>
                </Table>
              </div>
            </ModalBody>
            {props?.data?.id ? (
              <ModalFooter className="p-3">
                <CreateEditAuditInformation loading={loading} auditInfo={auditInfo} />
              </ModalFooter>
            ) : (
              <></>
            )}
          </AddNewModal>
        </>
      )}
    </>
  );
};

const mapDispatchToProps = { ...menuActions, ...moduleActions, ...roleActions };

const mapStateToProps = () => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(MenuCreateEdit);
