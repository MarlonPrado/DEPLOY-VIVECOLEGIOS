import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import Select from 'react-select';
import { Input, Label, ModalBody, ModalFooter } from 'reactstrap';

import { permissionsMenu } from '../../../helpers/DataTransformations';
import IntlMessages from '../../../helpers/IntlMessages';
import * as schoolYearActions from '../../../stores/actions/SchoolYearActions';
import { Colxx } from '../../common/CustomBootstrap';
import AddNewModal from '../../common/Data/AddNewModal';
import CreateEditAuditInformation from '../../common/Data/CreateEditAuditInformation';
import FormGroupCustom from '../../common/Data/FormGroupCustom';
import LabelCustom from '../../common/Data/LabelCustom';
import RequiredMessagesCustom from '../../common/Data/RequiredMessagesCustom';
import { Loader } from '../../common/Loader';

const SchoolYearCreateEdit = (props: any) => {
  const [loading, setLoading] = useState(true);
  const [schoolList, setSchoolList] = useState(null);
  const [school, setSchool] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [schoolYearList, setSchoolYearList] = useState(null);
  const [schoolYearImport, setSchoolYearImport] = useState(null);

  const [academicPeriod, setAcademicPeriod] = useState(true);
  const [academicDay, setAcademicDay] = useState(true);
  const [academicHour, setAcademicHour] = useState(true);
  const [educationLevel, setEducationLevel] = useState(true);
  const [performanceLevel, setPerformanceLevel] = useState(true);
  const [evaluativeComponent, setEvaluativeComponent] = useState(true);
  const [modality, setModality] = useState(true);
  const [speciality, setSpeciality] = useState(true);
  const [area, setArea] = useState(true);
  const [asignature, setAsignature] = useState(true);
  const [grade, setGrade] = useState(true);
  const [gradeAssignment, setGradeAssignment] = useState(true);
  const [course, setCourse] = useState(true);
  const [academicAsignatureCourse, setAcademicAsignatureCourse] = useState(true);
  const [teacher, setTeacher] = useState(true);
  const [studentPromoted, setStudentPromoted] = useState(true);
  const [studentNoPromoted, setStudentNoPromoted] = useState(true);

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
      if (props?.data?.schoolYearImport !== undefined && props?.data?.schoolYearImport != null) {
        setSchoolYearImport({
          key: props?.data?.schoolYearImport?.id,
          label: props?.data?.schoolYearImport?.schoolYear,
          value: props?.data?.schoolYearImport?.id,
        });
      }
      if (props?.data?.startDate !== undefined && props?.data?.startDate != null) {
        setStartDate(new Date(props?.data?.startDate));
      }
      if (props?.data?.endDate !== undefined && props?.data?.endDate != null) {
        setEndDate(new Date(props?.data?.endDate));
      }
      register('startDate', {
        required: true,
        value: props?.data?.id ? props?.data?.startDate : '',
      });
      register('endDate', {
        required: true,
        value: props?.data?.id ? props?.data?.endDate : '',
      });
      setAcademicPeriod(props?.data?.schoolYearImportOptions?.academicPeriod);
      setAcademicDay(props?.data?.schoolYearImportOptions?.academicDay);
      setAcademicHour(props?.data?.schoolYearImportOptions?.academicHour);
      setEducationLevel(props?.data?.schoolYearImportOptions?.educationLevel);
      setPerformanceLevel(props?.data?.schoolYearImportOptions?.performanceLevel);
      setEvaluativeComponent(props?.data?.schoolYearImportOptions?.evaluativeComponent);
      setModality(props?.data?.schoolYearImportOptions?.modality);
      setSpeciality(props?.data?.schoolYearImportOptions?.speciality);
      setArea(props?.data?.schoolYearImportOptions?.area);
      setAsignature(props?.data?.schoolYearImportOptions?.asignature);
      setGrade(props?.data?.schoolYearImportOptions?.grade);
      console.log('setGradeAssignment');
      console.log(props?.data?.schoolYearImportOptions?.gradeAssignment);
      setGradeAssignment(props?.data?.schoolYearImportOptions?.gradeAssignment);
      setCourse(props?.data?.schoolYearImportOptions?.course);
      setAcademicAsignatureCourse(props?.data?.schoolYearImportOptions?.academicAsignatureCourse);
      setTeacher(props?.data?.schoolYearImportOptions?.teacher);
      setStudentPromoted(props?.data?.schoolYearImportOptions?.studentPromoted);
      setStudentNoPromoted(props?.data?.schoolYearImportOptions?.studentNoPromoted);
    } else {
      setSchool({
        key: props?.loginReducer?.schoolData?.id,
        label: props?.loginReducer?.schoolData?.name,
        value: props?.loginReducer?.schoolData?.id,
      });
    }
    register('schoolYearImportOptions.academicPeriod', {
      required: false,
      value: props?.data?.id ? props?.data?.schoolYearImportOptions?.academicPeriod : true,
    });
    register('schoolYearImportOptions.academicDay', {
      required: false,
      value: props?.data?.id ? props?.data?.schoolYearImportOptions?.academicDay : true,
    });
    register('schoolYearImportOptions.academicHour', {
      required: false,
      value: props?.data?.id ? props?.data?.schoolYearImportOptions?.academicHour : true,
    });
    register('schoolYearImportOptions.educationLevel', {
      required: false,
      value: props?.data?.id ? props?.data?.schoolYearImportOptions?.educationLevel : true,
    });
    register('schoolYearImportOptions.performanceLevel', {
      required: false,
      value: props?.data?.id ? props?.data?.schoolYearImportOptions?.performanceLevel : true,
    });
    register('schoolYearImportOptions.evaluativeComponent', {
      required: false,
      value: props?.data?.id ? props?.data?.schoolYearImportOptions?.evaluativeComponent : true,
    });
    register('schoolYearImportOptions.modality', {
      required: false,
      value: props?.data?.id ? props?.data?.schoolYearImportOptions?.modality : true,
    });
    register('schoolYearImportOptions.speciality', {
      required: false,
      value: props?.data?.id ? props?.data?.schoolYearImportOptions?.speciality : true,
    });
    register('schoolYearImportOptions.area', {
      required: false,
      value: props?.data?.id ? props?.data?.schoolYearImportOptions?.area : true,
    });
    register('schoolYearImportOptions.asignature', {
      required: false,
      value: props?.data?.id ? props?.data?.schoolYearImportOptions?.asignature : true,
    });
    register('schoolYearImportOptions.grade', {
      required: false,
      value: props?.data?.id ? props?.data?.schoolYearImportOptions?.grade : true,
    });
    register('schoolYearImportOptions.gradeAssignment', {
      required: false,
      value: props?.data?.id ? props?.data?.schoolYearImportOptions?.gradeAssignment : true,
    });
    register('schoolYearImportOptions.course', {
      required: false,
      value: props?.data?.id ? props?.data?.schoolYearImportOptions?.course : true,
    });
    register('schoolYearImportOptions.academicAsignatureCourse', {
      required: false,
      value: props?.data?.id
        ? props?.data?.schoolYearImportOptions?.academicAsignatureCourse
        : true,
    });
    register('schoolYearImportOptions.teacher', {
      required: false,
      value: props?.data?.id ? props?.data?.schoolYearImportOptions?.teacher : true,
    });
    register('schoolYearImportOptions.studentPromoted', {
      required: false,
      value: props?.data?.id ? props?.data?.schoolYearImportOptions?.studentPromoted : true,
    });
    register('schoolYearImportOptions.studentNoPromoted', {
      required: false,
      value: props?.data?.id ? props?.data?.schoolYearImportOptions?.studentNoPromoted : true,
    });
    setLoading(false);
  }, [props?.data]);

  const cleanForm = async () => {
    reset();
    setStartDate(null);
    setEndDate(null);
    setSchool(null);
    setSchoolYearImport(null);
    if (props?.loginReducer?.schoolId && !props?.data?.id) {
      // set value when register is new and sesion contains value
      register('schoolId', {
        required: true,
        value: props?.loginReducer?.schoolId,
      });
    }
  };

  const getDropdowns = async () => {
    props.getListAllSchoolYear(props?.loginReducer?.schoolId, false).then((data: any) => {
      setSchoolYearList(
        data.map((c: any) => {
          return { label: c.node.schoolYear, value: c.node.id, key: c.node.id };
        }),
      );
      if (!props?.data?.id) {
        setSchoolYearImport({
          label: data[0].node.schoolYear,
          value: data[0].node.id,
          key: data[0].node.id,
        });
      }
      if (!props?.data?.id) {
        setSchoolYearImport({
          label: data[0].node.schoolYear,
          value: data[0].node.id,
          key: data[0].node.id,
        });
      }
      register('schoolYearImportId', {
        required: false,
        value: props?.data?.id ? props?.data?.schoolYearImportId : data[0].node.id,
      });
    });
    setSchoolList([
      {
        key: props?.loginReducer?.schoolData?.id,
        label: props?.loginReducer?.schoolData?.name,
        value: props?.loginReducer?.schoolData?.id,
      },
    ]);
  };

  const { ref: folioNumberRef, ...folioNumberRest } = register('folioNumber', {
    required: false,
    value: props?.data?.id ? props?.data?.folioNumber : '',
  });

  const { ref: schoolYearRef, ...schoolYearRest } = register('schoolYear', {
    required: true,
    value: props?.data?.id ? props?.data?.schoolYear : '',
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
                <LabelCustom id="menu.schoolYear" required={true} />
                <Input {...schoolYearRest} innerRef={schoolYearRef} className="form-control" />
                <RequiredMessagesCustom formState={formState} register={'schoolYear'} />
              </FormGroupCustom>
              <FormGroupCustom>
                <LabelCustom id="forms.folioNumber" required={false} />
                <Input {...folioNumberRest} innerRef={folioNumberRef} className="form-control" />
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
                <RequiredMessagesCustom formState={formState} register={'startDate'} />
              </FormGroupCustom>
              <FormGroupCustom>
                <LabelCustom id="forms.endDate" required={true} />
                <DatePicker
                  {...register('endDate', { required: true })}
                  selected={endDate}
                  onChange={(date: any) => {
                    setValue('endDate', date as Date);
                    setEndDate(date as Date);
                    trigger('endDate');
                  }}
                  minDate={startDate}
                  disabled={startDate == null}
                />
                <RequiredMessagesCustom formState={formState} register={'endDate'} />
              </FormGroupCustom>
              <FormGroupCustom>
                <LabelCustom id="forms.schoolYearImport" required={false} />
                <Select
                  isClearable
                  placeholder={<IntlMessages id="forms.select" />}
                  //{...register('schoolYearImportId', { required: false })}
                  className="react-select"
                  classNamePrefix="react-select"
                  options={schoolYearList}
                  value={schoolYearImport}
                  isDisabled={props?.data?.id}
                  onChange={(selectedOption: any) => {
                    setValue('schoolYearImportId', selectedOption?.value);
                    setSchoolYearImport(selectedOption);
                    trigger('schoolYearImportId');
                  }}
                />
              </FormGroupCustom>
              {schoolYearImport ? (
                <>
                  <div className="form-group d-flex align-items-center">
                    <Input
                      className="itemCheck m-0 mr-2"
                      type="checkbox"
                      id={`check_academicPeriod`}
                      defaultChecked={academicPeriod}
                      checked={academicPeriod}
                      onChange={() => {
                        setValue('schoolYearImportOptions.academicPeriod', !academicPeriod);
                        setAcademicPeriod(!academicPeriod);
                      }}
                      label=""
                      disabled={true}
                    />
                    {<IntlMessages id="forms.academicPeriod" />}
                  </div>
                  <div className="form-group d-flex align-items-center">
                    <Input
                      className="itemCheck m-0 mr-2"
                      type="checkbox"
                      id={`check_academicDay`}
                      defaultChecked={academicDay}
                      checked={academicDay}
                      onChange={() => {
                        setValue('schoolYearImportOptions.academicDay', !academicDay);
                        setAcademicDay(!academicDay);
                        if (!academicDay === false) {
                          setAcademicHour(false);
                        }
                      }}
                      label=""
                      disabled={true}
                    />
                    {<IntlMessages id="forms.academicDay" />}
                  </div>
                  <div className="form-group d-flex align-items-center">
                    <Input
                      className="itemCheck m-0 mr-2"
                      type="checkbox"
                      id={`check_academicHour`}
                      defaultChecked={academicHour}
                      checked={academicHour}
                      onChange={() => {
                        setValue('schoolYearImportOptions.academicHour', !academicHour);
                        setAcademicHour(!academicHour);
                        if (!academicHour === true) {
                          setAcademicDay(true);
                        }
                      }}
                      label=""
                      disabled={true}
                    />
                    {<IntlMessages id="menu.academicHour" />}
                  </div>
                  <div className="form-group d-flex align-items-center">
                    <Input
                      className="itemCheck m-0 mr-2"
                      type="checkbox"
                      id={`check_educationLevel`}
                      defaultChecked={educationLevel}
                      checked={educationLevel}
                      onChange={() => {
                        setValue('schoolYearImportOptions.educationLevel', !educationLevel);
                        setEducationLevel(!educationLevel);
                      }}
                      label=""
                      disabled={true}
                    />
                    {<IntlMessages id="menu.educationLevel" />}
                  </div>
                  <div className="form-group d-flex align-items-center">
                    <Input
                      className="itemCheck m-0 mr-2"
                      type="checkbox"
                      id={`check_performanceLevel`}
                      defaultChecked={performanceLevel}
                      checked={performanceLevel}
                      onChange={() => {
                        setValue('schoolYearImportOptions.performanceLevel', !performanceLevel);
                        setPerformanceLevel(!performanceLevel);
                      }}
                      label=""
                      disabled={true}
                    />
                    {<IntlMessages id="menu.performanceLevel" />}
                  </div>
                  <div className="form-group d-flex align-items-center">
                    <Input
                      className="itemCheck m-0 mr-2"
                      type="checkbox"
                      id={`check_evaluativeComponent`}
                      defaultChecked={evaluativeComponent}
                      checked={evaluativeComponent}
                      onChange={() => {
                        setValue(
                          'schoolYearImportOptions.evaluativeComponent',
                          !evaluativeComponent,
                        );
                        setEvaluativeComponent(!evaluativeComponent);
                      }}
                      label=""
                      disabled={true}
                    />
                    {<IntlMessages id="menu.evaluativeComponent" />}
                  </div>
                  <div className="form-group d-flex align-items-center">
                    <Input
                      className="itemCheck m-0 mr-2"
                      type="checkbox"
                      id={`check_modality`}
                      defaultChecked={modality}
                      checked={modality}
                      onChange={() => {
                        setValue('schoolYearImportOptions.modality', !modality);
                        setModality(!modality);
                        if (!modality === false) {
                          setSpeciality(false);
                        }
                      }}
                      label=""
                      disabled={true}
                    />
                    {<IntlMessages id="menu.modality" />}
                  </div>
                  <div className="form-group d-flex align-items-center">
                    <Input
                      className="itemCheck m-0 mr-2"
                      type="checkbox"
                      id={`check_speciality`}
                      defaultChecked={speciality}
                      checked={speciality}
                      onChange={() => {
                        setValue('schoolYearImportOptions.speciality', !speciality);
                        setSpeciality(!speciality);
                        if (!modality === true) {
                          setModality(true);
                        }
                      }}
                      label=""
                      disabled={true}
                    />
                    {<IntlMessages id="menu.speciality" />}
                  </div>
                  <div className="form-group d-flex align-items-center">
                    <Input
                      className="itemCheck m-0 mr-2"
                      type="checkbox"
                      id={`check_area`}
                      defaultChecked={area}
                      checked={area}
                      onChange={() => {
                        setValue('schoolYearImportOptions.area', !area);
                        setArea(!area);
                        if (!area === false) {
                          setAsignature(false);
                        }
                      }}
                      label=""
                      disabled={true}
                    />
                    {<IntlMessages id="menu.areas" />}
                  </div>
                  <div className="form-group d-flex align-items-center">
                    <Input
                      className="itemCheck m-0 mr-2"
                      type="checkbox"
                      id={`check_asignature`}
                      defaultChecked={asignature}
                      checked={asignature}
                      onChange={() => {
                        setValue('schoolYearImportOptions.asignature', !asignature);
                        setAsignature(!asignature);
                        if (!asignature === true) {
                          setArea(true);
                        }
                      }}
                      label=""
                      disabled={true}
                    />
                    {<IntlMessages id="menu.asignatures" />}
                  </div>
                  <div className="form-group d-flex align-items-center">
                    <Input
                      className="itemCheck m-0 mr-2"
                      type="checkbox"
                      id={`check_grade`}
                      defaultChecked={grade}
                      checked={grade}
                      onChange={() => {
                        setValue('schoolYearImportOptions.grade', !grade);
                        setGrade(!grade);
                        if (!grade === false) {
                          setCourse(false);
                          setGradeAssignment(false);
                          setAcademicAsignatureCourse(false);
                        }
                      }}
                      label=""
                      disabled={true}
                    />
                    {<IntlMessages id="menu.grades" />}
                  </div>
                  <div className="form-group d-flex align-items-center">
                    <Input
                      className="itemCheck m-0 mr-2"
                      type="checkbox"
                      id={`check_gradeAssignment`}
                      defaultChecked={gradeAssignment}
                      checked={gradeAssignment}
                      onChange={() => {
                        setValue('schoolYearImportOptions.gradeAssignment', !gradeAssignment);
                        setGradeAssignment(!gradeAssignment);
                        if (!gradeAssignment === true) {
                          setGrade(true);
                        }
                      }}
                      label=""
                      disabled={true}
                    />
                    {<IntlMessages id="menu.gradeAssignment" />}
                  </div>
                  <div className="form-group d-flex align-items-center">
                    <Input
                      className="itemCheck m-0 mr-2"
                      type="checkbox"
                      id={`check_course`}
                      defaultChecked={course}
                      checked={course}
                      onChange={() => {
                        setValue('schoolYearImportOptions.course', !course);
                        setCourse(!course);
                        if (!course === true) {
                          setGrade(true);
                        }
                      }}
                      label=""
                      disabled={true}
                    />
                    {<IntlMessages id="menu.courses" />}
                  </div>
                  <div className="form-group d-flex align-items-center">
                    <Input
                      className="itemCheck m-0 mr-2"
                      type="checkbox"
                      id={`check_academicAsignatureCourse`}
                      defaultChecked={academicAsignatureCourse}
                      checked={academicAsignatureCourse}
                      onChange={() => {
                        setValue(
                          'schoolYearImportOptions.academicAsignatureCourse',
                          !academicAsignatureCourse,
                        );
                        setAcademicAsignatureCourse(!academicAsignatureCourse);
                        if (!academicAsignatureCourse === true) {
                          setCourse(true);
                          setGradeAssignment(true);
                          setGrade(true);
                        }
                      }}
                      label=""
                      disabled={true}
                    />
                    {<IntlMessages id="menu.academicAsignatureCourseBasic" />}
                  </div>
                  <div className="form-group d-flex align-items-center">
                    <Input
                      className="itemCheck m-0 mr-2"
                      type="checkbox"
                      id={`check_teacher`}
                      defaultChecked={teacher}
                      checked={teacher}
                      onChange={() => {
                        setValue('schoolYearImportOptions.teacher', !teacher);
                        setTeacher(!teacher);
                      }}
                      label=""
                      disabled={true}
                    />
                    {<IntlMessages id="menu.teachers" />}
                  </div>
                  <div className="form-group d-flex align-items-center">
                    <Input
                      className="itemCheck m-0 mr-2"
                      type="checkbox"
                      id={`check_studentPromoted`}
                      defaultChecked={studentPromoted}
                      checked={studentPromoted}
                      onChange={() => {
                        setValue('schoolYearImportOptions.studentPromoted', !studentPromoted);
                        setStudentPromoted(!studentPromoted);
                        if (!studentPromoted === true) {
                          setGrade(true);
                        }
                      }}
                      label=""
                      disabled={true}
                    />
                    {<IntlMessages id="forms.studentPromoted" />}
                  </div>
                  <div className="form-group d-flex align-items-center">
                    <Input
                      className="itemCheck m-0 mr-2"
                      type="checkbox"
                      id={`check_studentNoPromoted`}
                      defaultChecked={studentNoPromoted}
                      checked={studentNoPromoted}
                      onChange={() => {
                        setValue('schoolYearImportOptions.studentNoPromoted', !studentNoPromoted);
                        setStudentNoPromoted(!studentNoPromoted);
                        if (!studentNoPromoted === true) {
                          setGrade(true);
                        }
                      }}
                      label=""
                      disabled={true}
                    />
                    {<IntlMessages id="forms.studentNoPromoted" />}
                  </div>
                </>
              ) : (
                ''
              )}
              <FormGroupCustom>
                <LabelCustom id="menu.ie" required={true} />
                <Select
                  isClearable
                  placeholder={<IntlMessages id="forms.select" />}
                  //{...register('schoolId', { required: true })}
                  className="react-select"
                  classNamePrefix="react-select"
                  options={schoolList}
                  value={school}
                  isDisabled={true}
                />
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

const mapDispatchToProps = { ...schoolYearActions };

const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

export default connect(mapStateToProps, mapDispatchToProps)(SchoolYearCreateEdit);
