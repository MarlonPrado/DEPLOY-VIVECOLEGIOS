import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import Select from 'react-select';
import { Input, Label, ModalBody, ModalFooter } from 'reactstrap';

import IntlMessages from '../../../helpers/IntlMessages';
import * as academicIndicatorActions from '../../../stores/actions/AcademicAsignatureCourseActions';
import { Colxx } from '../../common/CustomBootstrap';
import AddNewModal from '../../common/Data/AddNewModal';
import CreateEditAuditInformation from '../../common/Data/CreateEditAuditInformation';
import { Loader } from '../../common/Loader';

const AcademicAsignatureCourseCreateEdit = (props: any) => {
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
  const [grade, setGrade] = useState(null);

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
      if (
        props?.data?.academicAsignature !== undefined &&
        props?.data?.academicAsignature != null
      ) {
        setAsignature({
          key: props?.data?.academicAsignature?.id,
          label: props?.data?.academicAsignature?.name,
          value: props?.data?.academicAsignature?.id,
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
      register('schoolId', {
        required: true,
        value: props?.data?.id ? props?.data?.schoolId : '',
      })
      register('schoolYearId', {
        required: true,
        value: props?.data?.id ? props?.data?.schoolYearId : '',
      });
    }
    setLoading(false);
  }, [props?.data]);

  const cleanForm = async () => {
    reset();
    setCourse(null);
    setAsignature(null);
    setCampus(null);
    setTeacher(null);
    if (props?.loginReducer?.campusId && !props?.data?.id) {
      // set value when register is new and sesion contains value
      register('campusId', {
        required: true,
        value: props?.loginReducer?.campusId,
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
    props.getDropdownsAcademicAsignatureCourse(props?.loginReducer?.schoolId, props?.loginReducer?.campusId).then((data: any) => {
      setCampusList(
        data.dataCampus.edges.map((c: any) => {
          return { label: c.node.name, value: c.node.id, key: c.node.id };
        }),
      );
      setAsignaturesList(
        data.dataAsignatures.edges.map((c: any) => {
          return { label: c.node.name, value: c.node.id, key: c.node.id };
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
  };

  const getCourses = async (academicGradeId: any) => {
    props.getCoursesOfGrade(academicGradeId, props?.loginReducer?.campusId).then((data: any) => {
      setCoursesList(
        data.dataCourses.edges.map((c: any) => {
          return { label: c.node.name, value: c.node.id, key: c.node.id };
        }),
      );
    });
  };

  const { ref: weightRef, ...weightRest } = register('weight', {
    required: true,
    value: props?.data?.id ? props?.data?.weight : '',
  });
  register('academicAsignatureId', {
    required: true,
    value: props?.data?.id ? props?.data?.academicAsignatureId : '',
  });
  register('courseId', {
    required: true,
    value: props?.data?.id ? props?.data?.courseId : '',
  });
  register('campusId', {
    required: true,
    value: props?.data?.id ? props?.data?.campusId : '',
  });
  register('teacherId', {
    required: true,
    value: props?.data?.id ? props?.data?.teacherId : '',
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
          >
            <ModalBody>
              <div className="form-group">
                <Label>
                  <IntlMessages id="forms.weight" />
                </Label>
                <Input
                  {...weightRest}
                  innerRef={weightRef}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <Label>
                  <IntlMessages id="menu.asignature" />
                </Label>
                <Select
                  isClearable
                  placeholder={<IntlMessages id="forms.select" />}
                  {...register('academicAsignatureId', { required: true })}
                  className="react-select"
                  classNamePrefix="react-select"
                  options={asignaturesList}
                  value={asignature}
                  onChange={(selectedOption) => {
                    setValue('academicAsignatureId', selectedOption?.key);
                    setAsignature(selectedOption);
                  }}
                />
              </div>
              <div className="form-group">
                <Label>
                  <IntlMessages id="menu.grade" />
                </Label>
                <Select
                  isClearable
                  placeholder={<IntlMessages id="forms.select" />}
                  className="react-select"
                  classNamePrefix="react-select"
                  options={gradesList}
                  value={grade}
                  onChange={(selectedOption) => {
                    setGrade(selectedOption);
                    getCourses(selectedOption?.key);
                  }}
                />
              </div>
              <div className="form-group">
                <Label>
                  <IntlMessages id="menu.course" />
                </Label>
                <Select
                  isClearable
                  placeholder={<IntlMessages id="forms.select" />}
                  {...register('courseId', { required: true })}
                  className="react-select"
                  classNamePrefix="react-select"
                  options={coursesList}
                  value={course}
                  onChange={(selectedOption) => {
                    setValue('courseId', selectedOption?.key);
                    setCourse(selectedOption);
                  }}
                />
              </div>
              <div className="form-group">
                <Label>
                  <IntlMessages id="menu.teacher" />
                </Label>
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
                  }}
                />
              </div>
              {!props?.loginReducer?.schoolId ? (
                <div className="form-group">
                  <Label>
                    <IntlMessages id="menu.campus" />
                  </Label>
                  <Select
                    isClearable
                    placeholder={<IntlMessages id="forms.select" />}
                    {...register('schoolId', { required: true })}
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

const mapDispatchToProps = {
  ...academicIndicatorActions,
};

const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

export default connect(mapStateToProps, mapDispatchToProps)(AcademicAsignatureCourseCreateEdit);
