/* eslint-disable arrow-body-style */
import React, { useEffect, useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import Select from 'react-select';
import { Input, Label, ModalBody, ModalFooter } from 'reactstrap';

import IntlMessages from '../../../helpers/IntlMessages';
import * as experienceLearningActions from '../../../stores/actions/ExperienceLearningActions';
import { Colxx } from '../../common/CustomBootstrap';
import AddNewModal from '../../common/Data/AddNewModal';
import CreateEditAuditInformation from '../../common/Data/CreateEditAuditInformation';
import { Loader } from '../../common/Loader';

const ExperienceLearningCreateEdit = (props: any) => {
  const [loading, setLoading] = useState(true);
  const [learningList, setLearningList] = useState(null);
  const [learnings, setLearnings] = useState(null);
  const [academicPeriodList, setAcademicPeriodList] = useState(null);
  const [evaluativeComponent, setEvaluativeComponent] = useState(null);
  const [evaluativeComponentList, setEvaluativeComponentList] = useState(null);
  const [campusList, setCampusList] = useState(null);
  const [campus, setCampus] = useState(null);
  const [date, setDate] = useState(null);
  const [academicPeriod, setAcademicPeriod] = useState(null);
  const [experienceType, setExperienceType] = useState(null);
  const [openTestDate, setOpenTestDate] = useState(null);
  const [closeTestDate, setCloseTestDate] = useState(null);
  let [checksEvidencesLearning, setChecksEvidencesLearning] = useState([]);
  let [checksEvidencesLearningSelected, setChecksEvidencesLearningSelected] = useState([]);
  const [criteriaPerformances, setCriteriaPerformances] = useState([]);
  const [performanceLevels, setPerformanceLevels] = useState(null);
  const [navigationMethod, setNavigationMethod] = useState(null);
  const [navigationMethodList, setNavigationMethodList] = useState(null);
  const [experienceTypes, setExperienceTypes] = useState([]);
  const [experienceRecoveryPlanTypes, setExperienceRecoveryPlanTypes] = useState([]);
  let [params] = useSearchParams();
  const academicAsignatureCourseId = params.get('academicAsignatureCourseId');
  const asignatureId = params.get('asignatureId');
  const gradeId = params.get('gradeId');
  const intl = useIntl();

  const methods = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const { handleSubmit, control, register, reset, setValue, getValues } = methods;

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
      if (props?.data?.academicPeriod !== undefined && props?.data?.academicPeriod != null) {
        setAcademicPeriod({
          key: props?.data?.academicPeriod?.id,
          label: props?.data?.academicPeriod?.name,
          value: props?.data?.academicPeriod?.id,
        });
      }
      if (
        props?.data?.evaluativeComponents !== undefined &&
        props?.data?.evaluativeComponents != null
      ) {
        setEvaluativeComponent(
          props?.data?.evaluativeComponents.map((c: any) => {
            return { label: `${c?.name} (${c?.weight}%)`, value: c?.id, key: c?.id };
          }),
        );
      }
      if (props?.data?.learnigs !== undefined && props?.data?.learnigs != null) {
        let array: any = [];
        setLearnings(
          props?.data?.learnigs.map((c: any) => {
            array = array.concat(
              c.evidenceLearnings.map((e: any) => {
                e.checked = props?.data?.evidenceLearnings.find((x: any) => x?.id === e?.id)
                  ? true
                  : false;
                return e;
              }),
            );
            return {
              label: c.statement,
              value: c.id,
              key: c.id,
              evidenceLearnings: c.evidenceLearnings,
            };
          }),
        );
        checksEvidencesLearning = [...array];
        setChecksEvidencesLearning(checksEvidencesLearning);
      }
      if (props?.data?.evidenceLearnings !== undefined && props?.data?.evidenceLearnings != null) {
        setChecksEvidencesLearningSelected(
          props?.data?.evidenceLearnings.map((c: any) => {
            return c?.id;
          }),
        );
      }
      if (props?.data?.experienceType !== undefined && props?.data?.experienceType != null) {
        setExperienceType({
          key: props?.data?.experienceType,
          label: intl.messages['display.' + props?.data?.experienceType],
          value: props?.data?.experienceType,
        });
      }
      if (props?.data?.dateDelivery !== undefined && props?.data?.dateDelivery != null) {
        setDate(new Date(props?.data?.dateDelivery));
      }
      if (props?.data?.openTestDate !== undefined && props?.data?.openTestDate != null) {
        setOpenTestDate(new Date(props?.data?.openTestDate));
      }
      if (props?.data?.closeTestDate !== undefined && props?.data?.closeTestDate != null) {
        setCloseTestDate(new Date(props?.data?.closeTestDate));
      }
      if (
        props?.data?.experienceLearningPerformanceLevel !== undefined &&
        props?.data?.experienceLearningPerformanceLevel != null
      ) {
        setCriteriaPerformances(
          props?.data?.experienceLearningPerformanceLevel.map((c: any) => {
            return {
              performanceLevelId: c.performanceLevelId,
              criteria: c.criteria,
            };
          }),
        );
      }
      if (props?.data?.navigationMethod !== undefined && props?.data?.navigationMethod != null) {
        setNavigationMethod({
          key: props?.data?.navigationMethod,
          label: intl.messages['display.' + props?.data?.navigationMethod],
          value: props?.data?.navigationMethod,
        });
      }
    }
    setLoading(false);
  }, [props?.data]);

  const cleanForm = async () => {
    reset();
    setCampus(null);
    setLearnings(null);
    setCloseTestDate(null);
    setOpenTestDate(null);
    setChecksEvidencesLearning([]);
    setChecksEvidencesLearningSelected([]);
    setAcademicPeriod(null);
    setEvaluativeComponent(null);
    setDate(null);
    setExperienceType(null);
    if (props?.loginReducer?.campusId && !props?.data?.id) {
      // set value when register is new and sesion contains value
      register('campusId', {
        required: true,
        value: props?.loginReducer?.campusId,
      });
    }
    if (academicAsignatureCourseId && !props?.data?.id) {
      // set value when register is new and sesion contains value
      register('academicAsignatureCourseId', {
        required: true,
        value: academicAsignatureCourseId,
      });
    }
  };

  const setCriteriaPerformance = async (e: any, id: any) => {
    let ind = criteriaPerformances.findIndex((c: any) => c.performanceLevelId === id);
    if (ind !== -1) {
      criteriaPerformances.splice(ind, 1);
    }
    criteriaPerformances.push({
      criteria: e?.target?.value,
      performanceLevelId: id,
    });
    setCriteriaPerformances(criteriaPerformances);
    register('experienceLearningPerformanceLevel', {
      required: true,
      value: criteriaPerformances,
    });
  };

  const getDropdowns = async () => {
    props.getNavigationMethodTestOnline().then((data: any) => {
      setNavigationMethodList(
        data.map((c: any) => {
          return { label: intl.messages['display.' + c.name], value: c.name, key: c.name };
        }),
      );
    });
    props.getExperienceType().then((data: any) => {
      setExperienceTypes(
        data.map((c: any) => {
          return { label: intl.messages['display.' + c.name], value: c.name, key: c.name };
        }),
      );
    });
    props.getExperienceRecoveryPlanType().then((data: any) => {
      setExperienceRecoveryPlanTypes(
        data.map((c: any) => {
          return { label: intl.messages['display.' + c.name], value: c.name, key: c.name };
        }),
      );
    });
    props
      .getDropdownsExperienceLearning(
        props?.loginReducer?.schoolId,
        asignatureId,
        gradeId,
        props?.loginReducer?.schoolYear,
        academicAsignatureCourseId,
      )
      .then((data: any) => {
        setCampusList(
          data.dataCampus.edges.map((c: any) => {
            return { label: c.node.name, value: c.node.id, key: c.node.id };
          }),
        );
        setLearningList(
          data.dataLearnings.edges.map((c: any) => {
            return {
              label: c.node.statement,
              value: c.node.id,
              key: c.node.id,
              evidenceLearnings: c.node.evidenceLearnings,
            };
          }),
        );
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
        setPerformanceLevels(
          data?.dataPerformanceLevels?.edges.map((c: any) => {
            return {
              label: `${c?.node?.name}: ${c?.node?.minimumScore} - ${c?.node?.topScore}`,
              name: c?.node?.name,
              value: c?.node?.id,
              key: c?.node?.id,
            };
          }),
        );
        setEvaluativeComponentList(
          data?.dataEvaluativeComponents?.edges.map((c: any) => {
            return {
              label: `${c?.node?.name} (${c?.node?.weight}%)`,
              name: c?.node?.name,
              value: c?.node?.id,
              key: c?.node?.id,
            };
          }),
        );
      });
  };

  const setEvidencesLearning = async (item: any) => {
    let array: any = [];
    item.forEach((element: any) => {
      array = array.concat(element.evidenceLearnings);
    });
    checksEvidencesLearning = [...array];
    setChecksEvidencesLearning(checksEvidencesLearning);
  };

  const data = {
    onlineDelivery:
      props?.data?.id || props?.data?.onlineDelivery === getValues('onlineDelivery ')
        ? props?.data?.onlineDelivery
        : getValues('onlineDelivery'),
    shuffleQuestions:
      props?.data?.id || props?.data?.shuffleQuestions === getValues('shuffleQuestions ')
        ? props?.data?.shuffleQuestions
        : getValues('shuffleQuestions'),
  };

  const { ref: titleRef, ...titleRest } = register('title', {
    required: true,
    value: props?.data?.id ? props?.data?.title : '',
  });
  const { ref: criteriaRef, ...criteriaRest } = register('criteria', {
    required: true,
    value: props?.data?.id ? props?.data?.criteria : '',
  });
  const { ref: descriptionRef, ...descriptionRest } = register('description', {
    required: true,
    value: props?.data?.id ? props?.data?.description : '',
  });
  register('academicAsignatureCourseId', {
    required: true,
    value: props?.data?.id ? props?.data?.academicAsignatureCourseId : '',
  });
  register('dateDelivery', {
    required: true,
    value: props?.data?.id ? props?.data?.dateDelivery : null,
  });
  register('experienceType', {
    required: true,
    value: props?.data?.id ? props?.data?.experienceType : '',
  });
  register('evidenceLearningsId', {
    required: true,
    value: props?.data?.id ? props?.data?.evidenceLearningsId : [],
  });
  register('learningsId', {
    required: true,
    value: props?.data?.id ? props?.data?.learningsId : [],
  });
  register('campusId', {
    required: true,
    value: props?.data?.id ? props?.data?.campusId : '',
  });
  register('academicPeriodId', {
    required: true,
    value: props?.data?.id ? props?.data?.academicPeriodId : '',
  });
  register('evaluativeComponentsId', {
    required: true,
    value: props?.data?.id ? props?.data?.evaluativeComponentsId : [],
  });
  register('experienceLearningPerformanceLevel', {
    required: true,
    value: criteriaPerformances,
  });
  register('experienceLearningType', {
    required: true,
    value: props?.experienceLearningType,
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
            isLg={true}
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
            <ModalBody className="row">
              <div className="form-group col-md-6">
                <Label>
                  <IntlMessages id="forms.name" />
                </Label>
                <Input {...titleRest} innerRef={titleRef} className="form-control" />
              </div>
              <div className="form-group col-md-6">
                <Label>
                  <IntlMessages id="forms.experienceType" />
                </Label>
                {props?.experienceLearningType === "NORMAL" ?
                  <Select
                    isClearable
                    placeholder={<IntlMessages id="forms.select" />}
                    {...register('experienceType', { required: true })}
                    className="react-select"
                    classNamePrefix="react-select"
                    options={experienceTypes}
                    value={experienceType}
                    onChange={(selectedOption) => {
                      setValue('experienceType', selectedOption?.key);
                      setExperienceType(selectedOption);
                    }} />
                  :
                  <Select
                    isClearable
                    placeholder={<IntlMessages id="forms.select" />}
                    {...register('experienceType', { required: true })}
                    className="react-select"
                    classNamePrefix="react-select"
                    options={experienceRecoveryPlanTypes}
                    value={experienceType}
                    onChange={(selectedOption) => {
                      setValue('experienceType', selectedOption?.key);
                      setExperienceType(selectedOption);
                    }} />
                }
              </div>
              {experienceType?.key === 'ONLINETEST' ? (
                <>
                  <div className="form-group col-md-6">
                    <Label>Fecha de apertura</Label>
                    <ReactDatePicker
                      {...register('openTestDate', { required: true })}
                      selected={openTestDate}
                      onChange={(dateOp: any) => {
                        setValue('openTestDate', dateOp as Date);
                        setOpenTestDate(dateOp as Date);
                      }}
                    />
                  </div>
                  <div className="form-group col-md-6">
                    <Label>Fecha de cierre</Label>
                    <ReactDatePicker
                      {...register('closeTestDate', { required: true })}
                      selected={closeTestDate}
                      onChange={(dateCl: any) => {
                        setValue('closeTestDate', dateCl as Date);
                        setCloseTestDate(dateCl as Date);
                      }}
                    />
                  </div>
                  <div className="form-group col-md-6 d-flex align-items-center">
                    <Input
                      className="itemCheck mb-0 mr-2"
                      type="checkbox"
                      id={`check_shuffleQuestions`}
                      defaultChecked={data.shuffleQuestions}
                      onChange={() => {
                        setValue('shuffleQuestions', !data.shuffleQuestions);
                      }}
                      label=""
                    />
                    <span>Preguntas aleatorias</span>
                  </div>
                  <div className="form-group col-md-6">
                    <Label>Método de navegación</Label>
                    <Select
                      isClearable
                      placeholder={<IntlMessages id="forms.select" />}
                      {...register('navigationMethod', { required: true })}
                      className="react-select"
                      classNamePrefix="react-select"
                      options={navigationMethodList}
                      value={navigationMethod}
                      onChange={(selectedOption) => {
                        setValue('navigationMethod', selectedOption?.key);
                        setNavigationMethod(selectedOption);
                      }}
                    />
                  </div>
                </>
              ) : (
                ''
              )}
              <div className="form-group col-md-6">
                <Label>
                  <IntlMessages id="menu.evaluativeComponent" />
                </Label>
                <Select
                  isClearable
                  isMulti
                  placeholder={<IntlMessages id="forms.select" />}
                  {...register('evaluativeComponentsId', { required: true })}
                  className="react-select"
                  classNamePrefix="react-select"
                  options={evaluativeComponentList}
                  value={evaluativeComponent}
                  onChange={(selectedOption) => {
                    setValue(
                      'evaluativeComponentsId',
                      selectedOption.map((c: any) => {
                        return c.key;
                      }),
                    );
                    setEvaluativeComponent(selectedOption);
                  }}
                />
              </div>
              <div className="form-group col-md-6">
                <Label>
                  <IntlMessages id="menu.periodAcademic" />
                </Label>
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
              </div>
              <div className="form-group col-md-6">
                <Label>
                  <IntlMessages id="forms.dateDelivery" />
                </Label>
                <ReactDatePicker
                  disabled={!academicPeriod?.key}
                  minDate={new Date(academicPeriod?.startDate)}
                  maxDate={new Date(academicPeriod?.endDate)}
                  {...register('dateDelivery', { required: true })}
                  selected={date}
                  onChange={(d: any) => {
                    setValue('dateDelivery', d as Date);
                    setDate(d as Date);
                  }}
                />
              </div>
              <div className="form-group col-md-6 d-flex align-items-center">
                <Input
                  className="itemCheck mb-0 mr-2"
                  type="checkbox"
                  id={`check_hidden`}
                  defaultChecked={data.onlineDelivery}
                  onChange={() => {
                    setValue('onlineDelivery', !data.onlineDelivery);
                  }}
                  label=""
                />
                <span>Entrega online</span>
              </div>
              <div className="form-group col-md-12">
                <Label>
                  <IntlMessages id="menu.learnings" />
                </Label>
                <Select
                  isClearable
                  placeholder={<IntlMessages id="forms.select" />}
                  isMulti
                  {...register('learningsId', { required: true })}
                  className="react-select"
                  classNamePrefix="react-select"
                  options={learningList}
                  value={learnings}
                  onChange={(selectedOption: any) => {
                    setValue(
                      'learningsId',
                      selectedOption.map((c: any) => {
                        return c.key;
                      }),
                    );
                    setLearnings(selectedOption);
                    setEvidencesLearning(selectedOption);
                  }}
                />
              </div>
              <div className="form-group col-md-12">
                {checksEvidencesLearning.map((item: any) => {
                  return (
                    <>
                      <div className="d-flex align-items-center">
                        <Input
                          className="itemCheck mb-0"
                          type="checkbox"
                          id={`check_hidden`}
                          defaultChecked={item?.checked}
                          onChange={() => {
                            if (checksEvidencesLearningSelected.find((x: any) => x === item.id)) {
                              checksEvidencesLearningSelected =
                                checksEvidencesLearningSelected.filter((x: any) => x !== item.id);
                            } else {
                              checksEvidencesLearningSelected.push(item.id);
                            }
                            checksEvidencesLearningSelected = [...checksEvidencesLearningSelected];
                            setChecksEvidencesLearningSelected(checksEvidencesLearningSelected);
                            setValue('evidenceLearningsId', checksEvidencesLearningSelected);
                          }}
                          label=""
                        />
                        <span className="col-md-11">{item?.statement}</span>
                      </div>
                    </>
                  );
                })}
              </div>
              <div className="form-group col-md-12">
                <Label>
                  <IntlMessages id="forms.description" />
                </Label>
                <Input
                  type="textarea"
                  rows="2"
                  {...descriptionRest}
                  innerRef={descriptionRef}
                  className="form-control"
                />
              </div>
              {experienceType?.key === 'COEVALUATION' || experienceType?.key === 'SELFAPPRAISAL' ? (
                <>
                  <div className="form-group col-md-12">
                    <Label>
                      <IntlMessages id="forms.criteria" />
                    </Label>
                    <Input
                      type="textarea"
                      rows="2"
                      {...criteriaRest}
                      innerRef={criteriaRef}
                      className="form-control"
                    />
                  </div>
                  <p className="mt-2 font-bold col-md-12">Criterios por nivel de desempeño</p>
                  <hr />
                  {performanceLevels
                    ? props?.data?.id
                      ? criteriaPerformances.map((item: any, index: any) => {
                        return (
                          <div key={index} className="form-group col-md-12">
                            <span>
                              {
                                performanceLevels.find(
                                  (p: any) => p.key === item?.performanceLevelId,
                                )?.label
                              }
                            </span>
                            <Input
                              defaultValue={item?.criteria}
                              onInput={(e) => {
                                return setCriteriaPerformance(e, item?.performanceLevelId);
                              }}
                              className="form-control"
                            />
                          </div>
                        );
                      })
                      : performanceLevels.map((item: any, index: any) => {
                        return (
                          <div key={index} className="form-group col-md-12">
                            <span>{item.label}</span>
                            <Input
                              onInput={(e) => {
                                return setCriteriaPerformance(e, item?.key);
                              }}
                              className="form-control"
                            />
                          </div>
                        );
                      })
                    : ''}
                </>
              ) : (
                ''
              )}
              {!props?.loginReducer?.campusId ? (
                <div className="form-group">
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
                </div>
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

const mapDispatchToProps = { ...experienceLearningActions };

const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

export default connect(mapStateToProps, mapDispatchToProps)(ExperienceLearningCreateEdit);
