import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import Select from 'react-select';
import { Input, Label, ModalBody, ModalFooter } from 'reactstrap';

import IntlMessages from '../../../../helpers/IntlMessages';
import * as asignatureActions from '../../../../stores/actions/Academic/AsignatureActions';
import * as gradeActions from '../../../../stores/actions/Academic/GradeActions';
import * as standardActions from '../../../../stores/actions/Academic/StandardActions';
import * as standardGeneralActions from '../../../../stores/actions/GeneralAcademic/StandardActions';
import { Colxx } from '../../../common/CustomBootstrap';
import AddNewModal from '../../../common/Data/AddNewModal';
import CreateEditAuditInformation from '../../../common/Data/CreateEditAuditInformation';
import FormGroupCustom from '../../../common/Data/FormGroupCustom';
import LabelCustom from '../../../common/Data/LabelCustom';
import RequiredMessagesCustom from '../../../common/Data/RequiredMessagesCustom';
import { Loader } from '../../../common/Loader';

const StandardCreateEdit = (props: any) => {
  const [loading, setLoading] = useState(true);
  const [asignaturesList, setAsignaturesList] = useState(null);
  const [gradesList, setGradesList] = useState(null);
  const [standardList, setStandardsList] = useState([]);
  const [schoolList, setSchoolList] = useState(null);
  const [cycle, setCycle] = useState(null);
  const [asignature, setAsignature] = useState(null);
  const [standard, setStandard] = useState(null);
  const [school, setSchool] = useState(null);

  const methods = useForm({
    mode: 'all',
    reValidateMode: 'onChange',
  });

  let [params] = useSearchParams();
  const asignatureId = params.get('asignatureId');
  const gradeId = params.get('gradeId');

  const { handleSubmit, control, register, reset, setValue, formState, trigger } = methods;

  useEffect(() => {
    cleanForm();
    getDropdowns();
    if (props?.data?.id) {
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
      if (
        props?.data?.academicGrade !== undefined &&
        props?.data?.academicGrade != null
      ) {
        setCycle({
          key: props?.data?.academicGrade?.id,
          label: props?.data?.academicGrade?.name,
          value: props?.data?.academicGrade?.id,
        });
      }
      if (
        props?.data?.generalAcademicStandard !== undefined &&
        props?.data?.generalAcademicStandard != null
      ) {
        setStandard({
          key: props?.data?.generalAcademicStandard?.id,
          label: props?.data?.generalAcademicStandard?.standard,
          value: props?.data?.generalAcademicStandard?.id,
        });
      }
      if (props?.data?.school !== undefined && props?.data?.school != null) {
        setSchool({
          key: props?.data?.school?.id,
          label: props?.data?.school?.name,
          value: props?.data?.school?.id,
        });
      }
      register('schoolId', {
        required: true,
        value: props?.data?.id ? props?.data?.schoolId : '',
      });
      register('academicGradeId', {
        required: true,
        value: props?.data?.id ? props?.data?.academicGradeId : '',
      });
      register('academicAsignatureId', {
        required: true,
        value: props?.data?.id ? props?.data?.academicAsignatureId : '',
      });
      register('generalAcademicStandardId', {
        required: false,
        value: props?.data?.id ? props?.data?.generalAcademicStandardId : '',
      });
    }
    props.dataGrade(gradeId).then((resp: any) => {
      props.dataAsignature(asignatureId).then((resp2: any) => {
        getStandards(resp?.data?.generalAcademicCycleId, resp2?.data?.generalAcademicAsignatureId);
      });
    });
    setLoading(false);
  }, [props?.data]);

  const cleanForm = async () => {
    reset();
    setCycle(null);
    setStandard(null);
    setAsignature(null);
    setSchool(null);
    if (props?.loginReducer?.schoolId && !props?.data?.id) {
      // set value when register is new and sesion contains value
      register('schoolId', {
        required: true,
        value: props?.loginReducer?.schoolId,
      });
    }
    if (gradeId) {
      // set value when register is new and sesion contains value
      register('academicGradeId', {
        required: true,
        value: gradeId,
      });
    }
    if (asignatureId) {
      // set value when register is new and sesion contains value
      register('academicAsignatureId', {
        required: true,
        value: asignatureId,
      });
    }
  };

  const getDropdowns = async () => {
    props.getDropdownsAcademicStandard(props?.loginReducer?.schoolId).then((data: any) => {
      setSchoolList(
        data.dataSchools.edges.map((c: any) => {
          return { label: c.node.name, value: c.node.id, key: c.node.id };
        }),
      );
      setAsignaturesList(
        data.dataAsignatures.edges.map((c: any) => {
          return { label: c.node.name, value: c.node.id, key: c.node.id, idGeneralAcademicAsignature: c.node.generalAcademicAsignatureId };
        }),
      );
      setGradesList(
        data.dataGrades.edges.map((c: any) => {
          return { label: c.node.name, value: c.node.id, key: c.node.id, idGeneralAcademicCycle: c.node.generalAcademicCycleId };
        }),
      );
    });
  };

  const getStandards = async (generalAcademicCycleId: any, generalAcademicAsignatureId: any) => {
    if (generalAcademicCycleId && generalAcademicAsignatureId) {
      props.getListAllGeneralStandard(generalAcademicCycleId, generalAcademicAsignatureId).then((data: any) => {
        setStandardsList(
          data.map((c: any) => {
            return { label: c.node.standard, value: c.node.id, key: c.node.id };
          }),
        );
      });
    }
  };

  const { ref: standardRef, ...standardRest } = register('standard', {
    required: true,
    value: props?.data?.id ? props?.data?.standard : '',
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
              {standardList && standardList?.length > 0 ?
                <FormGroupCustom >
                  <LabelCustom id="forms.nationalStandard" required={false} />
                  <Select
                    isClearable
                    placeholder={<IntlMessages id="forms.select" />}
                    {...register('generalAcademicStandardId', { required: false })}
                    className="react-select"
                    classNamePrefix="react-select"
                    options={standardList}
                    value={standard}
                    isDisabled={standardList?.length == 0}
                    onChange={(selectedOption) => {
                      setValue('generalAcademicStandardId', selectedOption?.key);
                      setStandard(selectedOption);
                      setValue('standard', selectedOption?.label);
                      trigger("standard");
                    }}
                  />
                </FormGroupCustom>
                :
                <></>}
              <FormGroupCustom>
                <LabelCustom id="forms.standard2" required={true} />
                <Input type='textarea' rows="6" {...standardRest} innerRef={standardRef} className="form-control" />
                <RequiredMessagesCustom formState={formState} register={"standard"} />
              </FormGroupCustom>
              {!props?.loginReducer?.schoolId ? (
                <FormGroupCustom>
                  <LabelCustom id="menu.school" required={true} />
                  <Select
                    isClearable
                    placeholder={<IntlMessages id="forms.select" />}
                    {...register('schoolId', { required: true })}
                    className="react-select"
                    classNamePrefix="react-select"
                    options={schoolList}
                    value={school}
                    onChange={(selectedOption) => {
                      setValue('schoolId', selectedOption?.key);
                      setSchool(selectedOption);
                      trigger("schoolId");
                    }}
                  />
                  <RequiredMessagesCustom formState={formState} register={"schoolId"} />
                </FormGroupCustom>
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

const mapDispatchToProps = { ...standardActions, ...standardGeneralActions, ...gradeActions, ...asignatureActions };

const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

export default connect(mapStateToProps, mapDispatchToProps)(StandardCreateEdit);
