import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import Select from 'react-select';
import { Input, Label, ModalBody, ModalFooter } from 'reactstrap';

import IntlMessages from '../../../../helpers/IntlMessages';
import * as gradeActions from '../../../../stores/actions/Academic/GradeActions';
import { Colxx } from '../../../common/CustomBootstrap';
import AddNewModal from '../../../common/Data/AddNewModal';
import CreateEditAuditInformation from '../../../common/Data/CreateEditAuditInformation';
import FormGroupCustom from '../../../common/Data/FormGroupCustom';
import LabelCustom from '../../../common/Data/LabelCustom';
import RequiredMessagesCustom from '../../../common/Data/RequiredMessagesCustom';
import { Loader } from '../../../common/Loader';

const GradeCreateEdit = (props: any) => {
  const [loading, setLoading] = useState(true);
  const [cyclesList, setCyclesList] = useState(null);
  const [educationLevelsList, setEducationLevelsList] = useState(null);
  const [specialitiesList, setSpecialitiesList] = useState(null);
  const [generalAcademicGradesList, setGeneralAcademicGradesList] = useState(null);
  const [schoolYear, setSchoolYear] = useState(null);
  const [schoolYearList, setSchoolYearList] = useState(null);
  const [cycle, setCycle] = useState(null);
  const [school, setSchool] = useState(null);
  const [schoolList, setSchoolList] = useState(null);

  const [educationLevel, setEducationLevel] = useState(null);
  // const [speciality, setSpeciality] = useState(null);
  const [generalAcademicGrade, setGeneralAcademicGrade] = useState(null);

  const methods = useForm({
    mode: 'all',
    reValidateMode: 'onChange',
  });

  const { handleSubmit, control, register, reset, setValue, formState, trigger } = methods;

  useEffect(() => {
    cleanForm();
    getDropdowns();
    if (props?.data?.id) {
      if (
        props?.data?.generalAcademicCycle !== undefined &&
        props?.data?.generalAcademicCycle != null
      ) {
        setCycle({
          key: props?.data?.generalAcademicCycle?.id,
          label: props?.data?.generalAcademicCycle?.name,
          value: props?.data?.generalAcademicCycle?.id,
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
      if (props?.data?.educationLevel !== undefined && props?.data?.educationLevel != null) {
        setEducationLevel({
          key: props?.data?.educationLevel?.id,
          label: props?.data?.educationLevel?.name,
          value: props?.data?.educationLevel?.id,
        });
      }
      // if (props?.data?.specialty !== undefined && props?.data?.specialty != null) {
      //   setSpeciality({
      //     key: props?.data?.specialty?.id,
      //     label: props?.data?.specialty?.name,
      //     value: props?.data?.specialty?.id,
      //   });
      // }
      if (props?.data?.generalAcademicGrade !== undefined && props?.data?.generalAcademicGrade != null) {
        setGeneralAcademicGrade({
          key: props?.data?.generalAcademicGrade?.id,
          label: props?.data?.generalAcademicGrade?.name,
          value: props?.data?.generalAcademicGrade?.id,
        });
      }
      register('generalAcademicCycleId', {
        required: true,
        value: props?.data?.id ? props?.data?.generalAcademicCycleId : '',
      });
      register('schoolId', {
        required: true,
        value: props?.data?.id && props?.data?.schoolId ? props?.data?.schoolId : props?.loginReducer?.schoolId,
      });
      register('schoolYearId', {
        required: true,
        value: props?.data?.id && props?.data?.schoolYearId ? props?.data?.schoolYearId : props?.loginReducer?.schoolYear,
      });
      // register('specialtyId', {
      //   required: true,
      //   value: props?.data?.id ? props?.data?.specialtyId : '',
      // });
      register('educationLevelId', {
        required: true,
        value: props?.data?.id ? props?.data?.educationLevelId : '',
      });
      register('generalAcademicGradeId', {
        required: false,
        value: props?.data?.id ? props?.data?.generalAcademicGradeId : '',
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
    setCycle(null);
    setSchool(null);
    // setSpeciality(null);
    setGeneralAcademicGrade(null);
    setEducationLevel(null);
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
    props.getDropdownsAcademicGrade(props?.loginReducer?.schoolId, props?.loginReducer?.schoolYear).then((data: any) => {
      setCyclesList(
        data.dataCycles.edges.map((c: any) => {
          return { label: c.node.name, value: c.node.id, key: c.node.id };
        }),
      );
      setSpecialitiesList(
        data.dataSpecialities.edges.map((c: any) => {
          return { label: c.node.name, value: c.node.id, key: c.node.id };
        }),
      );
      setEducationLevelsList(
        data.dataEducationLevels.edges.map((c: any) => {
          return { label: c.node.name, value: c.node.id, key: c.node.id };
        }),
      );
      setGeneralAcademicGradesList(
        data.dataGeneralGrades.edges.map((c: any) => {
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
                <LabelCustom id="menu.cycleAcademic" required={true} />
                <Select
                  isClearable
                  placeholder={<IntlMessages id="forms.select" />}
                  {...register('generalAcademicCycleId', { required: true })}
                  className="react-select"
                  classNamePrefix="react-select"
                  options={cyclesList}
                  value={cycle}
                  onChange={(selectedOption) => {
                    setValue('generalAcademicCycleId', selectedOption?.key);
                    setCycle(selectedOption);
                    trigger("generalAcademicCycleId");
                  }}
                />
                <RequiredMessagesCustom formState={formState} register={"generalAcademicCycleId"} />
              </FormGroupCustom>
              <FormGroupCustom>
                <LabelCustom id="menu.educationLevel" required={true} />
                <Select
                  isClearable
                  placeholder={<IntlMessages id="forms.select" />}
                  {...register('educationLevelId', { required: true })}
                  className="react-select"
                  classNamePrefix="react-select"
                  options={educationLevelsList}
                  value={educationLevel}
                  onChange={(selectedOption) => {
                    setValue('educationLevelId', selectedOption?.key);
                    setEducationLevel(selectedOption);
                    trigger("educationLevelId");
                  }}
                />
                <RequiredMessagesCustom formState={formState} register={"educationLevelId"} />
              </FormGroupCustom>
              {/* <FormGroupCustom>
                <LabelCustom id="menu.speciality" required={true} />
                <Select
                  isClearable
                  placeholder={<IntlMessages id="forms.select" />}
                  {...register('specialtyId', { required: true })}
                  className="react-select"
                  classNamePrefix="react-select"
                  options={specialitiesList}
                  value={speciality}
                  onChange={(selectedOption) => {
                    setValue('specialtyId', selectedOption?.key);
                    setSpeciality(selectedOption);
                  }}
                />
                <RequiredMessagesCustom formState={formState} register={"specialtyId"} />
              </FormGroupCustom> */}
              <FormGroupCustom>
                <LabelCustom id="forms.nationalGrade" required={false} />
                <Select
                  isClearable
                  placeholder={<IntlMessages id="forms.select" />}
                  {...register('generalAcademicGradeId', { required: false })}
                  className="react-select"
                  classNamePrefix="react-select"
                  options={generalAcademicGradesList}
                  value={generalAcademicGrade}
                  onChange={(selectedOption) => {
                    setValue('generalAcademicGradeId', selectedOption?.key);
                    setGeneralAcademicGrade(selectedOption);
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

const mapDispatchToProps = { ...gradeActions };

const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

export default connect(mapStateToProps, mapDispatchToProps)(GradeCreateEdit);
