import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Loader } from '../../../common/Loader';
import { connect } from 'react-redux';
import Select from 'react-select';
import { Input, Label, ModalBody, ModalFooter } from 'reactstrap';
import IntlMessages from '../../../../helpers/IntlMessages';
import * as standardActions from '../../../../stores/actions/GeneralAcademic/StandardActions';
import { Colxx } from '../../../common/CustomBootstrap';
import AddNewModal from '../../../common/Data/AddNewModal';
import CreateEditAuditInformation from '../../../common/Data/CreateEditAuditInformation';

const StandardCreateEdit = (props: any) => {
  const [loading, setLoading] = useState(true);
  const [asignaturesList, setAsignaturesList] = useState(null);
  const [cyclesList, setCyclesList] = useState(null);
  const [cycle, setCycle] = useState(null);
  const [asignature, setAsignature] = useState(null);

  const methods = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const { handleSubmit, control, register, reset, setValue, getValues } = methods;

  useEffect(() => {
    cleanForm();
    getDropdowns();
    if (props?.data?.id) {
      if (
        props?.data?.generalAcademicAsignature !== undefined &&
        props?.data?.generalAcademicAsignature != null
      ) {
        setAsignature({
          key: props?.data?.generalAcademicAsignature?.id,
          label: props?.data?.generalAcademicAsignature?.name,
          value: props?.data?.generalAcademicAsignature?.id,
        });
      }
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
    }
    setLoading(false);
  }, [props?.data]);

  const cleanForm = async () => {
    reset();
    setCycle(null);
    setAsignature(null);
  };

  const getDropdowns = async () => {
    props.getDropdownsGeneralAcademicStandard().then((data: any) => {
      setAsignaturesList(
        data.dataAsignatures.edges.map((c: any) => {
          return { label: c.node.name, value: c.node.id, key: c.node.id };
        }),
      );
      setCyclesList(
        data.dataCycles.edges.map((c: any) => {
          return { label: c.node.name, value: c.node.id, key: c.node.id };
        }),
      );
    });
  };

  const { ref: standardRef, ...standardRest } = register('standard', {
    required: true,
    value: props?.data?.id ? props?.data?.standard : '',
  });
  const { ref: typeRef, ...typeRest } = register('type', {
    required: true,
    value: props?.data?.id ? props?.data?.type : '',
  });
  const { ref: subtypeRef, ...subtypeRest } = register('subtype', {
    required: true,
    value: props?.data?.id ? props?.data?.subtype : '',
  });
  register('generalAcademicAsignatureId', {
    required: true,
    value: props?.data?.id ? props?.data?.generalAcademicAsignatureId : '',
  });
  register('generalAcademicCycleId', {
    required: true,
    value: props?.data?.id ? props?.data?.generalAcademicCycleId : '',
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
                  <IntlMessages id="forms.standard" />
                </Label>
                <Input {...standardRest} innerRef={standardRef} className="form-control" />
              </div>
              <div className="form-group">
                <Label>
                  <IntlMessages id="forms.type" />
                </Label>
                <Input {...typeRest} innerRef={typeRef} className="form-control" />
              </div>
              <div className="form-group">
                <Label>
                  <IntlMessages id="forms.subtype" />
                </Label>
                <Input {...subtypeRest} innerRef={subtypeRef} className="form-control" />
              </div>
              <div className="form-group">
                <Label>
                  <IntlMessages id="menu.asignature" />
                </Label>
                <Select
                  isClearable
                  placeholder={<IntlMessages id="forms.select" />}
                  {...register('generalAcademicAsignatureId', { required: true })}
                  className="react-select"
                  classNamePrefix="react-select"
                  options={asignaturesList}
                  value={asignature}
                  onChange={(selectedOption) => {
                    setValue('generalAcademicAsignatureId', selectedOption?.key);
                    setAsignature(selectedOption);
                  }}
                />
              </div>
              <div className="form-group">
                <Label>
                  <IntlMessages id="menu.cycleAcademic" />
                </Label>
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
                  }}
                />
              </div>
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

const mapDispatchToProps = { ...standardActions };

const mapStateToProps = () => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(StandardCreateEdit);
