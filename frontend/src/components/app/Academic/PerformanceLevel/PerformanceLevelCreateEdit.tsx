import { DevTool } from '@hookform/devtools';
import React, { useEffect, useState } from 'react';
import { CirclePicker, TwitterPicker } from 'react-color';
import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import { connect } from 'react-redux';
import Select from 'react-select';
import { Button, Input, InputGroup, ModalBody, ModalFooter } from 'reactstrap';

import { loaderColor, loaderIcon } from '../../../../constants/defaultValues';
import IntlMessages from '../../../../helpers/IntlMessages';
import * as performanceLevelAction from '../../../../stores/actions/Academic/PerformanceLevelActions';
import { Colxx } from '../../../common/CustomBootstrap';
import AddNewModal from '../../../common/Data/AddNewModal';
import CreateEditAuditInformation from '../../../common/Data/CreateEditAuditInformation';
import FormGroupCustom from '../../../common/Data/FormGroupCustom';
import LabelCustom from '../../../common/Data/LabelCustom';
import RequiredMessagesCustom from '../../../common/Data/RequiredMessagesCustom';
import { Loader } from '../../../common/Loader';

const AreaCreateEdit = (props: any) => {
  const [loading, setLoading] = useState(true);
  const [generalPerformancesLevelList, setGeneralPerformancesLevelList] = useState(null);
  const [generalPerformanceLevel, setGeneralPerformanceLevel] = useState(null);
  const [schoolList, setSchoolList] = useState(null);
  const [school, setSchool] = useState(null);
  const [schoolYearList, setSchoolYearList] = useState(null);
  const [schoolYear, setSchoolYear] = useState(null);
  const [types, setTypes] = useState([]);
  const [type, setType] = useState(null);
  const [campusList, setCampusList] = useState(null);
  const [campus, setCampus] = useState(null);
  const [academicGradesList, setAcademicGradesList] = useState(null);
  const [academicGrades, setAcademicGrades] = useState(null);
  const [color, setColor] = useState({ background: '' });
  const [isFinal, setIsFinal] = useState(null);
  const [isRecovery, setIsRecovery] = useState(null);

  const intl = useIntl();

  const methods = useForm({
    mode: 'all',
    reValidateMode: 'onChange',
  });

  const { handleSubmit, control, register, unregister, reset, setValue, formState, trigger } = methods;

  useEffect(() => {
    cleanForm();
    getDropdowns();
    if (props?.data?.id) {
      if (
        props?.data?.generalPerformanceLevel !== undefined &&
        props?.data?.generalPerformanceLevel != null
      ) {
        setGeneralPerformanceLevel({
          key: props?.data?.generalPerformanceLevel?.id,
          label: props?.data?.generalPerformanceLevel?.name,
          value: props?.data?.generalPerformanceLevel?.id,
        });
      }
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
      if (
        props?.data?.type !== undefined &&
        props?.data?.type != null
      ) {
        setType({
          key: props?.data?.type,
          label: intl.messages["display." + props?.data?.type],
          value: props?.data?.type,
        });
      }
      if (props?.data?.campus !== undefined && props?.data?.campus != null) {
        setCampus(props?.data?.campus.map((c: any) => {
          return { label: c.name, value: c.id, key: c.id };
        }));
      }
      if (props?.data?.academicGrades !== undefined && props?.data?.academicGrades != null) {
        setAcademicGrades(props?.data?.academicGrades.map((c: any) => {
          return { label: c.name, value: c.id, key: c.id };
        }));
      }
      if (
        props?.data?.isRecovery !== undefined &&
        props?.data?.isRecovery != null
      ) {
        setIsRecovery(props?.data?.isRecovery ? { key: "YES", label: "Si", value: true } : { key: "NO", label: "No", value: false, });
      }
      if (
        props?.data?.isFinal !== undefined &&
        props?.data?.isFinal != null
      ) {
        setIsFinal(props?.data?.isFinal ? { key: "YES", label: "Si", value: true } : { key: "NO", label: "No", value: false, });
      }
      if (props?.data?.colorHex) {
        setColor({ background: props?.data?.colorHex })
      }
      register('schoolId', {
        required: true,
        value: props?.data?.id && props?.data?.schoolId ? props?.data?.schoolId : props?.loginReducer?.schoolId,
      });
      register('schoolYearId', {
        required: true,
        value: props?.data?.id && props?.data?.schoolYearId ? props?.data?.schoolYearId : props?.loginReducer?.schoolYear,
      });
      register('generalPerformanceLevelId', {
        required: true,
        value: props?.data?.id ? props?.data?.generalPerformanceLevelId : '',
      });
      register('type', {
        required: true,
        value: props?.data?.id ? props?.data?.type : '',
      });
      register('campusId', {
        required: false,
        value: props?.data?.id ? props?.data?.campusId : '',
      });
      register('academicGradesId', {
        required: false,
        value: props?.data?.id ? props?.data?.academicGradesId : '',
      });
      register('isRecovery', {
        required: false,
        value: props?.data?.id ? props?.data?.isRecovery : false,
      });
      register('isFinal', {
        required: false,
        value: props?.data?.id ? props?.data?.isFinal : true,
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
    setGeneralPerformanceLevel(null);
    setType(null);
    setColor({ background: '' });
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
    props.getPerformanceLevelTypes().then((data: any) => {
      setTypes(data.map((c: any) => {
        return { label: intl.messages["display." + c.name], value: c.name, key: c.name };
      }))
    });
    props.getDropdownsPerformanceLevel(props?.loginReducer?.schoolId, props?.loginReducer?.schoolYear).then((data: any) => {
      setCampusList(
        data.dataCampus.edges.map((c: any) => {
          return { label: c.node.name, value: c.node.id, key: c.node.id };
        }),
      );
      setGeneralPerformancesLevelList(
        data.dataGeneralPerformanceLevels.edges.map((c: any) => {
          return { label: c.node.name, value: c.node.id, key: c.node.id };
        }),
      );
      setAcademicGradesList(
        data.dataAcademicGrade.edges.map((c: any) => {
          return { label: c.node.name, value: c.node.id, key: c.node.id };
        }),
      )
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

  const { ref: minimumScoreRef, ...minimumScoreRest } = register('minimumScore', {
    required: props?.data?.id && props?.data?.type !== "QUALITATIVE" ? true : false,
    value: props?.data?.id ? props?.data?.minimumScore : '',
  });

  const { ref: topScoreRef, ...topScoreRest } = register('topScore', {
    required: props?.data?.id && props?.data?.type !== "QUALITATIVE" ? true : false,
    value: props?.data?.id ? props?.data?.topScore : '',
  });

  const { ref: abbreviationRef, ...abbreviationRest } = register('abbreviation', {
    required: false,
    value: props?.data?.id ? props?.data?.abbreviation : '',
  });

  const { ref: colorRef, ...colorRest } = register('colorHex', {
    required: false,
    value: props?.data?.id ? props?.data?.colorHex : '',
  });

  const auditInfo = {
    createdAt: props?.data?.id ? props?.data?.createdAt : null,
    updatedAt: props?.data?.id ? props?.data?.createdAt : null,
    createdByUser: props?.data?.id ? props?.data?.createdByUser : null,
    updatedByUser: props?.data?.id ? props?.data?.updatedByUser : null,
    version: props?.data?.id ? props?.data?.version : null,
  };

  const handleChange = (color: any) => {
    setColor({ background: color.hex })
    setValue('colorHex', color.hex);
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
                <LabelCustom id="forms.name" required={true} />
                <Input {...nameRest} innerRef={nameRef} className="form-control" />
                <RequiredMessagesCustom formState={formState} register={"name"} />
              </FormGroupCustom>
              <FormGroupCustom>
                <LabelCustom id="forms.abbreviation" required={false} />
                <Input {...abbreviationRest} innerRef={abbreviationRef} className="form-control" />
                <RequiredMessagesCustom formState={formState} register={"abbreviation"} />
              </FormGroupCustom>
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
                    if (selectedOption?.key == 'QUALITATIVE') {
                      register('minimumScore', {
                        required: false, value: null
                      });
                      register('topScore', {
                        required: false, value: null
                      });
                    } else {
                      register('minimumScore', {
                        required: true,
                        value: props?.data?.id ? props?.data?.minimumScore : '',
                      });
                      register('topScore', {
                        required: true,
                        value: props?.data?.id ? props?.data?.topScore : '',
                      });
                    }
                    trigger('type');
                  }}
                />
                <RequiredMessagesCustom formState={formState} register={"type"} />
              </FormGroupCustom>
              {type?.key && type?.key !== 'QUALITATIVE' ?
                <>
                  <FormGroupCustom>
                    <LabelCustom id="forms.minimumScore" required={true} />
                    <Input {...minimumScoreRest} innerRef={minimumScoreRef} className="form-control" />
                    <RequiredMessagesCustom formState={formState} register={"minimumScore"} />
                  </FormGroupCustom>
                  <FormGroupCustom>
                    <LabelCustom id="forms.topScore" required={true} />
                    <Input {...topScoreRest} innerRef={topScoreRef} className="form-control" />
                    <RequiredMessagesCustom formState={formState} register={"topScore"} />
                  </FormGroupCustom>
                </>
                : ''}
              <FormGroupCustom>
                <LabelCustom id="forms.isFinal" required={true} />
                <Select
                  placeholder={<IntlMessages id="forms.select" />}
                  className="react-select"
                  classNamePrefix="react-select"
                  options={[{ key: "YES", label: "Si", value: true }, { key: "NO", label: "No", value: false, }
                  ]}
                  value={isFinal}
                  onChange={(selectedOption: any) => {
                    setValue('isFinal', selectedOption?.value);
                    setIsFinal(selectedOption);
                    trigger('isFinal');
                  }}
                />
              </FormGroupCustom>
              <FormGroupCustom>
                <LabelCustom id="forms.isRecovery" required={true} />
                <Select
                  placeholder={<IntlMessages id="forms.select" />}
                  className="react-select"
                  classNamePrefix="react-select"
                  options={[{ key: "NO", label: "No", value: false, },
                  { key: "SI", label: "Si", value: true }]}
                  value={isRecovery}
                  onChange={(selectedOption: any) => {
                    setValue('isRecovery', selectedOption?.value);
                    setIsRecovery(selectedOption);
                    trigger('isRecovery');
                  }}
                />
              </FormGroupCustom>
              <FormGroupCustom>
                <LabelCustom id="forms.color" required={false} />
                <InputGroup addonType="append">
                  <Input {...colorRest} innerRef={colorRef} className="form-control" disabled={true} />
                  <div style={{
                    width: '36px',
                    borderRadius: '2px',
                    background: color?.background
                  }} />
                </InputGroup>
                <TwitterPicker color={color?.background} onChange={(event) => { handleChange(event) }} />
              </FormGroupCustom>
              <FormGroupCustom>
                <LabelCustom id="menu.performanceLevelGeneral" required={true} />
                <Select
                  isClearable
                  placeholder={<IntlMessages id="forms.select" />}
                  {...register('generalPerformanceLevelId', { required: true })}
                  className="react-select"
                  classNamePrefix="react-select"
                  options={generalPerformancesLevelList}
                  value={generalPerformanceLevel}
                  onChange={(selectedOption: any) => {
                    setValue('generalPerformanceLevelId', selectedOption?.key);
                    setGeneralPerformanceLevel(selectedOption);
                    trigger('generalPerformanceLevelId');
                  }}
                />
                <RequiredMessagesCustom formState={formState} register={"generalPerformanceLevelId"} />
              </FormGroupCustom>
              <FormGroupCustom>
                <LabelCustom id="menu.grades" required={false} />
                <Select
                  isClearable
                  placeholder={<IntlMessages id="forms.select" />}
                  isMulti
                  {...register('academicGradesId', { required: false })}
                  className="react-select"
                  classNamePrefix="react-select"
                  options={academicGradesList}
                  value={academicGrades}
                  onChange={(selectedOption: any) => {
                    setValue('academicGradesId', selectedOption.map((c: any) => { return c.key }));
                    setAcademicGrades(selectedOption);
                  }}
                />
              </FormGroupCustom>
              <FormGroupCustom>
                <LabelCustom id="menu.campus" required={false} />
                <Select
                  isClearable
                  placeholder={<IntlMessages id="forms.select" />}
                  isMulti
                  {...register('campusId', { required: false })}
                  className="react-select"
                  classNamePrefix="react-select"
                  options={campusList}
                  value={campus}
                  onChange={(selectedOption: any) => {
                    setValue('campusId', selectedOption.map((c: any) => { return c.key }));
                    setCampus(selectedOption);
                  }}
                />
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

const mapDispatchToProps = { ...performanceLevelAction };

const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

export default connect(mapStateToProps, mapDispatchToProps)(AreaCreateEdit);
