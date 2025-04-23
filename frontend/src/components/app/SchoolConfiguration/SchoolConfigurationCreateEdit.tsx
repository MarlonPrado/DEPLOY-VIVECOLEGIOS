import { DevTool } from '@hookform/devtools';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { injectIntl } from 'react-intl';
import { useFormatMessage } from 'react-intl-hooks';
import { connect } from 'react-redux';
import Select from 'react-select';
import { Input, Label, ModalBody, ModalFooter } from 'reactstrap';

import IntlMessages from '../../../helpers/IntlMessages';
import * as schoolConfigurationActions from '../../../stores/actions/SchoolConfigurationActions';
import { Colxx } from '../../common/CustomBootstrap';
import AddNewModal from '../../common/Data/AddNewModal';
import CreateEditAuditInformation from '../../common/Data/CreateEditAuditInformation';
import FormGroupCustom from '../../common/Data/FormGroupCustom';
import LabelCustom from '../../common/Data/LabelCustom';
import RequiredMessagesCustom from '../../common/Data/RequiredMessagesCustom';
import { Loader } from '../../common/Loader';

const SchoolConfigurationCreateEdit = (props: any) => {
  const [loading, setLoading] = useState(true);
  const [schoolList, setSchoolList] = useState(null);
  const [school, setSchool] = useState(null);
  const [schoolYearList, setSchoolYearList] = useState(null);
  const [schoolYear, setSchoolYear] = useState(null);
  const [valueString, setValueString] = useState(null);

  const methods = useForm({
    mode: 'all',
    reValidateMode: 'onChange',
  });

  const { handleSubmit, control, register, reset, setValue, formState, trigger } = methods;

  const { messages } = props.intl;

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
      setValueString({
        key: props?.data?.valueString, label: messages["display." + props?.data?.code + "_" + props?.data?.valueString], value: props?.data?.valueString,
      })

      register('valueString', {
        required: false,
        value: props?.data?.id ? props?.data?.valueString : '',
      });

      register('valueNumber', {
        required: true,
        value: props?.data?.id ? props?.data?.valueNumber : 0,
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

  const { ref: codeRef, ...codeRest } = register('code', {
    required: true,
    value: props?.data?.id ? props?.data?.code : '',
  });

  const { ref: valueStringRef, ...valueStringRest } = register('valueString', {
    required: false,
    value: props?.data?.id ? props?.data?.valueString : '',
  });

  const { ref: valueNumberRef, ...valueNumberRest } = register('valueNumber', {
    required: true,
    value: props?.data?.id ? props?.data?.valueNumber : 0,
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
      <DevTool control={methods.control} placement="top-left" />
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
                <LabelCustom id="forms.code" required={true} />
                <Input disabled={true} {...codeRest} innerRef={codeRef} className="form-control" />
                <RequiredMessagesCustom formState={formState} register={"code"} />
              </FormGroupCustom>
              <FormGroupCustom>
                <LabelCustom id="forms.configuration" required={true} />
                <Input disabled={true} value={messages["display." + props?.data?.code]} className="form-control" />
                <RequiredMessagesCustom formState={formState} register={"code"} />
              </FormGroupCustom>

              {props?.data?.code == "REPORT_PERFORMANCE_SHOW_FINAL_VALUATION" ? <>
                <FormGroupCustom>
                  <LabelCustom id="forms.value" required={true} />
                  <Input disabled={true} {...valueStringRest} innerRef={valueStringRef} className="form-control" />
                  <RequiredMessagesCustom formState={formState} register={"valueString"} />
                </FormGroupCustom>
                <FormGroupCustom>
                  <LabelCustom id="forms.value" required={true} />
                  <Select
                    isClearable
                    placeholder={<IntlMessages id="forms.select" />}
                    className="react-select"
                    classNamePrefix="react-select"
                    options={[{ key: "NO", label: messages["display." + props?.data?.code + "_NO"], value: "NO", },
                    { key: "YES", label: messages["display." + props?.data?.code + "_YES"], value: "YES" }]}
                    value={valueString}
                    onChange={(selectedOption: any) => {
                      setValueString(selectedOption);
                      setValue('valueString', selectedOption?.key);
                    }}
                  />
                </FormGroupCustom>
              </> : <></>}

              {props?.data?.code == "REPORT_PERFORMANCE_SHOW_RECOVERY_VALUATION" ? <>
                <FormGroupCustom>
                  <LabelCustom id="forms.value" required={true} />
                  <Input disabled={true} {...valueStringRest} innerRef={valueStringRef} className="form-control" />
                  <RequiredMessagesCustom formState={formState} register={"valueString"} />
                </FormGroupCustom>
                <FormGroupCustom>
                  <LabelCustom id="forms.value" required={true} />
                  <Select
                    isClearable
                    placeholder={<IntlMessages id="forms.select" />}
                    className="react-select"
                    classNamePrefix="react-select"
                    options={[{ key: "NO", label: messages["display." + props?.data?.code + "_NO"], value: "NO", },
                    { key: "YES", label: messages["display." + props?.data?.code + "_YES"], value: "YES" }]}
                    value={valueString}
                    onChange={(selectedOption: any) => {
                      setValueString(selectedOption);
                      setValue('valueString', selectedOption?.key);
                    }}
                  />
                </FormGroupCustom>
              </> : <></>}

              {props?.data?.code == "REPORT_CERTIFICATE_FINAL_TEXT_CERTIFICATE" ? <>
                <FormGroupCustom>
                  <LabelCustom id="forms.value" required={true} />
                  <Input disabled={true} value={valueString?.key} className="form-control" />
                  <RequiredMessagesCustom formState={formState} register={"valueString"} />
                </FormGroupCustom>
                <FormGroupCustom>
                  <LabelCustom id="forms.value" required={true} />
                  <Select
                    isClearable
                    placeholder={<IntlMessages id="forms.select" />}
                    className="react-select"
                    classNamePrefix="react-select"
                    options={[{ key: "MODEL_A", label: messages["display." + props?.data?.code + "_MODEL_A"], value: "MODEL_A", }, { key: "MODEL_B", label: messages["display." + props?.data?.code + "_MODEL_B"], value: "MODEL_B" }, { key: "MODEL_C", label: messages["display." + props?.data?.code + "_MODEL_C"], value: "MODEL_C", }, ]}
                    value={valueString}
                    onChange={(selectedOption: any) => {
                      setValueString(selectedOption);
                      setValue('valueString', selectedOption?.key);
                    }}
                  />
                </FormGroupCustom>
              </> : <></>}

              {props?.data?.code == "AVERAGE_AREA" ? <>
                <FormGroupCustom>
                  <LabelCustom id="forms.value" required={true} />
                  <Input disabled={true} value={valueString?.key} className="form-control" />
                  <RequiredMessagesCustom formState={formState} register={"valueString"} />
                </FormGroupCustom>
                <FormGroupCustom>
                  <LabelCustom id="forms.value" required={true} />
                  <Select
                    isClearable
                    placeholder={<IntlMessages id="forms.select" />}
                    className="react-select"
                    classNamePrefix="react-select"
                    options={[{ key: "IHS", label: messages["display." + props?.data?.code + "_IHS"], value: "IHS", }, { key: "PROM", label: messages["display." + props?.data?.code + "_PROM"], value: "PROM" }]}
                    value={valueString}
                    onChange={(selectedOption: any) => {
                      setValueString(selectedOption);
                      setValue('valueString', selectedOption?.key);
                    }}
                  />
                </FormGroupCustom>
              </> : <></>}

              {props?.data?.code == "REPORT_CERTIFICATE_FINAL_SIGNATURE_SECREATARY" ? <>
                <FormGroupCustom>
                  <LabelCustom id="forms.value" required={true} />
                  <Input disabled={false}  {...valueStringRest} innerRef={valueStringRef} className="form-control" />
                  <RequiredMessagesCustom formState={formState} register={"valueString"} />
                </FormGroupCustom>
              </> : <></>}

              {props?.data?.code == "REPORT_CERTIFICATE_FINAL_SIGNATURE_TYPE" ? <>
                <FormGroupCustom>
                  <LabelCustom id="forms.value" required={true} />
                  <Input disabled={true} {...valueStringRest} innerRef={valueStringRef} className="form-control" />
                  <RequiredMessagesCustom formState={formState} register={"valueString"} />
                </FormGroupCustom>
                <FormGroupCustom>
                  <LabelCustom id="forms.value" required={true} />
                  <Select
                    isClearable
                    placeholder={<IntlMessages id="forms.select" />}
                    className="react-select"
                    classNamePrefix="react-select"
                    options={[{ key: "PRINCIPAL", label: messages["display." + props?.data?.code + "_PRINCIPAL"], value: "PRINCIPAL", },
                    { key: "TEACHER_COURSE", label: messages["display." + props?.data?.code + "_TEACHER_COURSE"], value: "TEACHER_COURSE" },
                    { key: "TEACHER_COURSE_AND_PRINCIPAL", label: messages["display." + props?.data?.code + "_TEACHER_COURSE_AND_PRINCIPAL"], value: "TEACHER_COURSE_AND_PRINCIPAL" },
                    { key: "PRINCIPAL_SECRETARY", label: messages["display." + props?.data?.code + "_PRINCIPAL_SECRETARY"], value: "PRINCIPAL_SECRETARY" }]}
                    value={valueString}
                    onChange={(selectedOption: any) => {
                      setValueString(selectedOption);
                      setValue('valueString', selectedOption?.key);
                    }}
                  />
                </FormGroupCustom>
              </> : <></>}

              {props?.data?.code == "REPORT_CERTIFICATE_FINAL_TITLE" ? <>
                <FormGroupCustom>
                  <LabelCustom id="forms.value" required={true} />
                  <Input disabled={false} {...valueStringRest} innerRef={valueStringRef} className="form-control" />
                  <RequiredMessagesCustom formState={formState} register={"valueString"} />
                </FormGroupCustom>
              </> : <></>}

              {props?.data?.code == "COUNT_PROMOTED_INDICATE" ? <>
                <FormGroupCustom>
                  <LabelCustom id="forms.value" required={true} />
                  <Input disabled={false} {...valueNumberRest} innerRef={valueNumberRef} className="form-control" type="number" />
                  <RequiredMessagesCustom formState={formState} register={"valueNumber"} />
                </FormGroupCustom>
              </> : <></>}

              {props?.data?.code == "PROMOTED_INDICATE" ? <>
                <FormGroupCustom>
                  <LabelCustom id="forms.value" required={true} />
                  <Input disabled={true} {...valueStringRest} innerRef={valueStringRef} className="form-control" />
                  <RequiredMessagesCustom formState={formState} register={"valueString"} />
                </FormGroupCustom>
                <FormGroupCustom>
                  <LabelCustom id="forms.value" required={true} />
                  <Select
                    isClearable
                    placeholder={<IntlMessages id="forms.select" />}
                    className="react-select"
                    classNamePrefix="react-select"
                    options={[{ key: "AREA", label: messages["display." + props?.data?.code + "_AREA"], value: "AREA", },
                    { key: "ASIGNATURE", label: messages["display." + props?.data?.code + "_ASIGNATURE"], value: "ASIGNATURE" }]}
                    value={valueString}
                    onChange={(selectedOption: any) => {
                      setValueString(selectedOption);
                      setValue('valueString', selectedOption?.key);
                    }}
                  />
                </FormGroupCustom>
              </> : <></>}

              {props?.data?.code == "REPORT_PERFORMANCE_FINAL_NOT_PROMOTED" ? <>
                <FormGroupCustom>
                  <LabelCustom id="forms.value" required={true} />
                  <Input disabled={false} {...valueStringRest} innerRef={valueStringRef} className="form-control" />
                  <RequiredMessagesCustom formState={formState} register={"valueString"} />
                </FormGroupCustom>
              </> : <></>}

              {props?.data?.code == "REPORT_PERFORMANCE_FINAL_PROMOTED" ? <>
                <FormGroupCustom>
                  <LabelCustom id="forms.value" required={true} />
                  <Input disabled={false} {...valueStringRest} innerRef={valueStringRef} className="form-control" />
                  <RequiredMessagesCustom formState={formState} register={"valueString"} />
                </FormGroupCustom>
              </> : <></>}

              {props?.data?.code == "REPORT_PERFORMANCE_TITLE_SIGNATURE_PRINCIPAL" ? <>
                <FormGroupCustom>
                  <LabelCustom id="forms.value" required={true} />
                  <Input disabled={false} {...valueStringRest} innerRef={valueStringRef} className="form-control" />
                  <RequiredMessagesCustom formState={formState} register={"valueString"} />
                </FormGroupCustom>
              </> : <></>}

              {props?.data?.code == "REPORT_PERFORMANCE_TITLE_SIGNATURE_TEACHER_COURSE" ? <>
                <FormGroupCustom>
                  <LabelCustom id="forms.value" required={true} />
                  <Input disabled={false} {...valueStringRest} innerRef={valueStringRef} className="form-control" />
                  <RequiredMessagesCustom formState={formState} register={"valueString"} />
                </FormGroupCustom>
              </> : <></>}

              {props?.data?.code == "REPORT_PERFORMANCE_BEHAVIOUR_STUDENT" ? <>
                <FormGroupCustom>
                  <LabelCustom id="forms.value" required={true} />
                  <Input disabled={true} {...valueStringRest} innerRef={valueStringRef} className="form-control" />
                  <RequiredMessagesCustom formState={formState} register={"valueString"} />
                </FormGroupCustom>
                <FormGroupCustom>
                  <LabelCustom id="forms.value" required={true} />
                  <Select
                    isClearable
                    placeholder={<IntlMessages id="forms.select" />}
                    className="react-select"
                    classNamePrefix="react-select"
                    options={[{ key: "DISPLAY", label: messages["display." + props?.data?.code + "_DISPLAY"], value: "DISPLAY", },
                    { key: "HIDDEN", label: messages["display." + props?.data?.code + "_HIDDEN"], value: "HIDDEN" }]}
                    value={valueString}
                    onChange={(selectedOption: any) => {
                      setValueString(selectedOption);
                      setValue('valueString', selectedOption?.key);
                    }}
                  />
                </FormGroupCustom>
              </> : <></>}

              {props?.data?.code == "REPORT_PERFORMANCE_SIGNATURE_TYPE" ? <>
                <FormGroupCustom>
                  <LabelCustom id="forms.value" required={true} />
                  <Input disabled={true} {...valueStringRest} innerRef={valueStringRef} className="form-control" />
                  <RequiredMessagesCustom formState={formState} register={"valueString"} />
                </FormGroupCustom>
                <FormGroupCustom>
                  <LabelCustom id="forms.value" required={true} />
                  <Select
                    isClearable
                    placeholder={<IntlMessages id="forms.select" />}
                    className="react-select"
                    classNamePrefix="react-select"
                    options={[{ key: "PRINCIPAL", label: messages["display." + props?.data?.code + "_PRINCIPAL"], value: "PRINCIPAL", },
                    { key: "TEACHER_COURSE", label: messages["display." + props?.data?.code + "_TEACHER_COURSE"], value: "TEACHER_COURSE" },
                    { key: "TEACHER_COURSE_AND_PRINCIPAL", label: messages["display." + props?.data?.code + "_TEACHER_COURSE_AND_PRINCIPAL"], value: "TEACHER_COURSE_AND_PRINCIPAL" },
                    { key: "PRINCIPAL_SECRETARY", label: messages["display." + props?.data?.code + "_PRINCIPAL_SECRETARY"], value: "PRINCIPAL_SECRETARY" }]}
                    value={valueString}
                    onChange={(selectedOption: any) => {
                      setValueString(selectedOption);
                      setValue('valueString', selectedOption?.key);
                    }}
                  />
                </FormGroupCustom>
              </> : <></>}

              {props?.data?.code == "REPORT_PERFORMANCE_AREA_ASIGNATURE_TYPE" ? <>
                <FormGroupCustom>
                  <LabelCustom id="forms.value" required={true} />
                  <Input disabled={true} {...valueStringRest} innerRef={valueStringRef} className="form-control" />
                  <RequiredMessagesCustom formState={formState} register={"valueString"} />
                </FormGroupCustom>
                <FormGroupCustom>
                  <LabelCustom id="forms.value" required={true} />
                  <Select
                    isClearable
                    placeholder={<IntlMessages id="forms.select" />}
                    className="react-select"
                    classNamePrefix="react-select"
                    options={[{ key: "AREA_ASIGNATURE", label: messages["display." + props?.data?.code + "_AREA_ASIGNATURE"], value: "AREA_ASIGNATURE", },
                    { key: "AREA", label: messages["display." + props?.data?.code + "_AREA"], value: "AREA" },
                    { key: "ASIGNATURE", label: messages["display." + props?.data?.code + "_ASIGNATURE"], value: "ASIGNATURE" }]}
                    value={valueString}
                    onChange={(selectedOption: any) => {
                      setValueString(selectedOption);
                      setValue('valueString', selectedOption?.key);
                    }}
                  />
                </FormGroupCustom>
              </> : <></>}

              {props?.data?.code == "REPORT_PERFORMANCE_BEHAVIOUR_STUDENT_TYPE" ? <>
                <FormGroupCustom>
                  <LabelCustom id="forms.value" required={true} />
                  <Input disabled={true} {...valueStringRest} innerRef={valueStringRef} className="form-control" />
                  <RequiredMessagesCustom formState={formState} register={"valueString"} />
                </FormGroupCustom>
                <FormGroupCustom>
                  <LabelCustom id="forms.value" required={true} />
                  <Select
                    isClearable
                    placeholder={<IntlMessages id="forms.select" />}
                    className="react-select"
                    classNamePrefix="react-select"
                    options={[{ key: "QUANTITATIVE", label: messages["display." + props?.data?.code + "_QUANTITATIVE"], value: "QUANTITATIVE", },
                    { key: "QUALITATIVE", label: messages["display." + props?.data?.code + "_QUALITATIVE"], value: "QUALITATIVE" }]}
                    value={valueString}
                    onChange={(selectedOption: any) => {
                      setValueString(selectedOption);
                      setValue('valueString', selectedOption?.key);
                    }}
                  />
                </FormGroupCustom>
              </> : <></>}

              {props?.data?.code == "REPORT_PERFORMANCE_TYPE" ? <>
                <FormGroupCustom>
                  <LabelCustom id="forms.value" required={true} />
                  <Input disabled={true} {...valueStringRest} innerRef={valueStringRef} className="form-control" />
                  <RequiredMessagesCustom formState={formState} register={"valueString"} />
                </FormGroupCustom>
                <FormGroupCustom>
                  <LabelCustom id="forms.value" required={true} />
                  <Select
                    isClearable
                    placeholder={<IntlMessages id="forms.select" />}
                    className="react-select"
                    classNamePrefix="react-select"
                    options={[{ key: "SINGLE", label: messages["display." + props?.data?.code + "_SINGLE"], value: "SINGLE", },
                    { key: "DETAILS", label: messages["display." + props?.data?.code + "_DETAILS"], value: "DETAILS" }]}
                    value={valueString}
                    onChange={(selectedOption: any) => {
                      setValueString(selectedOption);
                      setValue('valueString', selectedOption?.key);
                    }}
                  />
                </FormGroupCustom>
              </> : <></>}

              {props?.data?.code == "COUNT_DIGITS_AVERAGE_COURSE" ? <>
                <FormGroupCustom>
                  <LabelCustom id="forms.value" required={true} />
                  <Input disabled={false} {...valueNumberRest} innerRef={valueNumberRef} className="form-control" type="number" />
                  <RequiredMessagesCustom formState={formState} register={"valueNumber"} />
                </FormGroupCustom>
              </> : <></>}

              {props?.data?.code == "REPORT_PERFORMANCE_TYPE_LEARNINGS_DISPLAY" ? <>
                <FormGroupCustom>
                  <LabelCustom id="forms.value" required={true} />
                  <Input disabled={true} {...valueStringRest} innerRef={valueStringRef} className="form-control" />
                  <RequiredMessagesCustom formState={formState} register={"valueString"} />
                </FormGroupCustom>
                <FormGroupCustom>
                  <LabelCustom id="forms.value" required={true} />
                  <Select
                    isClearable
                    placeholder={<IntlMessages id="forms.select" />}
                    className="react-select"
                    classNamePrefix="react-select"
                    options={[{ key: "ALL", label: messages["display." + props?.data?.code + "_ALL"], value: "ALL", },
                    { key: "SPECIFIC", label: messages["display." + props?.data?.code + "_SPECIFIC"], value: "SPECIFIC" }]}
                    value={valueString}
                    onChange={(selectedOption: any) => {
                      setValueString(selectedOption);
                      setValue('valueString', selectedOption?.key);
                    }}
                  />
                </FormGroupCustom>
              </> : <></>}

              {props?.data?.code == "REPORT_PERFORMANCE_TYPE_EVIDENCE_LEARNINGS_DISPLAY" ? <>
                <FormGroupCustom>
                  <LabelCustom id="forms.value" required={true} />
                  <Input disabled={true} {...valueStringRest} innerRef={valueStringRef} className="form-control" />
                  <RequiredMessagesCustom formState={formState} register={"valueString"} />
                </FormGroupCustom>
                <FormGroupCustom>
                  <LabelCustom id="forms.value" required={true} />
                  <Select
                    isClearable
                    placeholder={<IntlMessages id="forms.select" />}
                    className="react-select"
                    classNamePrefix="react-select"
                    options={[{ key: "ALL", label: messages["display." + props?.data?.code + "_ALL"], value: "ALL", },
                    { key: "SPECIFIC", label: messages["display." + props?.data?.code + "_SPECIFIC"], value: "SPECIFIC" }]}
                    value={valueString}
                    onChange={(selectedOption: any) => {
                      setValueString(selectedOption);
                      setValue('valueString', selectedOption?.key);
                    }}
                  />
                </FormGroupCustom>
              </> : <></>}

              {props?.data?.code == "REPORT_PERFORMANCE_TYPE_DISPLAY_DETAILS" ? <>
                <FormGroupCustom>
                  <LabelCustom id="forms.value" required={true} />
                  <Input disabled={true} {...valueStringRest} innerRef={valueStringRef} className="form-control" />
                  <RequiredMessagesCustom formState={formState} register={"valueString"} />
                </FormGroupCustom>
                <FormGroupCustom>
                  <LabelCustom id="forms.value" required={true} />
                  <Select
                    isClearable
                    placeholder={<IntlMessages id="forms.select" />}
                    className="react-select"
                    classNamePrefix="react-select"
                    options={[{ key: "EVIDENCE_LEARNING", label: messages["display." + props?.data?.code + "_EVIDENCE_LEARNING"], value: "EVIDENCE_LEARNING", },
                    { key: "LEARNING", label: messages["display." + props?.data?.code + "_LEARNING"], value: "LEARNING" }]}
                    value={valueString}
                    onChange={(selectedOption: any) => {
                      setValueString(selectedOption);
                      setValue('valueString', selectedOption?.key);
                    }}
                  />
                </FormGroupCustom>
              </> : <></>}

              {props?.data?.code == "COUNT_DIGITS_AVERAGE_STUDENT" ? <>
                <FormGroupCustom>
                  <LabelCustom id="forms.value" required={true} />
                  <Input disabled={false} {...valueNumberRest} innerRef={valueNumberRef} className="form-control" type="number" />
                  <RequiredMessagesCustom formState={formState} register={"valueNumber"} />
                </FormGroupCustom>
              </> : <></>}

              {props?.data?.code == "COUNT_DIGITS_PERFORMANCE_LEVEL" ? <>
                <FormGroupCustom>
                  <LabelCustom id="forms.value" required={true} />
                  <Input disabled={false} {...valueNumberRest} innerRef={valueNumberRef} className="form-control" type="number" />
                  <RequiredMessagesCustom formState={formState} register={"valueNumber"} />
                </FormGroupCustom>
              </> : <></>}

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

const mapDispatchToProps = { ...schoolConfigurationActions };

const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(SchoolConfigurationCreateEdit));
