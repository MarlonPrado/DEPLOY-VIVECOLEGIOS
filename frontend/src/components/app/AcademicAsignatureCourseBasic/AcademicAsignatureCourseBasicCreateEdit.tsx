import { DevTool } from '@hookform/devtools';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import Select from 'react-select';
import { Input, Label, ModalBody, ModalFooter } from 'reactstrap';
import IntlMessages from '../../../helpers/IntlMessages';
import * as academicIndicatorActions from '../../../stores/actions/AcademicAsignatureCourseActions';
import * as courseActions from '../../../stores/actions/CourseActions';
import { Colxx } from '../../common/CustomBootstrap';
import AddNewModal from '../../common/Data/AddNewModal';
import CreateEditAuditInformation from '../../common/Data/CreateEditAuditInformation';
import FormGroupCustom from '../../common/Data/FormGroupCustom';
import LabelCustom from '../../common/Data/LabelCustom';
import RequiredMessagesCustom from '../../common/Data/RequiredMessagesCustom';
import { Loader } from '../../common/Loader';

const AcademicAsignatureCourseBasicCreateEdit = (props: any) => {
  const [loading, setLoading] = useState(true);
  const [coursesList, setCoursesList] = useState(null);
  const [asignaturesList, setAsignaturesList] = useState(null);
  const [campusList, setCampusList] = useState(null);
  const [gradesList, setGradesList] = useState(null);
  const [teachersList, setTeachersList] = useState(null);
  const [campus, setCampus] = useState(null);
  const [course, setCourse] = useState(null);
  const [teacher, setTeacher] = useState(null);
  const [asignature, setAsignature] = useState(null);
  const [hourIntensity, setHourIntensity] = useState(null);

  const [school, setSchool] = useState(null);
  const [schoolList, setSchoolList] = useState(null);
  const [schoolYearList, setSchoolYearList] = useState(null);
  const [schoolYear, setSchoolYear] = useState(null);

  const methods = useForm({
    mode: 'all',
    reValidateMode: 'onChange',
  });

  let [params] = useSearchParams();
  const courseId = params.get('courseId');
  let campusId: any = null;

  const { handleSubmit, control, register, reset, setValue, formState, trigger } = methods;

  useEffect(() => {
    cleanForm();
    props.dataCourse(courseId).then((data: any) => {
      campusId = data?.data?.campus?.id;
      getDropdowns();
    });
    if (props?.data?.id) {
      setHourIntensity(props?.data?.hourlyIntensity);
      if (props?.data?.campus !== undefined && props?.data?.campus != null) {
        setCampus({
          key: props?.data?.campus?.id,
          label: props?.data?.campus?.name,
          value: props?.data?.campus?.id,
        });
      }
      if (
        props?.data?.academicAsignature !== undefined &&
        props?.data?.academicAsignature != null
      ) {
        setAsignature({
          key: props?.data?.academicAsignature?.id,
          label: props?.data?.academicAsignature?.name,
          value: props?.data?.academicAsignature?.id,
          maxHourlyIntensity: props?.data?.gradeAssignment?.maxHourlyIntensity,
          minHourlyIntensity: props?.data?.gradeAssignment?.minHourlyIntensity
        });
      }
      if (props?.data?.course !== undefined && props?.data?.course != null) {
        setCourse({
          key: props?.data?.course?.id,
          label: props?.data?.course?.name,
          value: props?.data?.course?.id,
        });
      }
      if (props?.data?.teacher !== undefined && props?.data?.teacher != null) {
        setTeacher({
          key: props?.data?.teacher?.id,
          label: `${props?.data?.teacher?.user.name} ${props?.data?.teacher?.user.lastName}`,
          value: props?.data?.teacher?.id,
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
      register('academicAsignatureId', {
        required: true,
        value: props?.data?.id ? props?.data?.academicAsignatureId : '',
      });
      register('courseId', {
        required: true,
        value: props?.data?.id ? props?.data?.courseId : '',
      });
      register('campusId', {
        required: false,
        value: props?.data?.id ? props?.data?.campusId : '',
      });
      register('teacherId', {
        required: true,
        value: props?.data?.id ? props?.data?.teacherId : '',
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
    setCourse(null);
    setAsignature(null);
    setCampus(null);
    setHourIntensity(null);
    setTeacher(null);
    if (props?.loginReducer?.campusId && !props?.data?.id) {
      // set value when register is new and sesion contains value
      register('campusId', {
        required: true,
        value: props?.loginReducer?.campusId,
      });
    }
    if (courseId) {
      // set value when register is new and sesion contains value
      register('courseId', {
        required: true,
        value: courseId,
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
    props.getDropdownsAcademicAsignatureCourse(props?.loginReducer?.schoolId, campusId, courseId, props?.loginReducer?.schoolYear).then((data: any) => {
      setCampusList(
        data.dataCampus.edges.map((c: any) => {
          return { label: c.node.name, value: c.node.id, key: c.node.id };
        }),
      );
      setAsignaturesList(
        data.dataAsignatures.edges.map((c: any) => {
          return { label: c?.node?.academicAsignature?.name, value: c?.node?.academicAsignature?.id, key: c?.node?.academicAsignature?.id, key2: c?.node?.id, maxHourlyIntensity: c?.node?.maxHourlyIntensity, minHourlyIntensity: c?.node?.minHourlyIntensity };
        }),
      );
      setGradesList(
        data.dataGrades.edges.map((c: any) => {
          return { label: c.node.name, value: c.node.id, key: c.node.id };
        }),
      );
      setTeachersList(
        data.dataTeachers.edges.map((c: any) => {
          return { label: `${c.node.user.name} ${c.node.user.lastName}`, value: c.node.id, key: c.node.id };
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

  const { ref: hourlyIntensityRef, ...hourlyIntensityRest } = register('hourlyIntensity', {
    required: true,
    value: props?.data?.id ? props?.data?.hourlyIntensity : '',
  });

  // const { ref: weightRef, ...weightRest } = register('weight', {
  //   required: true,
  //   value: props?.data?.id ? props?.data?.weight : '',
  // });

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
                <LabelCustom id="menu.asignature" required={true} />
                <Select
                  isClearable
                  placeholder={<IntlMessages id="forms.select" />}
                  {...register('academicAsignatureId', { required: true })}
                  className="react-select"
                  classNamePrefix="react-select"
                  options={asignaturesList}
                  value={asignature}
                  onChange={(selectedOption) => {
                    setValue('gradeAssignmentId', selectedOption?.key2);
                    setValue('academicAsignatureId', selectedOption?.key);
                    setValue('hourlyIntensity', selectedOption?.minHourlyIntensity);
                    setHourIntensity(selectedOption?.minHourlyIntensity);
                    setAsignature(selectedOption);
                    trigger("gradeAssignmentId");
                    trigger("academicAsignatureId");
                  }}
                />
                <RequiredMessagesCustom formState={formState} register={"academicAsignatureId"} />
              </FormGroupCustom>
              <FormGroupCustom>
                <LabelCustom id="forms.hourlyIntensity" required={true} />
                <Input
                  type='range'
                  disabled={!asignature}
                  min={asignature?.minHourlyIntensity}
                  max={asignature?.maxHourlyIntensity}
                  {...hourlyIntensityRest}
                  innerRef={hourlyIntensityRef}
                  className="form-control"
                  onChange={(e) => {
                    setHourIntensity(e.target.value);
                    setValue('hourlyIntensity', e.target.value);
                    trigger("hourlyIntensity");
                  }}
                />
                <div className='d-flex justify-content-between'>
                  <span>{asignature?.minHourlyIntensity}</span>
                  <span className='font-bold'>Valor: {hourIntensity}</span>
                  <span>{asignature?.maxHourlyIntensity}</span>
                </div>
                <RequiredMessagesCustom formState={formState} register={"hourlyIntensity"} />
              </FormGroupCustom>
              <FormGroupCustom>
                <LabelCustom id="menu.teacher" required={true} />
                <Select
                  isClearable
                  placeholder={<IntlMessages id="forms.select" />}
                  {...register('teacherId', { required: true })}
                  className="react-select"
                  classNamePrefix="react-select"
                  options={teachersList}
                  value={teacher}
                  onChange={(selectedOption) => {
                    setValue('teacherId', selectedOption?.key);
                    setTeacher(selectedOption);
                    trigger("teacherId");
                  }}
                />
                <RequiredMessagesCustom formState={formState} register={"teacherId"} />
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

const mapDispatchToProps = {
  ...academicIndicatorActions,
  ...courseActions
};

const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

export default connect(mapStateToProps, mapDispatchToProps)(AcademicAsignatureCourseBasicCreateEdit);
