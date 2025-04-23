import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Loader } from '../../../common/Loader';
import { connect } from 'react-redux';
import Select from 'react-select';
import { Input, Label, ModalBody, ModalFooter } from 'reactstrap';
import IntlMessages from '../../../../helpers/IntlMessages';
import * as asignatureActions from '../../../../stores/actions/GeneralAcademic/AsignatureActions';
import { Colxx } from '../../../common/CustomBootstrap';
import AddNewModal from '../../../common/Data/AddNewModal';
import CreateEditAuditInformation from '../../../common/Data/CreateEditAuditInformation';

const GeneralAsignatureCreateEdit = (props: any) => {
  const [loading, setLoading] = useState(true);
  const [areasList, setAreasList] = useState(null);

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
        props?.data?.generalAcademicArea !== undefined &&
        props?.data?.generalAcademicArea != null
      ) {
        setArea({
          key: props?.data?.generalAcademicArea?.id,
          label: props?.data?.generalAcademicArea?.name,
          value: props?.data?.generalAcademicArea?.id,
        });
      }
    }
    setLoading(false);
  }, [props?.data]);

  const cleanForm = async () => {
    reset();
    setArea(null);
  };

  const getDropdowns = async () => {
    props.getDropdownsGeneralAsignature().then((data: any) => {
      setAreasList(
        data.dataGeneralAreas.edges.map((c: any) => {
          return { label: c.node.name, value: c.node.id, key: c.node.id };
        }),
      );
    });
  };

  const { ref: nameRef, ...nameRest } = register('name', {
    required: true,
    value: props?.data?.id ? props?.data?.name : '',
  });
  register('generalAcademicAreaId', {
    required: true,
    value: props?.data?.id ? props?.data?.generalAcademicAreaId : '',
  });

  const auditInfo = {
    createdAt: props?.data?.id ? props?.data?.createdAt : null,
    updatedAt: props?.data?.id ? props?.data?.createdAt : null,
    createdByUser: props?.data?.id ? props?.data?.createdByUser : null,
    updatedByUser: props?.data?.id ? props?.data?.updatedByUser : null,
    version: props?.data?.id ? props?.data?.version : null,
  };

  const data = {
    hasStandard:
      props?.data?.id ||
        props?.data?.hasStandard === methods.getValues('hasStandard')
        ? props?.data?.hasStandard
        : methods.getValues('hasStandard'),
    hasDba:
      props?.data?.id ||
        props?.data?.hasDba === methods.getValues('hasDba')
        ? props?.data?.hasDba
        : methods.getValues('hasDba'),
  }

  const [area, setArea] = useState(null);

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
                  <IntlMessages id="forms.name" />
                </Label>
                <Input {...nameRest} innerRef={nameRef} className="form-control" />
              </div>
              <div className="form-group">
                <Label>
                  <IntlMessages id="menu.area" />
                </Label>
                <Select
                  isClearable
                  placeholder={<IntlMessages id="forms.select" />}
                  {...register('generalAcademicAreaId', { required: true })}
                  className="react-select"
                  classNamePrefix="react-select"
                  options={areasList}
                  value={area}
                  onChange={(selectedOption) => {
                    setValue('generalAcademicAreaId', selectedOption?.key);
                    setArea(selectedOption);
                  }}
                />
              </div>
              <div className="form-group d-flex align-items-center">
                <Input
                  className="itemCheck m-0 mr-2"
                  type="checkbox"
                  id={`check_hasStandard`}
                  defaultChecked={data.hasStandard}
                  onChange={() => {
                    setValue('hasStandard', !data.hasStandard);
                  }}
                  label=""
                />
                {<IntlMessages id="forms.hasStandard" />}
              </div>
              <div className="form-group d-flex align-items-center">
                <Input
                  className="itemCheck m-0 mr-2"
                  type="checkbox"
                  id={`check_hasDba`}
                  defaultChecked={data.hasDba}
                  onChange={() => {
                    setValue('hasDba', !data.hasDba);
                  }}
                  label=""
                />
                {<IntlMessages id="forms.hasDba" />}
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

const mapDispatchToProps = { ...asignatureActions };

const mapStateToProps = () => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(GeneralAsignatureCreateEdit);
