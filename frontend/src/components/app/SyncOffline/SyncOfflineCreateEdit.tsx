import moment from 'moment';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import Select from 'react-select';
import { Input, InputGroup, InputGroupText, Label, ModalBody, ModalFooter } from 'reactstrap';

import IntlMessages from '../../../helpers/IntlMessages';
import * as SyncOfflineActions from '../../../stores/actions/SyncOfflineActions';
import { Colxx } from '../../common/CustomBootstrap';
import AddNewModal from '../../common/Data/AddNewModal';
import CreateEditAuditInformation from '../../common/Data/CreateEditAuditInformation';
import FormGroupCustom from '../../common/Data/FormGroupCustom';
import LabelCustom from '../../common/Data/LabelCustom';
import RequiredMessagesCustom from '../../common/Data/RequiredMessagesCustom';
import { Loader } from '../../common/Loader';

const SyncOfflineCreateEdit = (props: any) => {
  const [loading, setLoading] = useState(true);
  const [schoolList, setSchoolList] = useState(null);
  const [school, setSchool] = useState(null);
  const [schoolYear, setSchoolYear] = useState(null);
  const [schoolYearList, setSchoolYearList] = useState(null);
  const [academicPeriodList, setAcademicPeriodList] = useState(null);
  const [academicPeriod, setAcademicPeriod] = useState(null);

  const [entityDownloadList, setEntityDownloadList] = useState([
    'Nivel Educativo',
    'Nivel de Desempeño',
    'Componente Evalutivo',
    'Modalidad',
    'Especialidad',
    'Areas',
    'Asingaturas',
    'Grados',
    'Cursos',
    'Docentes',
    'Estudiantes',
    'Asignacion Grados/Cursos',
    'Asignacion Academica Docente',
    'Configuracion Colegio',
    'Sedes',
  ]);

  const [entitySyncList, setEntitySyncList] = useState([
    'Plan de Aula',
    'Referentes de Valoracion',
    'Observador Estudiante',
    'Actividades de Valoración',
    'Planilla Valoración',
    'Actividades de Nivelación',
    'Planilla Nivelación',
  ]);

  const methods = useForm({
    mode: 'onChange',
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
      if (props?.data?.academicPeriod !== undefined && props?.data?.academicPeriod != null) {
        setAcademicPeriod({
          key: props?.data?.academicPeriod?.id,
          label: props?.data?.academicPeriod?.name,
          value: props?.data?.academicPeriod?.id,
        });
      }
      register('schoolId', {
        required: true,
        value:
          props?.data?.id && props?.data?.schoolId
            ? props?.data?.schoolId
            : props?.loginReducer?.schoolId,
      });
      register('schoolYearId', {
        required: true,
        value:
          props?.data?.id && props?.data?.schoolYearId
            ? props?.data?.schoolYearId
            : props?.loginReducer?.schoolYear,
      });
    } else {
      setSchool({
        key: props?.loginReducer?.schoolData?.id,
        label: props?.loginReducer?.schoolData?.name,
        value: props?.loginReducer?.schoolData?.id,
      });
      setSchoolYear({
        label: props?.loginReducer?.schoolYearName,
        value: props?.loginReducer?.schoolYear,
        key: props?.loginReducer?.schoolYear,
      });
    }
    setLoading(false);
  }, [props?.data]);

  const cleanForm = async () => {
    reset();
    setSchoolYear(null);
    setSchool(null);
    setAcademicPeriod(null);
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
    setSchoolList([
      {
        key: props?.loginReducer?.schoolData?.id,
        label: props?.loginReducer?.schoolData?.name,
        value: props?.loginReducer?.schoolData?.id,
      },
    ]);
    setSchoolYearList([
      {
        label: props?.loginReducer?.schoolYearName,
        value: props?.loginReducer?.schoolYear,
        key: props?.loginReducer?.schoolYear,
      },
    ]);
    props
      .getDropdownsSyncOffline(props?.loginReducer?.schoolId, props?.loginReducer?.schoolYear)
      .then((data: any) => {
        setAcademicPeriodList(
          data.dataAcademicPeriods.edges.map((c: any) => {
            return {
              label: c.node.name,
              value: c.node.id,
              key: c.node.id,
              startDate: c.node.startDate,
              endDate: c.node.endDate,
            };
          }),
        );
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
            //validateForm={true}
          >
            <ModalBody>
              <FormGroupCustom>
                <div className="form-group d-flex align-items-center">
                  <Input
                    className="itemCheck m-0 mr-2"
                    type="checkbox"
                    id={`check_academicPeriod`}
                    //defaultChecked={academicPeriod}
                    //checked={academicPeriod}
                    onChange={() => {
                      //setValue('schoolYearImportOptions.academicPeriod', !academicPeriod);
                      //setAcademicPeriod(!academicPeriod);
                    }}
                    label=""
                    disabled={true}
                  />
                  {<IntlMessages id="syncOffline.onlineIndicator" />}
                </div>
                <LabelCustom id="syncOffline.intro" required={false} />
              </FormGroupCustom>
              <FormGroupCustom>
                <LabelCustom id="menu.periodAcademic" required={true} />
                <Select
                  isClearable
                  placeholder={<IntlMessages id="forms.select" />}
                  {...register('academicPeriodId', { required: true })}
                  className="react-select"
                  classNamePrefix="react-select"
                  options={academicPeriodList}
                  value={academicPeriod}
                  onChange={(selectedOption) => {
                    setValue('academicPeriodId', selectedOption?.key);
                    setAcademicPeriod(selectedOption);
                  }}
                />
              </FormGroupCustom>
              <>
                <LabelCustom id="menu.dataSyncOffline" required={true} />
                {entityDownloadList.map((e: any, indexe: any) => {
                  return (
                    <div className="form-group d-flex align-items-center">
                      <Input
                        className="itemCheck m-0 mr-2"
                        type="checkbox"
                        id={`check_academicPeriod`}
                        defaultChecked={true}
                        //checked={academicPeriod}
                        onChange={() => {
                          //setValue('schoolYearImportOptions.academicPeriod', !academicPeriod);
                          //setAcademicPeriod(!academicPeriod);
                        }}
                        label=""
                        disabled={true}
                      />
                      {/* {<IntlMessages id="forms.academicPeriod" />} */}
                      {e}
                    </div>
                  );
                })}
              </>
              <>
                <LabelCustom id="menu.dataSyncOfflineOnline" required={true} />
                {entitySyncList.map((e: any, indexe: any) => {
                  return (
                    <div className="form-group d-flex align-items-center">
                      <Input
                        className="itemCheck m-0 mr-2"
                        type="checkbox"
                        id={`check_academicPeriod`}
                        defaultChecked={true}
                        //checked={academicPeriod}
                        onChange={() => {
                          //setValue('schoolYearImportOptions.academicPeriod', !academicPeriod);
                          //setAcademicPeriod(!academicPeriod);
                        }}
                        label=""
                        disabled={true}
                      />
                      {/* {<IntlMessages id="forms.academicPeriod" />} */}
                      {e}
                    </div>
                  );
                })}
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
                <RequiredMessagesCustom formState={formState} register={'name'} />
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

const mapDispatchToProps = { ...SyncOfflineActions };

const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

export default connect(mapStateToProps, mapDispatchToProps)(SyncOfflineCreateEdit);
