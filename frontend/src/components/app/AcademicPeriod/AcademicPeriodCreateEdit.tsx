import moment from 'moment';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import Select from 'react-select';
import { Input, InputGroup, InputGroupText, ModalBody, ModalFooter } from 'reactstrap';

import IntlMessages from '../../../helpers/IntlMessages';
import * as academicPeriodActions from '../../../stores/actions/AcademicPeriodActions';
import { Colxx } from '../../common/CustomBootstrap';
import AddNewModal from '../../common/Data/AddNewModal';
import CreateEditAuditInformation from '../../common/Data/CreateEditAuditInformation';
import FormGroupCustom from '../../common/Data/FormGroupCustom';
import LabelCustom from '../../common/Data/LabelCustom';
import RequiredMessagesCustom from '../../common/Data/RequiredMessagesCustom';
import { Loader } from '../../common/Loader';

const AcademicPeriodCreateEdit = (props: any) => {
  const [loading, setLoading] = useState(true);
  const [schoolList, setSchoolList] = useState(null);
  const [school, setSchool] = useState(null);
  const [schoolYear, setSchoolYear] = useState(null);
  const [schoolYearList, setSchoolYearList] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [startDateRecovery, setStartDateRecovery] = useState(null);
  const [endDateRecovery, setEndDateRecovery] = useState(null);

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
      if (props?.data?.startDate !== undefined && props?.data?.startDate != null) {
        setStartDate(new Date(props?.data?.startDate));
      }
      if (props?.data?.endDate !== undefined && props?.data?.endDate != null) {
        setEndDate(new Date(props?.data?.endDate));
      }
      if (props?.data?.startDateRecovery !== undefined && props?.data?.startDateRecovery != null) {
        setStartDateRecovery(new Date(props?.data?.startDateRecovery));
      }
      if (props?.data?.endDateRecovery !== undefined && props?.data?.endDateRecovery != null) {
        setEndDateRecovery(new Date(props?.data?.endDateRecovery));
      }
      register('schoolId', {
        required: true,
        value: props?.data?.id && props?.data?.schoolId ? props?.data?.schoolId : props?.loginReducer?.schoolId,
      });
      register('schoolYearId', {
        required: true,
        value: props?.data?.id && props?.data?.schoolYearId ? props?.data?.schoolYearId : props?.loginReducer?.schoolYear,
      });
      register('startDate', {
        required: true,
        value: props?.data?.id ? props?.data?.startDate : '',
      });
      register('endDate', {
        required: true,
        value: props?.data?.id ? props?.data?.endDate : '',
      });
      register('startDateRecovery', {
        required: true,
        value: props?.data?.id ? props?.data?.startDateRecovery : '',
      });
      register('endDateRecovery', {
        required: true,
        value: props?.data?.id ? props?.data?.endDateRecovery : '',
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
    setStartDate(null);
    setEndDate(null);
    setStartDateRecovery(null);
    setEndDateRecovery(null);
    setSchoolYear(null);
    setSchool(null);
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

  const { ref: weightRef, ...weightRest } = register('weight', {
    required: true,
    value: props?.data?.id ? props?.data?.weight : '',
  });
  const { ref: orderRef, ...orderRest } = register('order', {
    required: true,
    value: props?.data?.id ? props?.data?.order : '',
  });
  const { ref: nameRef, ...nameRest } = register('name', {
    required: true,
    value: props?.data?.id ? props?.data?.name : '',
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
                <LabelCustom id="forms.startDate" required={true} />
                <DatePicker
                  {...register('startDate', { required: true })}
                  selected={startDate}
                  onChange={(date: any) => {
                    setValue('startDate', date as Date);
                    setStartDate(date as Date);
                    trigger('startDate');
                  }}
                />
                <RequiredMessagesCustom formState={formState} register={"startDate"} />
              </FormGroupCustom>
              <FormGroupCustom>
                <LabelCustom id="forms.endDate" required={true} />
                <DatePicker
                  {...register('endDate', { required: true })}
                  selected={endDate}
                  onChange={(date: any) => {
                    let dateAux = new Date(date as Date);
                    dateAux = moment(dateAux).hour(23).minute(59).second(59).toDate();
                    setValue('endDate', dateAux as Date);
                    setEndDate(date as Date);
                    trigger('endDate');
                  }}
                  minDate={startDate}
                  disabled={startDate == null}
                />
                <RequiredMessagesCustom formState={formState} register={"endDate"} />
              </FormGroupCustom>

              <FormGroupCustom>
                <LabelCustom id="forms.startDateRecovery" required={true} />
                <DatePicker
                  {...register('startDateRecovery', { required: true })}
                  selected={startDateRecovery}
                  onChange={(date: any) => {
                    setValue('startDateRecovery', date as Date);
                    setStartDateRecovery(date as Date);
                    trigger('startDateRecovery');
                  }}
                />
                <RequiredMessagesCustom formState={formState} register={"startDateRecovery"} />
              </FormGroupCustom>
              <FormGroupCustom>
                <LabelCustom id="forms.endDateRecovery" required={true} />
                <DatePicker
                  {...register('endDateRecovery', { required: true })}
                  selected={endDateRecovery}
                  onChange={(date: any) => {
                    let dateAux = new Date(date as Date);
                    dateAux = moment(dateAux).hour(23).minute(59).second(59).toDate();
                    setValue('endDateRecovery', dateAux as Date);
                    setEndDateRecovery(date as Date);
                    trigger('endDateRecovery');
                  }}
                  minDate={startDateRecovery}
                  disabled={startDateRecovery == null}
                />
                <RequiredMessagesCustom formState={formState} register={"endDateRecovery"} />
              </FormGroupCustom>

              <FormGroupCustom>
                <LabelCustom id="forms.weight" required={true} />
                <InputGroup>
                  <Input {...weightRest} innerRef={weightRef} className="form-control" type="number" step="1" min={1} max={100} />
                  <InputGroupText addonType="append">%</InputGroupText>
                </InputGroup>
                <RequiredMessagesCustom formState={formState} register={"weight"} />
              </FormGroupCustom>
              <FormGroupCustom>
                <LabelCustom id="forms.sorting" required={true} />
                <Input {...orderRest} innerRef={orderRef} className="form-control" type="number" step="1" min={1} />
                <RequiredMessagesCustom formState={formState} register={"order"} />
              </FormGroupCustom>
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

const mapDispatchToProps = { ...academicPeriodActions };

const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

export default connect(mapStateToProps, mapDispatchToProps)(AcademicPeriodCreateEdit);
