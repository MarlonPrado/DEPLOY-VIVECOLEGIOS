import { DevTool } from '@hookform/devtools';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import Select from 'react-select';
import TimePicker from 'react-time-picker';
import { Input, Label, ModalBody, ModalFooter } from 'reactstrap';

import IntlMessages from '../../../helpers/IntlMessages';
import * as AcademicHourActions from '../../../stores/actions/AcademicHourActions';
import { Colxx } from '../../common/CustomBootstrap';
import AddNewModal from '../../common/Data/AddNewModal';
import CreateEditAuditInformation from '../../common/Data/CreateEditAuditInformation';
import FormGroupCustom from '../../common/Data/FormGroupCustom';
import LabelCustom from '../../common/Data/LabelCustom';
import RequiredMessagesCustom from '../../common/Data/RequiredMessagesCustom';
import { Loader } from '../../common/Loader';

const AcademicHourCreateEdit = (props: any) => {
  const [loading, setLoading] = useState(true);
  const [schoolList, setSchoolList] = useState(null);
  const [school, setSchool] = useState(null);
  const [campusList, setCampusList] = useState(null);
  const [campus, setCampus] = useState(null);
  const [schoolYearList, setSchoolYearList] = useState(null);
  const [schoolYear, setSchoolYear] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  let [params] = useSearchParams();
  const academicDayId = params.get('academicDayId');

  const methods = useForm({
    mode: 'all',
    reValidateMode: 'onChange',
  });

  const { handleSubmit, control, register, reset, setValue, formState, trigger } = methods;

  useEffect(() => {
    cleanForm();
    getDropdowns();
    if (props?.data?.id) {
      if (props?.data?.campus !== undefined && props?.data?.campus != null) {
        setCampus({
          key: props?.data?.campus?.id,
          label: props?.data?.campus?.name,
          value: props?.data?.campus?.id,
        });
      }
      if (props?.data?.schoolYear !== undefined && props?.data?.schoolYear != null) {
        setSchoolYear({
          key: props?.data?.schoolYear?.id,
          label: props?.data?.schoolYear?.schoolYear,
          value: props?.data?.schoolYear?.id,
        });
      }
      if (props?.data?.startTime !== undefined && props?.data?.startTime != null) {
        setStartTime(props?.data?.startTime);
      }
      if (props?.data?.endTime !== undefined && props?.data?.endTime != null) {
        setEndTime(props?.data?.endTime);
      }
      register('startTime', {
        required: true,
        value: props?.data?.id ? props?.data?.startTime : '',
      });
      register('endTime', {
        required: true,
        value: props?.data?.id ? props?.data?.endTime : '',
      });
      register('academicDayId', {
        required: true,
        value: props?.data?.id ? props?.data?.academicDayId : '',
      });
      register('campusId', {
        required: false,
        value: props?.data?.id ? props?.data?.campusId : '',
      });
      register('schoolId', {
        required: true,
        value: props?.data?.id && props?.data?.schoolId ? props?.data?.schoolId : props?.loginReducer?.schoolId,
      });
      register('schoolYearId', {
        required: true,
        value: props?.data?.id && props?.data?.schoolYearId ? props?.data?.schoolYearId : props?.loginReducer?.schoolYear,
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
    setCampus(null);
    setStartTime(null);
    setEndTime(null);
    if (props?.loginReducer?.campusId && !props?.data?.id) {
      // set value when register is new and sesion contains value
      register('campusId', {
        required: true,
        value: props?.loginReducer?.campusId,
      });
    }
    if (academicDayId) {
      // set value when register is new and sesion contains value
      register('academicDayId', {
        required: true,
        value: academicDayId,
      });
    }
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
    props.getDropdownsAcademicHour(props?.loginReducer?.schoolId, props?.loginReducer?.campusId).then((data: any) => {
      setCampusList(
        data.dataCampus.edges.map((c: any) => {
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

  const { ref: orderRef, ...orderRest } = register('order', {
    required: true,
    value: props?.data?.id ? props?.data?.order : '',
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
            validateForm={true}
          >
            <ModalBody>
              <FormGroupCustom>
                <LabelCustom id="forms.startTime" required={true} />
                <TimePicker
                  value={startTime}
                  {...register('startTime', { required: true })}
                  clockIcon={null}
                  disableClock={true}
                  format="HH:mm"
                  onChange={(date) => {
                    setValue('startTime', date as unknown as Date);
                    setStartTime(date as unknown as Date);
                    trigger('startTime')
                  }}
                />
                <RequiredMessagesCustom formState={formState} register={"startTime"} />
              </FormGroupCustom>
              <FormGroupCustom>
                <LabelCustom id="forms.endTime" required={true} />
                <TimePicker
                  value={endTime}
                  {...register('endTime', { required: true })}
                  clockIcon={null}
                  disableClock={true}
                  format="HH:mm"
                  onChange={(date) => {
                    setValue('endTime', date as unknown as Date);
                    setEndTime(date as unknown as Date);
                    trigger('endTime')
                  }}
                />
                <RequiredMessagesCustom formState={formState} register={"endTime"} />
              </FormGroupCustom>
              <FormGroupCustom>
                <LabelCustom id="forms.sorting" required={true} />
                <Input {...orderRest} innerRef={orderRef} className="form-control" type="number" step="1" min={1} />
                <RequiredMessagesCustom formState={formState} register={"order"} />
              </FormGroupCustom>
              {/* {!props?.loginReducer?.campusId ? (
                <FormGroupCustom>
                  <Label>
                    <IntlMessages id="menu.campus" />
                  </Label>
                  <Select
                    isClearable
                    placeholder={<IntlMessages id="forms.select" />}
                    {...register('campusId', { required: true })}
                    className="react-select"
                    classNamePrefix="react-select"
                    options={campusList}
                    value={campus}
                    onChange={(selectedOption) => {
                      setValue('campusId', selectedOption?.key);
                      setCampus(selectedOption);
                    }}
                  />
                </FormGroupCustom>
              ) : (
                ''
              )} */}
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

const mapDispatchToProps = { ...AcademicHourActions };

const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

export default connect(mapStateToProps, mapDispatchToProps)(AcademicHourCreateEdit);
