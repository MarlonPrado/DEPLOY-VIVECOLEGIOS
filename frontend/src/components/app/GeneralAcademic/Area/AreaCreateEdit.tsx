import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Loader } from '../../../common/Loader';
import { connect } from 'react-redux';
import { Input, Label, ModalBody, ModalFooter } from 'reactstrap';
import IntlMessages from '../../../../helpers/IntlMessages';
import * as areaActions from '../../../../stores/actions/GeneralAcademic/AreaActions';
import { Colxx } from '../../../common/CustomBootstrap';
import AddNewModal from '../../../common/Data/AddNewModal';
import CreateEditAuditInformation from '../../../common/Data/CreateEditAuditInformation';

const GeneralAreaCreateEdit = (props: any) => {
  const [loading, setLoading] = useState(true);

  const methods = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const { handleSubmit, control, register, reset, setValue, getValues } = methods;

  useEffect(() => {
    cleanForm();
    setLoading(false);
  }, [props?.data]);

  const cleanForm = async () => {
    reset();
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

const mapDispatchToProps = { ...areaActions };

const mapStateToProps = () => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(GeneralAreaCreateEdit);
