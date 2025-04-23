import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import Select from 'react-select';
import { Input, Label, ModalBody, ModalFooter } from 'reactstrap';

import IntlMessages from '../../../helpers/IntlMessages';
import * as modalityActions from '../../../stores/actions/StudentObserverAnnotationActions';
import { Colxx } from '../../common/CustomBootstrap';
import AddNewModal from '../../common/Data/AddNewModal';
import CreateEditAuditInformation from '../../common/Data/CreateEditAuditInformation';
import FormGroupCustom from '../../common/Data/FormGroupCustom';
import LabelCustom from '../../common/Data/LabelCustom';
import RequiredMessagesCustom from '../../common/Data/RequiredMessagesCustom';
import { Loader } from '../../common/Loader';

const StudentObserverAnnotationCreateEdit = (props: any) => {
  const [loading, setLoading] = useState(true);
  const [observerAnnotationTypesList, setObserverAnnotacionTypesList] = useState(null);
  const [observerAnnotationType, setObserverAnnotacionType] = useState(null);
  const [academicPeriodList, setAcademicPeriodList] = useState(null);
  const [academicPeriod, setAcademicPeriod] = useState(null);

  const methods = useForm({
    mode: 'all',
    reValidateMode: 'onChange',
  });

  const { handleSubmit, control, register, reset, setValue, formState, trigger } = methods;

  let [params] = useSearchParams();
  const courseId = params.get('courseId');
  const gradeId = params.get('gradeId');
  const studentId = params.get('studentId');

  useEffect(() => {
    cleanForm();
    getDropdowns();
    if (props?.data?.id) {
      // if (props?.data?.school !== undefined && props?.data?.school != null) {
      //   setSchool({
      //     key: props?.data?.school?.id,
      //     label: props?.data?.school?.name,
      //     value: props?.data?.school?.id,
      //   });
      // }
      // register('schoolId', {
      //   required: true,
      //   value: props?.data?.id ? props?.data?.schoolId : '',
      // });
      if (props?.data?.academicPeriod !== undefined && props?.data?.academicPeriod != null) {
        setAcademicPeriod({
          key: props?.data?.academicPeriod?.id,
          label: props?.data?.academicPeriod?.name,
          value: props?.data?.academicPeriod?.id,
        });
      }
      if (props?.data?.observerAnnotationType !== undefined && props?.data?.observerAnnotationType != null) {
        setObserverAnnotacionType({
          key: props?.data?.observerAnnotationType?.id,
          label: props?.data?.observerAnnotationType?.name,
          value: props?.data?.observerAnnotationType?.id,
        });
      }
    }
    setLoading(false);
  }, [props?.data]);

  const cleanForm = async () => {
    reset();
    setAcademicPeriod(null);
    setObserverAnnotacionType(null);
  };

  const getDropdowns = async () => {
    props.getDropdownsStudentObserverAnnotation(props?.loginReducer?.schoolId, props?.loginReducer?.schoolYear,).then((data: any) => {
      setObserverAnnotacionTypesList(
        data.dataObserverAnnotationType.edges.map((c: any) => {
          return { label: c.node.name, value: c.node.id, key: c.node.id };
        }),
      );
      setAcademicPeriodList(
        data.dataAcademicPeriods.edges.map((c: any) => {
          return {
            label: c.node.name,
            value: c.node.id,
            key: c.node.id,
          };
        }),
      );
    });
  };

  const { ref: observationRef, ...observationRest } = register('observation', {
    required: true,
    value: props?.data?.id ? props?.data?.observation : '',
  });
  const { ref: commitmentRef, ...commitmentRest } = register('commitment', {
    required: false,
    value: props?.data?.id ? props?.data?.commitment : '',
  });

  register('studentId', {
    required: true,
    value: props?.data?.id ? props?.data?.studentId : studentId,
  });

  register('courseId', {
    required: true,
    value: props?.data?.id ? props?.data?.courseId : courseId,
  });

  register('academicPeriodId', {
    required: true,
    value: props?.data?.id ? props?.data?.academicPeriodId : '',
  });

  register('observerAnnotationTypeId', {
    required: true,
    value: props?.data?.id ? props?.data?.observerAnnotationTypeId : '',
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
              <FormGroupCustom>
                <LabelCustom id="forms.observerAnnotationType" required={true} />
                <RequiredMessagesCustom formState={formState} register={"observerAnnotationType"} />
                <Select
                  isClearable
                  placeholder={<IntlMessages id="forms.select" />}
                  {...register('observerAnnotationTypeId', { required: true })}
                  className="react-select"
                  classNamePrefix="react-select"
                  options={observerAnnotationTypesList}
                  value={observerAnnotationType}
                  onChange={(selectedOption) => {
                    setValue('observerAnnotationTypeId', selectedOption?.key);
                    setObserverAnnotacionType(selectedOption);
                  }}
                />
              </FormGroupCustom>
              <FormGroupCustom>
                <LabelCustom id="forms.periodAcademic" required={true} />
                <RequiredMessagesCustom formState={formState} register={"observation"} />
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
              </FormGroupCustom>
              <FormGroupCustom>
                <LabelCustom id="forms.observation" required={true} />
                <Input {...observationRest} innerRef={observationRef} className="form-control" type="textarea" rows="5" />
                <RequiredMessagesCustom formState={formState} register={"observation"} />
              </FormGroupCustom>
              <FormGroupCustom>
                <LabelCustom id="forms.commitment" required={false} />
                <Input {...commitmentRest} innerRef={commitmentRef} className="form-control" type="textarea" rows="5" />
              </FormGroupCustom>
              {/* {!props?.loginReducer?.schoolId ? (
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
                    }}
                  />
                </FormGroupCustom>
              ) : (
                ''
              )} */}
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

const mapDispatchToProps = { ...modalityActions };

const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

export default connect(mapStateToProps, mapDispatchToProps)(StudentObserverAnnotationCreateEdit);
