import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import { connect } from 'react-redux';
import Select from 'react-select';
import { Input, Label, ModalBody, ModalFooter } from 'reactstrap';

import IntlMessages from '../../../helpers/IntlMessages';
import * as componentEvaluativeActions from '../../../stores/actions/ComponentEvaluativeActions';
import { Colxx } from '../../common/CustomBootstrap';
import AddNewModal from '../../common/Data/AddNewModal';
import CreateEditAuditInformation from '../../common/Data/CreateEditAuditInformation';
import FormGroupCustom from '../../common/Data/FormGroupCustom';
import LabelCustom from '../../common/Data/LabelCustom';
import RequiredMessagesCustom from '../../common/Data/RequiredMessagesCustom';
import { Loader } from '../../common/Loader';

const ComponentEvaluativeCreateEdit = (props: any) => {
  const [loading, setLoading] = useState(true);
  const [schoolList, setSchoolList] = useState(null);
  const [school, setSchool] = useState(null);
  const [campus, setCampus] = useState(null);
  const [schoolYearList, setSchoolYearList] = useState(null);
  const [schoolYear, setSchoolYear] = useState(null);
  const [types, setTypes] = useState([]);
  const [type, setType] = useState(null);
  const [academicAreas, setAcademicAreas] = useState(null);
  const [academicAreasList, setAcademicAreasList] = useState([]);
  const [academicAsignatures, setAcademicAsignatures] = useState(null);
  const [academicAsignaturesList, setAcademicAsignaturesList] = useState([]);
  const intl = useIntl();

  const methods = useForm({
    mode: 'all',
    reValidateMode: 'onChange',
  });

  const { handleSubmit, control, register, reset, setValue, formState, trigger } = methods;

  useEffect(() => {
    cleanForm();
    getDropdowns();
    if (props?.data?.id) {
      if (props?.data?.school !== undefined && props?.data?.school != null) {
        setSchool({
          key: props?.data?.school?.id,
          label: props?.data?.school?.name,
          value: props?.data?.school?.id,
        });
      }
      if (props?.data?.schoolYear !== undefined && props?.data?.schoolYear != null) {
        setSchoolYear({
          key: props?.data?.schoolYear?.id,
          label: props?.data?.schoolYear?.schoolYear,
          value: props?.data?.schoolYear?.id,
        });
      }
      if (props?.data?.type !== undefined && props?.data?.type != null) {
        setType({
          key: props?.data?.type,
          label: intl.messages['display.' + props?.data?.type],
          value: props?.data?.type,
        });
      }
      if (props?.data?.academicAreas !== undefined && props?.data?.academicAreas != null) {
        setAcademicAreas(
          props?.data?.academicAreas.map((c: any) => {
            return { label: c.name, value: c.id, key: c.id };
          }),
        );
      }
      if (
        props?.data?.academicAsignatures !== undefined &&
        props?.data?.academicAsignatures != null
      ) {
        setAcademicAsignatures(
          props?.data?.academicAsignatures.map((c: any) => {
            return { label: c.name, value: c.id, key: c.id };
          }),
        );
      }
      register('schoolId', {
        required: true,
        value: props?.data?.id && props?.data?.schoolId ? props?.data?.schoolId : props?.loginReducer?.schoolId,
      });
      register('schoolYearId', {
        required: true,
        value: props?.data?.id && props?.data?.schoolYearId ? props?.data?.schoolYearId : props?.loginReducer?.schoolYear,
      });
      register('type', {
        required: true,
        value: props?.data?.id ? props?.data?.type : '',
      });
      register('academicAreasId', {
        required: props?.data?.type == 'AREA' ? true : false,
        value: props?.data?.id ? props?.data?.academicAreasId : '',
      });
      register('academicAsignaturesId', {
        required: props?.data?.type == 'ASIGNATURE' ? true : false,
        value: props?.data?.id ? props?.data?.academicAsignaturesId : '',
      });
    } else {
      setSchool({
        key: props?.loginReducer?.schoolData?.id,
        label: props?.loginReducer?.schoolData?.name,
        value: props?.loginReducer?.schoolData?.id,
      });
      setSchoolYear({ label: props?.loginReducer?.schoolYearName, value: props?.loginReducer?.schoolYear, key: props?.loginReducer?.schoolYear });
    }
    setLoading(false);
  }, [props?.data]);

  const cleanForm = async () => {
    reset();
    setSchool(null);
    setType(null);
    setAcademicAreas(null);
    setAcademicAsignatures(null);
    if (props?.loginReducer?.schoolId && !props?.data?.id) {
      // set value when register is new and sesion contains value
      register('schoolId', {
        required: true,
        value: props?.loginReducer?.schoolId,
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
  const getDropdowns = async () => {
    props.getEvaluativeComponentTypes().then((data: any) => {
      setTypes(
        data.map((c: any) => {
          return { label: intl.messages['display.' + c.name], value: c.name, key: c.name };
        }),
      );
    });
    props.getDropdownsComponentEvaluative(props?.loginReducer?.schoolId, props?.loginReducer?.schoolYear,).then((data: any) => {
      setAcademicAreasList(
        data.dataAreas.edges.map((c: any) => {
          return { label: c.node.name, value: c.node.id, key: c.node.id };
        }),
      );
      setAcademicAsignaturesList(
        data.dataAsignatures.edges.map((c: any) => {
          return { label: c.node.name, value: c.node.id, key: c.node.id };
        }),
      );
    });
    setSchoolList(
      [{
        key: props?.loginReducer?.schoolData?.id,
        label: props?.loginReducer?.schoolData?.name,
        value: props?.loginReducer?.schoolData?.id,
      }]
    );
    setSchoolYearList(
      [{ label: props?.loginReducer?.schoolYearName, value: props?.loginReducer?.schoolYear, key: props?.loginReducer?.schoolYear }]
    )
  };

  const { ref: nameRef, ...nameRest } = register('name', {
    required: true,
    value: props?.data?.id ? props?.data?.name : '',
  });
  const { ref: weightRef, ...weightRest } = register('weight', {
    required: true,
    value: props?.data?.id ? props?.data?.weight : '',
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
                <LabelCustom id="forms.name" required={true} />
                <Input {...nameRest} innerRef={nameRef} className="form-control" />
                <RequiredMessagesCustom formState={formState} register={"name"} />
              </FormGroupCustom>
              <FormGroupCustom>
                <LabelCustom id="forms.weight" required={true} />
                <Input {...weightRest} innerRef={weightRef} className="form-control" />
                <RequiredMessagesCustom formState={formState} register={"weight"} />
              </FormGroupCustom>
              <>
                <FormGroupCustom>
                  <LabelCustom id="forms.type" required={true} />
                  <Select
                    isClearable
                    placeholder={<IntlMessages id="forms.select" />}
                    {...register('type', { required: true })}
                    className="react-select"
                    classNamePrefix="react-select"
                    options={types}
                    value={type}
                    onChange={(selectedOption: any) => {
                      setValue('type', selectedOption?.key);
                      setType(selectedOption);
                      setValue('academicAreasId', null);
                      setAcademicAreas(null);
                      setValue('academicAsignaturesId', null);
                      setAcademicAsignatures(null);
                      register('academicAreasId', {
                        required: props?.data?.type == 'AREA' ? true : false,
                        value: props?.data?.id ? props?.data?.academicAreasId : '',
                      });
                      register('academicAsignaturesId', {
                        required: props?.data?.type == 'ASIGNATURE' ? true : false,
                        value: props?.data?.id ? props?.data?.academicAsignaturesId : '',
                      });
                      trigger('type');
                    }}
                  />
                  <RequiredMessagesCustom formState={formState} register={"type"} />
                </FormGroupCustom>
                {type ? (
                  <>
                    {type?.key === 'AREA' ? (
                      <>
                        <FormGroupCustom>
                          <LabelCustom id="menu.areas" required={true} />
                          <Select
                            isClearable
                            placeholder={<IntlMessages id="forms.select" />}
                            isMulti
                            {...register('academicAreasId', { required: true })}
                            className="react-select"
                            classNamePrefix="react-select"
                            options={academicAreasList}
                            value={academicAreas}
                            onChange={(selectedOption: any) => {
                              setValue(
                                'academicAreasId',
                                selectedOption.map((c: any) => {
                                  return c.key;
                                }),
                              );
                              setAcademicAreas(selectedOption);
                              trigger('academicAreasId');
                            }}
                          />
                          <RequiredMessagesCustom formState={formState} register={"academicAreasId"} />
                        </FormGroupCustom>
                      </>
                    ) : (
                      ''
                    )}
                    {type?.key === 'ASIGNATURE' ? (
                      <>
                        <FormGroupCustom>
                          <LabelCustom id="menu.asignatures" required={true} />
                          <Select
                            isClearable
                            placeholder={<IntlMessages id="forms.select" />}
                            isMulti
                            {...register('academicAsignaturesId', { required: true })}
                            className="react-select"
                            classNamePrefix="react-select"
                            options={academicAsignaturesList}
                            value={academicAsignatures}
                            onChange={(selectedOption: any) => {
                              setValue(
                                'academicAsignaturesId',
                                selectedOption.map((c: any) => {
                                  return c.key;
                                }),
                              );
                              setAcademicAsignatures(selectedOption);
                              trigger('academicAsignaturesId');
                            }}
                          />
                          <RequiredMessagesCustom formState={formState} register={"academicAsignaturesId"} />
                        </FormGroupCustom>
                      </>
                    ) : (
                      ''
                    )}
                  </>
                ) : (
                  ''
                )}
              </>
              <FormGroupCustom>
                <LabelCustom id="menu.ie" required={true} />
                <Select
                  isClearable
                  placeholder={<IntlMessages id="forms.select" />}
                  {...register('schoolId', { required: true })}
                  className="react-select"
                  classNamePrefix="react-select"
                  options={schoolList}
                  value={school}
                  isDisabled={true}
                />
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

const mapDispatchToProps = { ...componentEvaluativeActions };

const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

export default connect(mapStateToProps, mapDispatchToProps)(ComponentEvaluativeCreateEdit);
