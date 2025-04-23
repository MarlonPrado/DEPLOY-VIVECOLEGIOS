import React, { useEffect, useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import Select from 'react-select';
import { Button, Input, Label, ModalBody, ModalFooter } from 'reactstrap';

import { loaderColor, loaderIcon } from '../../../constants/defaultValues';
import IntlMessages from '../../../helpers/IntlMessages';
import * as TeacherActions from '../../../stores/actions/TeacherActions';
import * as userActions from '../../../stores/actions/UserActions';
import { Colxx } from '../../common/CustomBootstrap';
import AddNewModal from '../../common/Data/AddNewModal';
import CreateEditAuditInformation from '../../common/Data/CreateEditAuditInformation';
import FormGroupCustom from '../../common/Data/FormGroupCustom';
import LabelCustom from '../../common/Data/LabelCustom';
import RequiredMessagesCustom from '../../common/Data/RequiredMessagesCustom';
import { Loader } from '../../common/Loader';

const TeacherCreateEdit = (props: any) => {
  const [loading, setLoading] = useState(true);
  const [schoolsList, setSchoolsList] = useState(null);
  const [campusList, setCampusList] = useState(null);
  const [schoolYearList, setSchoolYearList] = useState(null);
  const [schoolYear, setSchoolYear] = useState(null);
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
    username: null,
    genderId: null,
    documentTypeId: null,
    roleId: null,
  });

  const [validateUser, setValidateUser] = useState(false);

  const methods = useForm({
    mode: 'all',
    reValidateMode: 'onChange',
  });

  const { handleSubmit, control, register, reset, setValue, formState, trigger } = methods;

  useEffect(() => {
    cleanForm();
    getDropdowns(props?.loginReducer?.schoolId);
    if (props?.data?.id) {
      if (props?.data?.schoolYear !== undefined && props?.data?.schoolYear != null) {
        setSchoolYear({
          key: props?.data?.schoolYear?.id,
          label: props?.data?.schoolYear?.schoolYear,
          value: props?.data?.schoolYear?.id,
        });
        setSchoolYearList(
          [{ label: props?.data?.schoolYear?.schoolYear, value: props?.data?.schoolYear?.id, key: props?.data?.schoolYear?.id, }]
        )
        setSchoolYear({ label: props?.loginReducer?.schoolYearName, value: props?.loginReducer?.schoolYear, key: props?.loginReducer?.schoolYear });
      }
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
          username: props?.data?.user?.username,
          genderId: props?.data?.user?.genderId,
          documentTypeId: props?.data?.user?.documentTypeId,
          roleId: props?.data?.user?.roleId,
        });
        setValidateUser(true);
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
      register('campusId', {
        required: true,
        value: props?.data?.id ? props?.data?.campusId : '',
      });
      register('newUser', {
        required: true,
        value: {
          name: props?.data?.user?.name,
          lastName: props?.data?.user?.lastName,
          phone: props?.data?.user?.phone,
          email: props?.data?.user?.email,
          documentNumber: props?.data?.user?.documentNumber,
          username: props?.data?.user?.username,
          genderId: props?.data?.user?.genderId,
          documentTypeId: props?.data?.user?.documentTypeId,
          roleId: props?.data?.user?.roleId,
        },
      });
      register('schoolYearId', {
        required: true,
        value: props?.data?.id ? props?.data?.schoolYearId : '',
      });
    }
    setLoading(false);
  }, [props?.data]);

  const cleanForm = async () => {
    reset();
    setSchool(null);
    setSchoolYear(null);
    setCampus(null);
    setNewUser({
      name: null,
      lastName: null,
      phone: null,
      email: null,
      documentNumber: null,
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
    if (props?.loginReducer?.schoolYear && !props?.data?.id) {
      // set value when register is new and sesion contains value
      register('schoolYearId', {
        required: true,
        value: props?.loginReducer?.schoolYear,
      });
    }
  };

  const getDropdowns = async (schoolId: any) => {
    props.getDropdownsTeacher('Teacher', schoolId).then((data: any) => {
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
      if (!props?.data?.id) {
        setSchoolYearList(
          [{ label: props?.loginReducer?.schoolYearName, value: props?.loginReducer?.schoolYear, key: props?.loginReducer?.schoolYear }]
        )
        setSchoolYear({ label: props?.loginReducer?.schoolYearName, value: props?.loginReducer?.schoolYear, key: props?.loginReducer?.schoolYear });
      }
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
        if (!props?.data?.id) {
          setValue('newUser', {
            ...newUser, ...{
              roleId: roles[0]?.node?.id
            }
          });
          setNewUser({
            ...newUser, ...{
              roleId: roles[0]?.node?.id
            }
          })
        }
      }
    });
  };

  const searchDocumentUser = async () => {
    await props.getUserByDocumentNumber(methods.getValues().newUser.documentNumber).then((data: any) => {
      setValidateUser(true);
      if (data) {
        setValue('newUser', {
          ...newUser, ...{
            name: data?.name,
            lastName: data?.lastName,
            phone: data?.phone,
            email: data?.email,
            documentNumber: data?.documentNumber,
            username: data?.username,
            genderId: data?.genderId,
            documentTypeId: data?.documentTypeId,
          }
        });
        setNewUser({
          ...newUser, ...{
            name: data?.name,
            lastName: data?.lastName,
            phone: data?.phone,
            email: data?.email,
            documentNumber: data?.documentNumber,
            username: data?.username,
            genderId: data?.genderId,
            documentTypeId: data?.documentTypeId,
          }
        });
      }
    })
  }

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
            validateForm={true}
          >
            <ModalBody>
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
                <div style={{ display: "grid", gridTemplateColumns: "80% 20%" }}>
                  <Input
                    name="documentNumber"
                    defaultValue={newUser.documentNumber}
                    onChange={(data) => {
                      setValue('newUser', { ...newUser, ...{ documentNumber: data.target.value } });
                      setNewUser({ ...newUser, ...{ documentNumber: data.target.value } });
                    }}
                  />
                  <Button className="top-right-button mr-1 ml-1"
                    disabled={documentType == null || methods?.getValues()?.newUser?.documentNumber == undefined || methods?.getValues()?.newUser?.documentNumber == null || methods?.getValues()?.newUser?.documentNumber?.length == 0}
                    onClick={() => {
                      return searchDocumentUser();
                    }}>
                    <i className="simple-icon-magnifier" />
                  </Button>
                </div>
                <RequiredMessagesCustom formState={formState} register={"name"} />
              </FormGroupCustom>
              <FormGroupCustom>
                <LabelCustom id="forms.user" required={true} />
                <Input
                  name="username"
                  defaultValue={newUser.username}
                  onChange={(data) => {
                    setValue('newUser', { ...newUser, ...{ username: data.target.value } });
                    setNewUser({ ...newUser, ...{ username: data.target.value } });
                  }}
                  disabled={true}
                />
                <RequiredMessagesCustom formState={formState} register={"name"} />
              </FormGroupCustom>
              <FormGroupCustom>
                <LabelCustom id="forms.name" required={true} />
                <Input
                  name="name"
                  defaultValue={newUser.name}
                  onChange={(data) => {
                    setValue('newUser', { ...newUser, ...{ name: data.target.value } });
                    setNewUser({ ...newUser, ...{ name: data.target.value } });
                  }}
                  disabled={!validateUser}
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
                  disabled={!validateUser}
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
                  disabled={!validateUser}
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
                  disabled={!validateUser}
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
                  disabled={!validateUser}
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
                  isDisabled={!validateUser}
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
                      setValue('schoolId', [selectedOption?.key]);
                      setSchool(selectedOption);
                      getDropdowns(selectedOption?.key);
                      trigger("schoolId")
                    }}
                  />
                  <RequiredMessagesCustom formState={formState} register={"name"} />
                </FormGroupCustom>
              ) : (
                ''
              )}
              <FormGroupCustom>
                <LabelCustom id="menu.campus" required={true} />
                <Select
                  isClearable
                  placeholder={<IntlMessages id="forms.select" />}
                  isMulti
                  {...register('campusId', { required: true })}
                  className="react-select"
                  classNamePrefix="react-select"
                  options={campusList}
                  value={campus}
                  onChange={(selectedOption: any) => {
                    setValue('campusId', selectedOption.map((c: any) => { return c.key }));
                    setCampus(selectedOption);
                    trigger("campusId")
                  }}
                  isDisabled={!validateUser}
                />
                <RequiredMessagesCustom formState={formState} register={"name"} />
              </FormGroupCustom>

              <FormGroupCustom>
                <LabelCustom id="menu.schoolYear" required={true} />
                <Select
                  isClearable
                  placeholder={<IntlMessages id="forms.select" />}
                  {...register('schoolYearId', { required: true })}
                  className="react-select"
                  classNamePrefix="react-select"
                  options={schoolYearList}
                  value={schoolYear}
                  isDisabled={true}
                />
                <RequiredMessagesCustom formState={formState} register={"name"} />
              </FormGroupCustom>
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
  ...TeacherActions, ...userActions
};

const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

export default connect(mapStateToProps, mapDispatchToProps)(TeacherCreateEdit);
