import React, { useEffect, useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import Select from 'react-select';
import { Input, Label, ModalBody, ModalFooter } from 'reactstrap';

import { loaderColor, loaderIcon } from '../../../constants/defaultValues';
import IntlMessages from '../../../helpers/IntlMessages';
import * as schoolAdministrativeActions from '../../../stores/actions/SchoolAdministrativeActions';
import { Colxx } from '../../common/CustomBootstrap';
import AddNewModal from '../../common/Data/AddNewModal';
import CreateEditAuditInformation from '../../common/Data/CreateEditAuditInformation';
import FormGroupCustom from '../../common/Data/FormGroupCustom';
import LabelCustom from '../../common/Data/LabelCustom';
import RequiredMessagesCustom from '../../common/Data/RequiredMessagesCustom';
import { Loader } from '../../common/Loader';

const SchoolAdministrativeCreateEdit = (props: any) => {
  const [loading, setLoading] = useState(true);
  const [schoolsList, setSchoolsList] = useState(null);
  const [campusList, setCampusList] = useState(null);
  const [school, setSchool] = useState(null);
  const [campus, setCampus] = useState(null);
  const [rolesList, setRolesList] = useState(null);
  const [documentTypesList, setDocumentTypesList] = useState(null);
  const [gendersList, setGendersList] = useState(null);
  const [birtdate, setBirtdate] = useState(null);
  const [role, setRole] = useState(null);
  const [gender, setGender] = useState(null);
  const [documentType, setDocumentType] = useState(null);
  const [newUser, setNewUser] = useState({
    name: null,
    lastName: null,
    phone: null,
    email: null,
    documentNumber: null,
    password: null,
    username: null,
    genderId: null,
    documentTypeId: null,
    roleId: null,
  });

  const methods = useForm({
    mode: 'all',
    reValidateMode: 'onChange',
  });

  const { handleSubmit, control, register, reset, setValue, formState, trigger } = methods;

  useEffect(() => {
    cleanForm();
    getDropdowns(props?.loginReducer?.schoolId);
    if (props?.data?.id) {
      if (props?.data?.school !== undefined && props?.data?.school != null) {
        setSchool({
          key: props?.data?.school?.id,
          label: props?.data?.school?.name,
          value: props?.data?.school?.id,
        });
      }
      if (props?.data?.campus !== undefined && props?.data?.campus != null) {
        setCampus(props?.data?.campus.map((c: any) => {
          return { label: c.name, value: c.id, key: c.id };
        }));
      }
      if (props?.data?.user !== undefined && props?.data?.user != null) {
        setNewUser({
          name: props?.data?.user?.name,
          lastName: props?.data?.user?.lastName,
          phone: props?.data?.user?.phone,
          email: props?.data?.user?.email,
          documentNumber: props?.data?.user?.documentNumber,
          password: props?.data?.user?.password,
          username: props?.data?.user?.username,
          genderId: props?.data?.user?.genderId,
          documentTypeId: props?.data?.user?.documentTypeId,
          roleId: props?.data?.user?.roleId,
        });
      }
      if (
        props?.data?.user &&
        props?.data?.user?.birthdate !== undefined &&
        props?.data?.user?.birthdate != null
      ) {
        setBirtdate(new Date(props?.data?.user?.birthdate));
      }
      if (
        props?.data?.user &&
        props?.data?.user?.role !== undefined &&
        props?.data?.user?.role != null
      ) {
        setRole({
          key: props?.data?.user?.role?.id,
          label: props?.data?.user?.role?.name,
          value: props?.data?.user?.role?.id,
        });
      }
      if (
        props?.data?.user &&
        props?.data?.user?.gender !== undefined &&
        props?.data?.user?.gender != null
      ) {
        setGender({
          key: props?.data?.user?.gender?.id,
          label: props?.data?.user?.gender?.name,
          value: props?.data?.user?.gender?.id,
        });
      }
      if (
        props?.data?.user &&
        props?.data?.user?.documentType !== undefined &&
        props?.data?.user?.documentType != null
      ) {
        setDocumentType({
          key: props?.data?.user?.documentType?.id,
          label: props?.data?.user?.documentType?.name,
          value: props?.data?.user?.documentType?.id,
        });
      }
      register('schoolId', {
        required: true,
        value: props?.data?.id ? props?.data?.schoolId : '',
      });
      register('newUser', {
        required: true,
        value: newUser,
      });
    }
    setLoading(false);
  }, [props?.data]);

  const cleanForm = async () => {
    reset();
    setSchool(null);
    setCampus(null);
    setNewUser({
      name: null,
      lastName: null,
      phone: null,
      email: null,
      documentNumber: null,
      password: null,
      username: null,
      genderId: null,
      documentTypeId: null,
      roleId: null,
    });
    setBirtdate(null);
    setRole(null);
    setGender(null);
    setDocumentType(null);
    if (props?.loginReducer?.schoolId && !props?.data?.id) {
      // set value when register is new and sesion contains value
      register('schoolId', {
        required: true,
        value: [props?.loginReducer?.schoolId],
      });
    }
  };

  const getDropdowns = async (schoolId: any) => {
    props.getDropdownsSchoolAdministrative('SchoolAdministrative', schoolId).then((data: any) => {
      setSchoolsList(
        data.dataSchools.edges.map((c: any) => {
          return { label: c.node.name, value: c.node.id, key: c.node.id };
        }),
      );
      setCampusList(
        data.dataCampus.edges.map((c: any) => {
          return { label: c.node.name, value: c.node.id, key: c.node.id };
        }),
      );
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
      let roles = data.dataRoles.edges;
      if (roles?.length == 1) {
        setRole({ label: roles[0].node.name, value: roles[0].node.id, key: roles[0].node.id });
        setValue('newUser', {
          ...{
            name: props?.data?.user?.name,
            lastName: props?.data?.user?.lastName,
            phone: props?.data?.user?.phone,
            email: props?.data?.user?.email,
            documentNumber: props?.data?.user?.documentNumber,
            password: props?.data?.user?.password,
            username: props?.data?.user?.username,
            genderId: props?.data?.user?.genderId,
            documentTypeId: props?.data?.user?.documentTypeId,
            roleId: roles[0]?.node?.id
          }
        });
      }
    });
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
              <FormGroupCustom>
                <LabelCustom id="forms.name" required={true} />
                <Input
                  name="name"
                  defaultValue={newUser.name}
                  onChange={(data) => {
                    setValue('newUser', { ...newUser, ...{ name: data.target.value } });
                    setNewUser({ ...newUser, ...{ name: data.target.value } });
                  }}
                />
                <RequiredMessagesCustom formState={formState} register={"name"} />
              </FormGroupCustom>
              <FormGroupCustom>
                <LabelCustom id="forms.lastname" required={true} />
                <Input
                  name="lastName"
                  defaultValue={newUser.lastName}
                  onChange={(data) => {
                    setValue('newUser', { ...newUser, ...{ lastName: data.target.value } });
                    setNewUser({ ...newUser, ...{ lastName: data.target.value } });
                  }}
                />
                <RequiredMessagesCustom formState={formState} register={"name"} />
              </FormGroupCustom>
              <FormGroupCustom>
                <LabelCustom id="forms.phone" required={false} />
                <Input
                  name="phone"
                  defaultValue={newUser.phone}
                  onChange={(data) => {
                    setValue('newUser', { ...newUser, ...{ phone: data.target.value } });
                    setNewUser({ ...newUser, ...{ phone: data.target.value } });
                  }}
                />
              </FormGroupCustom>
              <FormGroupCustom>
                <LabelCustom id="forms.email" required={false} />
                <Input
                  name="email"
                  defaultValue={newUser.email}
                  onChange={(data) => {
                    setValue('newUser', { ...newUser, ...{ email: data.target.value } });
                    setNewUser({ ...newUser, ...{ email: data.target.value } });
                  }}
                />
              </FormGroupCustom>
              <FormGroupCustom>
                <LabelCustom id="forms.birthdate" required={false} />
                <ReactDatePicker
                  selected={birtdate}
                  onChange={(date) => {
                    setValue('newUser', { ...newUser, ...{ birthdate: date as Date } });
                    setNewUser({ ...newUser, ...{ birthdate: date as Date } });
                    setBirtdate(date as Date);
                  }}
                />
              </FormGroupCustom>
              <FormGroupCustom>
                <LabelCustom id="forms.role" required={true} />
                <Select
                  isClearable
                  placeholder={<IntlMessages id="forms.select" />}
                  className="react-select"
                  classNamePrefix="react-select"
                  options={rolesList}
                  value={role}
                  isDisabled={rolesList?.length <= 1}
                  onChange={(selectedOption) => {
                    newUser.roleId = selectedOption?.key;
                    setValue('newUser', { ...newUser });
                    setRole(selectedOption);
                  }}
                />
                <RequiredMessagesCustom formState={formState} register={"name"} />
              </FormGroupCustom>
              <FormGroupCustom>
                <LabelCustom id="forms.gender" required={true} />
                <Select
                  isClearable
                  placeholder={<IntlMessages id="forms.select" />}
                  className="react-select"
                  classNamePrefix="react-select"
                  options={gendersList}
                  value={gender}
                  onChange={(selectedOption) => {
                    newUser.genderId = selectedOption?.key;
                    setValue('newUser', { ...newUser });
                    setGender(selectedOption);
                  }}
                />
                <RequiredMessagesCustom formState={formState} register={"name"} />
              </FormGroupCustom>
              <FormGroupCustom>
                <LabelCustom id="forms.documentType" required={true} />
                <Select
                  isClearable
                  placeholder={<IntlMessages id="forms.select" />}
                  className="react-select"
                  classNamePrefix="react-select"
                  options={documentTypesList}
                  value={documentType}
                  onChange={(selectedOption) => {
                    newUser.documentTypeId = selectedOption?.key;
                    setValue('newUser', { ...newUser });
                    setDocumentType(selectedOption);
                  }}
                />
                <RequiredMessagesCustom formState={formState} register={"name"} />
              </FormGroupCustom>
              <FormGroupCustom>
                <LabelCustom id="forms.documentNumber" required={true} />
                <Input
                  name="documentNumber"
                  defaultValue={newUser.documentNumber}
                  onChange={(data) => {
                    setValue('newUser', { ...newUser, ...{ documentNumber: data.target.value } });
                    setNewUser({ ...newUser, ...{ documentNumber: data.target.value } });
                  }}
                />
                <RequiredMessagesCustom formState={formState} register={"name"} />
              </FormGroupCustom>
              {!props?.loginReducer?.schoolId ? (
                <FormGroupCustom>
                  <LabelCustom id="menu.school" required={true} />
                  <Select
                    isClearable
                    placeholder={<IntlMessages id="forms.select" />}
                    {...register('schoolId', { required: true })}
                    className="react-select"
                    classNamePrefix="react-select"
                    options={schoolsList}
                    value={school}
                    onChange={(selectedOption) => {
                      setValue('schoolId', selectedOption?.key);
                      setSchool(selectedOption);
                      getDropdowns(selectedOption?.key);
                      trigger("schoolId")
                    }}
                  />
                  <RequiredMessagesCustom formState={formState} register={"schoolId"} />
                </FormGroupCustom>
              ) : (
                ''
              )}
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
  ...schoolAdministrativeActions,
};

const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

export default connect(mapStateToProps, mapDispatchToProps)(SchoolAdministrativeCreateEdit);
