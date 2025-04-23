import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {Loader} from '../../common/Loader';
import { connect } from 'react-redux';
import { Input, Label, ModalBody, ModalFooter } from 'reactstrap';
import IntlMessages from '../../../helpers/IntlMessages';
import * as schoolActions from '../../../stores/actions/SchoolActions';
import { Colxx } from '../../common/CustomBootstrap';
import AddNewModal from '../../common/Data/AddNewModal';
import CreateEditAuditInformation from '../../common/Data/CreateEditAuditInformation';

const SchoolCreateEdit = (props: any) => {
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
  const { ref: pedagogicalModelRef, ...pedagogicalModelRest } = register('pedagogicalModel', {
    required: true,
    value: props?.data?.id ? props?.data?.pedagogicalModel : '',
  });
  const { ref: educationalModelRef, ...educationalModelRest } = register('educationalModel', {
    required: true,
    value: props?.data?.id ? props?.data?.educationalModel : '',
  });
  const { ref: curricularComponentRef, ...curricularComponentRest } = register('curricularComponent', {
    required: true,
    value: props?.data?.id ? props?.data?.curricularComponent : '',
  });
  const { ref: daneCodeRef, ...daneCodeRest } = register('daneCode', {
    required: true,
    value: props?.data?.id ? props?.data?.daneCode : '',
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
            <Loader/>
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
                  Modelo pedagógico
                </Label>
                <Input {...pedagogicalModelRest} innerRef={pedagogicalModelRef} className="form-control" />
              </div>
              <div className="form-group">
                <Label>
                  Modelo educativo
                </Label>
                <Input {...educationalModelRest} innerRef={educationalModelRef} className="form-control" />
              </div>
              <div className="form-group">
                <Label>
                  Componente curricular
                </Label>
                <Input {...curricularComponentRest} innerRef={curricularComponentRef} className="form-control" />
              </div>
              <div className="form-group">
                <Label>
                  <IntlMessages id="forms.daneCode" />
                </Label>
                <Input {...daneCodeRest} innerRef={daneCodeRef} className="form-control" />
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

const mapDispatchToProps = { ...schoolActions };

const mapStateToProps = () => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(SchoolCreateEdit);
