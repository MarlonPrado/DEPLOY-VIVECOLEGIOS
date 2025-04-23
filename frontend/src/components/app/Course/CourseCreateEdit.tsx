import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import Select from 'react-select';
import { Input, Label, ModalBody, ModalFooter } from 'reactstrap';
import IntlMessages from '../../../helpers/IntlMessages';
import * as academicDayActions from '../../../stores/actions/AcademicDayActions';
import * as courseActions from '../../../stores/actions/CourseActions';
import * as teacherActions from '../../../stores/actions/TeacherActions';
import { Colxx } from '../../common/CustomBootstrap';
import AddNewModal from '../../common/Data/AddNewModal';
import CreateEditAuditInformation from '../../common/Data/CreateEditAuditInformation';
import FormGroupCustom from '../../common/Data/FormGroupCustom';
import LabelCustom from '../../common/Data/LabelCustom';
import RequiredMessagesCustom from '../../common/Data/RequiredMessagesCustom';
import { Loader } from '../../common/Loader';

const CourseCreateEdit = (props: any) => {
  const [loading, setLoading] = useState(true);
  const [campusList, setCampusList] = useState(null);
  const [grade, setGrade] = useState(null);
  const [campus, setCampus] = useState(null);
  const [teacher, setTeacher] = useState(null);
  const [teachers, setTeachers] = useState(null);
  const [academicDay, setAcademicDay] = useState(null);
  const [academicDays, setAcademicDays] = useState(null);
  const [schoolList, setSchoolList] = useState(null);
  const [school, setSchool] = useState(null);
  const [schoolYear, setSchoolYear] = useState(null);
  const [schoolYearList, setSchoolYearList] = useState(null);

  let [params] = useSearchParams();
  const academicGradeId = params.get('academicGradeId');

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
        getTeacherAndDays(props?.data?.campus?.id);
      }
      if (props?.data?.academicGrade !== undefined && props?.data?.academicGrade != null) {
        setGrade({
          key: props?.data?.academicGrade?.id,
          label: props?.data?.academicGrade?.name,
          value: props?.data?.academicGrade?.id,
        });
      }
      if (props?.data?.teacher !== undefined && props?.data?.teacher != null) {
        setTeacher({
          key: props?.data?.teacher?.id,
          label: `${props?.data?.teacher?.user.name} ${props?.data?.teacher?.user.lastName}`,
          value: props?.data?.teacher?.id,
        });
      }
      if (props?.data?.academicDay !== undefined && props?.data?.academicDay != null) {
        setAcademicDay({
          key: props?.data?.academicDay?.id,
          label: props?.data?.academicDay?.name,
          value: props?.data?.academicDay?.id,
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
      register('schoolId', {
        required: true,
        value: props?.data?.id && props?.data?.schoolId ? props?.data?.schoolId : props?.loginReducer?.schoolId,
      });
      register('schoolYearId', {
        required: true,
        value: props?.data?.id && props?.data?.schoolYearId ? props?.data?.schoolYearId : props?.loginReducer?.schoolYear,
      });
      register('academicGradeId', {
        required: true,
        value: props?.data?.id ? props?.data?.academicGradeId : '',
      });
      register('campusId', {
        required: true,
        value: props?.data?.id ? props?.data?.campusId : '',
      });
      register('teacherId', {
        required: true,
        value: props?.data?.id ? props?.data?.teacherId : '',
      });
      register('academicDayId', {
        required: true,
        value: props?.data?.id ? props?.data?.academicDayId : '',
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
    setGrade(null);
    setTeacher(null);
    setAcademicDay(null);
    setCampus(null);
    if (props?.loginReducer?.campusId && !props?.data?.id) {
      // set value when register is new and sesion contains value
      register('campusId', {
        required: true,
        value: props?.loginReducer?.campusId,
      });
    }
    if (academicGradeId) {
      register('academicGradeId', {
        required: true,
        value: academicGradeId,
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

  const getDropdowns = async () => {
    props.getDropdownsCourse(props?.loginReducer?.schoolId).then((data: any) => {
      setCampusList(
        data.dataCampus.edges.map((c: any) => {
          return { label: c.node.name, value: c.node.id, key: c.node.id };
        }),
      );
    });
  };

  const getTeacherAndDays = async (campusId: string) => {
    setAcademicDay(null);
    setTeacher(null);
    if (campusId) {
      props.getListAllTeacherActives(campusId, props?.loginReducer?.schoolId, props?.loginReducer?.schoolYear).then((data: any) => {
        setTeachers(
          data.map((c: any) => {
            return {
              label: `${c?.node?.user.name} ${c?.node?.user.lastName}`,
              value: c.node.id,
              key: c.node.id,
            };
          }),
        );
      });
      props.getListAllAcademicDayActives(campusId, null, props?.loginReducer?.schoolYear).then((data: any) => {
        setAcademicDays(
          data.map((c: any) => {
            return { label: c.node.name, value: c.node.id, key: c.node.id };
          }),
        );
      });
    } else {
      setTeachers([]);
      setAcademicDays([]);
    }
  };

  const { ref: nameRef, ...nameRest } = register('name', {
    required: true,
    value: props?.data?.id ? props?.data?.name : '',
  });
  const { ref: orderRef, ...orderRest } = register('order', {
    required: false,
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
                <LabelCustom id="forms.sorting" required={false} />
                <Input {...orderRest} innerRef={orderRef} className="form-control" />
                <RequiredMessagesCustom formState={formState} register={"sorting"} />
              </FormGroupCustom>
              {!props?.loginReducer?.campusId ? (
                <FormGroupCustom>
                  <LabelCustom id="menu.campus" required={true} />
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
                      getTeacherAndDays(selectedOption?.key);
                      trigger("campusId");
                    }}
                  />
                  <RequiredMessagesCustom formState={formState} register={"campusId"} />
                </FormGroupCustom>
              ) : (
                ''
              )}
              <FormGroupCustom>
                <LabelCustom id="forms.headline" required={true} />
                <Select
                  isClearable
                  placeholder={<IntlMessages id="forms.select" />}
                  {...register('teacherId', { required: true })}
                  className="react-select"
                  classNamePrefix="react-select"
                  options={teachers}
                  value={teacher}
                  onChange={(selectedOption) => {
                    setValue('teacherId', selectedOption?.key);
                    setTeacher(selectedOption);
                    trigger("teacherId");
                  }}
                  isDisabled={teachers?.length === 0 || teachers === null}
                />
                <RequiredMessagesCustom formState={formState} register={"teacherId"} />
              </FormGroupCustom>
              <FormGroupCustom>
                <LabelCustom id="menu.academicDay" required={true} />
                <Select
                  isClearable
                  placeholder={<IntlMessages id="forms.select" />}
                  {...register('academicDayId', { required: true })}
                  className="react-select"
                  classNamePrefix="react-select"
                  options={academicDays}
                  value={academicDay}
                  onChange={(selectedOption) => {
                    setValue('academicDayId', selectedOption?.key);
                    setAcademicDay(selectedOption);
                    trigger("academicDayId");
                  }}
                  isDisabled={academicDays?.length === 0 || academicDays === null}
                />
                <RequiredMessagesCustom formState={formState} register={"academicDayId"} />
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
  ...courseActions,
  ...teacherActions,
  ...academicDayActions,
};

const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

export default connect(mapStateToProps, mapDispatchToProps)(CourseCreateEdit);
