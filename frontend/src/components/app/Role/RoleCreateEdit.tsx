import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Loader } from '../../common/Loader';
import { connect } from 'react-redux';
import { Input, Label, ModalBody, ModalFooter } from 'reactstrap';
import IntlMessages from '../../../helpers/IntlMessages';
import * as menuActions from '../../../stores/actions/MenuModelActions';
import * as roleActions from '../../../stores/actions/RoleActions';
import { Colxx } from '../../common/CustomBootstrap';
import AddNewModal from '../../common/Data/AddNewModal';
import CreateEditAuditInformation from '../../common/Data/CreateEditAuditInformation';

const RoleCreateEdit = (props: any) => {
  const [loading, setLoading] = useState(true);

  const methods = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const { handleSubmit, control, register, reset, setValue, getValues } = methods;

  useEffect(() => {
    cleanForm();
    setLoading(false);
  }, [props?.data]);

  const cleanForm = async () => {
    reset();
  };

  const { ref: nameRef, ...nameRest } = register('name', {
    required: true,
    value: props?.data?.id ? props?.data?.name : '',
  });

  const data = {
    isSchoolAdministrator:
      props?.data?.id ||
        props?.data?.isSchoolAdministrator === methods.getValues('isSchoolAdministrator')
        ? props?.data?.isSchoolAdministrator
        : methods.getValues('isSchoolAdministrator'),
    isCampusAdministrator:
      props?.data?.id ||
        props?.data?.isCampusAdministrator === methods.getValues('isCampusAdministrator')
        ? props?.data?.isCampusAdministrator
        : methods.getValues('isCampusAdministrator'),
    isCampusCoordinator:
      props?.data?.id ||
        props?.data?.isCampusCoordinator === methods.getValues('isCampusCoordinator')
        ? props?.data?.isCampusCoordinator
        : methods.getValues('isCampusCoordinator'),
    isStudent:
      props?.data?.id || props?.data?.isStudent === methods.getValues('isStudent')
        ? props?.data?.isStudent
        : methods.getValues('isStudent'),
    isTeacher:
      props?.data?.id || props?.data?.isTeacher === methods.getValues('isTeacher')
        ? props?.data?.isTeacher
        : methods.getValues('isTeacher'),
    isSchoolAdministrative:
      props?.data?.id || props?.data?.isSchoolAdministrative === methods.getValues('isSchoolAdministrative')
        ? props?.data?.isSchoolAdministrative
        : methods.getValues('isSchoolAdministrative'),
    isGuardian:
      props?.data?.id || props?.data?.isGuardian === methods.getValues('isGuardian')
        ? props?.data?.isGuardian
        : methods.getValues('isGuardian'),
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
              <div className="form-group mt-5">
                <h6>
                  <IntlMessages id="forms.assignableRoles" />
                </h6>
              </div>
              <div className="form-group d-flex align-items-center">
                <Input
                  className="itemCheck m-0 mr-2"
                  type="checkbox"
                  id={`check_isSchoolAdministrator`}
                  defaultChecked={data.isSchoolAdministrator}
                  onChange={() => {
                    setValue('isSchoolAdministrator', !data.isSchoolAdministrator);
                  }}
                  label=""
                />
                {<IntlMessages id="menu.administratorsSchool" />}
              </div>
              <div className="form-group d-flex align-items-center">
                <Input
                  className="itemCheck m-0 mr-2"
                  type="checkbox"
                  id={`check_isCampusAdministrator`}
                  defaultChecked={data.isCampusAdministrator}
                  onChange={() => {
                    setValue('isCampusAdministrator', !data.isCampusAdministrator);
                  }}
                  label=""
                />
                {<IntlMessages id="menu.administratorsCampus" />}
              </div>
              <div className="form-group d-flex align-items-center">
                <Input
                  className="itemCheck m-0 mr-2"
                  type="checkbox"
                  id={`check_isCampusCoordinator`}
                  defaultChecked={data.isCampusCoordinator}
                  onChange={() => {
                    setValue('isCampusCoordinator', !data.isCampusCoordinator);
                  }}
                  label=""
                />
                {<IntlMessages id="menu.coordinatorsCampus" />}
              </div>
              <div className="form-group d-flex align-items-center">
                <Input
                  className="itemCheck m-0 mr-2"
                  type="checkbox"
                  id={`check_isStudent`}
                  defaultChecked={data.isStudent}
                  onChange={() => {
                    setValue('isStudent', !data.isStudent);
                  }}
                  label=""
                />
                {<IntlMessages id="menu.students" />}
              </div>
              <div className="form-group d-flex align-items-center">
                <Input
                  className="itemCheck m-0 mr-2"
                  type="checkbox"
                  id={`check_isTeacher`}
                  defaultChecked={data.isTeacher}
                  onChange={() => {
                    setValue('isTeacher', !data.isTeacher);
                  }}
                  label=""
                />
                {<IntlMessages id="menu.teachers" />}
              </div>
              <div className="form-group d-flex align-items-center">
                <Input
                  className="itemCheck m-0 mr-2"
                  type="checkbox"
                  id={`check_isSchoolAdministrative`}
                  defaultChecked={data.isSchoolAdministrative}
                  onChange={() => {
                    setValue('isSchoolAdministrative', !data.isSchoolAdministrative);
                  }}
                  label=""
                />
                {<IntlMessages id="menu.schoolAdministratives" />}
              </div>
              <div className="form-group d-flex align-items-center">
                <Input
                  className="itemCheck m-0 mr-2"
                  type="checkbox"
                  id={`check_isGuardian`}
                  defaultChecked={data.isGuardian}
                  onChange={() => {
                    setValue('isGuardian', !data.isGuardian);
                  }}
                  label=""
                />
                <span>{<IntlMessages id="menu.guardians" />}</span>
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

const mapDispatchToProps = { ...roleActions, ...menuActions };

const mapStateToProps = () => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(RoleCreateEdit);
