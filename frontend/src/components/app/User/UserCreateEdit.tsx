import { DevTool } from '@hookform/devtools';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useForm } from 'react-hook-form';
import { Loader } from '../../common/Loader';
import { connect } from 'react-redux';
import Select from 'react-select';
import { Input, Label, ModalBody, ModalFooter } from 'reactstrap';
import IntlMessages from '../../../helpers/IntlMessages';
import * as UserActions from '../../../stores/actions/UserActions';
import { Colxx } from '../../common/CustomBootstrap';
import AddNewModal from '../../common/Data/AddNewModal';
import CreateEditAuditInformation from '../../common/Data/CreateEditAuditInformation';

const UserCreateEdit = (props: any) => {
  const [loading, setLoading] = useState(true);
  const [rolesList, setRolesList] = useState(null);
  const [documentTypesList, setDocumentTypesList] = useState(null);
  const [gendersList, setGendersList] = useState(null);
  const [birtdate, setBirtdate] = useState(null);
  const [role, setRole] = useState(null);
  const [gender, setGender] = useState(null);
  const [documentType, setDocumentType] = useState(null);

  const methods = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const { handleSubmit, control, register, reset, setValue, getValues } = methods;

  useEffect(() => {
    cleanForm();
    getDropdowns();
    if (props?.data?.id) {
      if (props?.data?.birthdate !== undefined && props?.data?.birthdate != null) {
        setBirtdate(new Date(props?.data?.birthdate));
      }
      if (props?.data?.role !== undefined && props?.data?.role != null) {
        setRole({
          key: props?.data?.role?.id,
          label: props?.data?.role?.name,
          value: props?.data?.role?.id,
        });
      }
      if (props?.data?.gender !== undefined && props?.data?.gender != null) {
        setGender({
          key: props?.data?.gender?.id,
          label: props?.data?.gender?.name,
          value: props?.data?.gender?.id,
        });
      }
      if (props?.data?.documentType !== undefined && props?.data?.documentType != null) {
        setDocumentType({
          key: props?.data?.documentType?.id,
          label: props?.data?.documentType?.name,
          value: props?.data?.documentType?.id,
        });
      }
    }
    setLoading(false);
  }, [props?.data]);

  const cleanForm = async () => {
    reset();
    setBirtdate(null);
    setRole(null);
    setGender(null);
    setDocumentType(null);
  };

  const getDropdowns = async () => {
    props.getDropdownsUser().then((data: any) => {
      setRolesList(
        data.dataRoles.edges.map((c: any) => {
          return { label: c.node.name, value: c.node.id, key: c.node.id };
        }),
      );
      setGendersList(
        data.dataGenders.edges.map((c: any) => {
          return { label: c.node.name, value: c.node.id, key: c.node.id };
        }),
      );
      setDocumentTypesList(
        data.dataDocumentTypes.edges.map((c: any) => {
          return { label: c.node.name, value: c.node.id, key: c.node.id };
        }),
      );
    });
  };

  const { ref: nameRef, ...nameRest } = register('name', {
    required: true,
    value: props?.data?.id ? props?.data?.name : '',
  });
  const { ref: lastNameRef, ...lastNameRest } = register('lastName', {
    required: true,
    value: props?.data?.id ? props?.data?.lastName : '',
  });
  const { ref: phoneRef, ...phoneRest } = register('phone', {
    required: true,
    value: props?.data?.id ? props?.data?.phone : '',
  });
  const { ref: emailRef, ...emailRest } = register('email', {
    required: true,
    value: props?.data?.id ? props?.data?.email : '',
  });
  const { ref: documentNumberRef, ...documentNumberRest } = register('documentNumber', {
    required: true,
    value: props?.data?.id ? props?.data?.documentNumber : '',
  });
  const { ref: usernameRef, ...usernameRest } = register('username', {
    required: true,
    value: props?.data?.id ? props?.data?.username : '',
  });
  const { ref: passwordRef, ...passwordRest } = register('password', {
    required: true,
    value: props?.data?.id ? props?.data?.password : '',
  });
  register('roleId', {
    required: true,
    value: props?.data?.id ? props?.data?.roleId : '',
  });
  register('genderId', {
    required: true,
    value: props?.data?.id ? props?.data?.genderId : '',
  });
  register('documentTypeId', {
    required: true,
    value: props?.data?.id ? props?.data?.documentTypeId : '',
  });

  const auditInfo = {
    createdAt: props?.data?.id ? props?.data?.createdAt : null,
    updatedAt: props?.data?.id ? props?.data?.createdAt : null,
    createdByUser: props?.data?.id ? props?.data?.createdByUser : null,
    updatedByUser: props?.data?.id ? props?.data?.updatedByUser : null,
    version: props?.data?.id ? props?.data?.version : null,
  };

  return (
    <>
      {/* <DevTool control={methods.control} placement="top-left" /> */}
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
              <div className="form-group">
                <Label>
                  <IntlMessages id="forms.lastname" />
                </Label>
                <Input {...lastNameRest} innerRef={lastNameRef} className="form-control" />
              </div>
              <div className="form-group">
                <Label>
                  <IntlMessages id="forms.phone" />
                </Label>
                <Input {...phoneRest} innerRef={phoneRef} className="form-control" />
              </div>
              <div className="form-group">
                <Label>
                  <IntlMessages id="forms.email" />
                </Label>
                <Input {...emailRest} innerRef={emailRef} className="form-control" />
              </div>
              <div className="form-group">
                <Label>
                  <IntlMessages id="forms.birthdate" />
                </Label>
                <DatePicker
                  {...register('birthdate', { required: true })}
                  selected={birtdate}
                  onChange={(date) => {
                    setValue('birthdate', date as Date);
                    setBirtdate(date as Date);
                  }}
                />
              </div>
              <div className="form-group">
                <Label>
                  <IntlMessages id="forms.user" />
                </Label>
                <Input {...usernameRest} innerRef={usernameRef} className="form-control" />
              </div>
              <div className="form-group">
                <Label>
                  <IntlMessages id="user.password" />
                </Label>
                <Input {...passwordRest} innerRef={passwordRef} className="form-control" />
              </div>
              <div className="form-group">
                <Label>
                  <IntlMessages id="forms.role" />
                </Label>
                <Select
                  isClearable
                  placeholder={<IntlMessages id="forms.select" />}
                  {...register('roleId', { required: true })}
                  className="react-select"
                  classNamePrefix="react-select"
                  options={rolesList}
                  value={role}
                  onChange={(selectedOption) => {
                    setValue('roleId', selectedOption?.key);
                    setRole(selectedOption);
                  }}
                />
              </div>
              <div className="form-group">
                <Label>
                  <IntlMessages id="forms.gender" />
                </Label>
                <Select
                  isClearable
                  placeholder={<IntlMessages id="forms.select" />}
                  {...register('genderId', { required: true })}
                  className="react-select"
                  classNamePrefix="react-select"
                  options={gendersList}
                  value={gender}
                  onChange={(selectedOption) => {
                    setValue('genderId', selectedOption?.key);
                    setGender(selectedOption);
                  }}
                />
              </div>
              <div className="form-group">
                <Label>
                  <IntlMessages id="forms.documentType" />
                </Label>
                <Select
                  isClearable
                  placeholder={<IntlMessages id="forms.select" />}
                  {...register('documentTypeId', { required: true })}
                  className="react-select"
                  classNamePrefix="react-select"
                  options={documentTypesList}
                  value={documentType}
                  onChange={(selectedOption) => {
                    setValue('documentTypeId', selectedOption?.key);
                    setDocumentType(selectedOption);
                  }}
                />
              </div>
              <div className="form-group">
                <Label>
                  <IntlMessages id="forms.documentNumber" />
                </Label>
                <Input
                  {...documentNumberRest}
                  innerRef={documentNumberRef}
                  className="form-control"
                />
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

const mapDispatchToProps = {
  ...UserActions
};

const mapStateToProps = () => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(UserCreateEdit);
