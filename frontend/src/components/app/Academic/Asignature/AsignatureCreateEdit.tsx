import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import Select from 'react-select';
import { Input, Label, ModalBody, ModalFooter } from 'reactstrap';

import IntlMessages from '../../../../helpers/IntlMessages';
import * as asignatureActions from '../../../../stores/actions/Academic/AsignatureActions';
import { Colxx } from '../../../common/CustomBootstrap';
import AddNewModal from '../../../common/Data/AddNewModal';
import CreateEditAuditInformation from '../../../common/Data/CreateEditAuditInformation';
import FormGroupCustom from '../../../common/Data/FormGroupCustom';
import LabelCustom from '../../../common/Data/LabelCustom';
import RequiredMessagesCustom from '../../../common/Data/RequiredMessagesCustom';
import { Loader } from '../../../common/Loader';

const AsignatureCreateEdit = (props: any) => {
  const [loading, setLoading] = useState(true);
  const [areasList, setAreasList] = useState(null);
  const [schoolList, setSchoolList] = useState(null);
  const [generalAcademicAsignaturesList, setGeneralAcademicAsignaturesList] = useState(null);
  const [area, setArea] = useState(null);
  const [school, setSchool] = useState(null);
  const [generalAcademicAsignature, setGeneralAcademicAsignature] = useState(null);
  const [schoolYearList, setSchoolYearList] = useState(null);
  const [schoolYear, setSchoolYear] = useState(null);

  const methods = useForm({
    mode: 'all',
    reValidateMode: 'onChange',
  });

  let [params] = useSearchParams();
  const areaId = params.get('id');
  const areaGeneralId = params.get('areaGeneralId');

  const { handleSubmit, control, register, reset, setValue, formState, trigger } = methods;

  useEffect(() => {
    cleanForm();
    getDropdowns();
    if (props?.data?.id) {
      if (props?.data?.academicArea !== undefined && props?.data?.academicArea != null) {
        setArea({
          key: props?.data?.academicArea?.id,
          label: props?.data?.academicArea?.name,
          value: props?.data?.academicArea?.id,
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
        props?.data?.generalAcademicAsignature !== undefined &&
        props?.data?.generalAcademicAsignature != null
      ) {
        setGeneralAcademicAsignature({
          key: props?.data?.generalAcademicAsignature?.id,
          label: props?.data?.generalAcademicAsignature?.name,
          value: props?.data?.generalAcademicAsignature?.id,
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
      register('academicAreaId', {
        required: true,
        value: props?.data?.id ? props?.data?.academicAreaId : areaId,
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
    setArea(null);
    setSchool(null);
    setGeneralAcademicAsignature(null);
    if (props?.loginReducer?.schoolId && !props?.data?.id) {
      // set value when register is new and sesion contains value
      register('schoolId', {
        required: true,
        value: props?.loginReducer?.schoolId,
      });
    }
    if (areaId) {
      // set value when register is new and sesion contains value
      register('academicAreaId', {
        required: true,
        value: areaId,
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
    props.getDropdownsAcademicAsignature(props?.loginReducer?.schoolId, areaGeneralId).then((data: any) => {
      setAreasList(
        data.dataAreas.edges.map((c: any) => {
          return { label: c.node.name, value: c.node.id, key: c.node.id };
        }),
      );
      setGeneralAcademicAsignaturesList(
        data.dataGeneralAsignatures.edges.map((c: any) => {
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
  const { ref: orderRef, ...orderRest } = register('order', {
    required: true,
    value: props?.data?.id ? props?.data?.order : '',
  });
  const { ref: abbreviationRef, ...abbreviationRest } = register('abbreviation', {
    required: true,
    value: props?.data?.id ? props?.data?.abbreviation : '',
  });
  // const { ref: codeRef, ...codeRest } = register('code', {
  //   required: false,
  //   value: props?.data?.id ? props?.data?.code : '',
  // });
  // const { ref: maxWeightRef, ...maxWeightRest } = register('maxWeight', {
  //   required: false,
  //   value: props?.data?.id ? props?.data?.maxWeight : '',
  // });
  // const { ref: minWeightRef, ...minWeightRest } = register('minWeight', {
  //   required: false,
  //   value: props?.data?.id ? props?.data?.minWeight : '',
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
                <LabelCustom id="forms.name" required={true} />
                <Input {...nameRest} innerRef={nameRef} className="form-control" />
                <RequiredMessagesCustom formState={formState} register={"name"} />
              </FormGroupCustom>
              <FormGroupCustom>
                <LabelCustom id="forms.sorting" required={true} />
                <Input {...orderRest} innerRef={orderRef} className="form-control" type="number" step="1" min={1} />
                <RequiredMessagesCustom formState={formState} register={"order"} />
              </FormGroupCustom>
              <FormGroupCustom>
                <LabelCustom id="forms.abbreviation" required={true} />
                <Input {...abbreviationRest} innerRef={abbreviationRef} className="form-control" />
                <RequiredMessagesCustom formState={formState} register={"abbreviation"} />
              </FormGroupCustom>
              {/* <FormGroupCustom>
                <LabelCustom id="forms.code" required={false} />
                <Input {...codeRest} innerRef={codeRef} className="form-control" />
              </FormGroupCustom>
              <FormGroupCustom>
                <LabelCustom id="forms.maxWeight" required={false} />
                <Input {...maxWeightRest} innerRef={maxWeightRef} className="form-control" />
              </FormGroupCustom>
              <FormGroupCustom>
                <LabelCustom id="forms.minWeight" required={false} />
                <Input {...minWeightRest} innerRef={minWeightRef} className="form-control" />
              </FormGroupCustom> */}
              {generalAcademicAsignaturesList?.length > 0 ?
                <FormGroupCustom>
                  <LabelCustom id="forms.nationalAsignature" required={false} />
                  <Select
                    isClearable
                    placeholder={<IntlMessages id="forms.select" />}
                    {...register('generalAcademicAsignatureId', { required: false })}
                    className="react-select"
                    classNamePrefix="react-select"
                    options={generalAcademicAsignaturesList}
                    value={generalAcademicAsignature}
                    onChange={(selectedOption) => {
                      setValue('generalAcademicAsignatureId', selectedOption?.key);
                      setGeneralAcademicAsignature(selectedOption);
                      trigger("generalAcademicAsignatureId");
                    }}
                  />
                </FormGroupCustom>
                :
                <></>}
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

const mapDispatchToProps = { ...asignatureActions };

const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

export default connect(mapStateToProps, mapDispatchToProps)(AsignatureCreateEdit);
