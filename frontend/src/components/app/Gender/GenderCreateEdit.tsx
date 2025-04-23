import { connect } from 'react-redux';
import { Input, Label, ModalBody, ModalFooter } from 'reactstrap';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {Loader} from '../../common/Loader';
import IntlMessages from '../../../helpers/IntlMessages';
import * as genderActions from '../../../stores/actions/GenderActions';
import { Colxx } from '../../common/CustomBootstrap';
import AddNewModal from '../../common/Data/AddNewModal';
import CreateEditAuditInformation from '../../common/Data/CreateEditAuditInformation';

const GenderCreateEdit = (props: any) => {
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
  const { ref: codeRef, ...codeRest } = register('code', {
    required: true,
    value: props?.data?.id ? props?.data?.code : '',
  });
  const { ref: descriptionRef, ...descriptionRest } = register('description', {
    required: true,
    value: props?.data?.id ? props?.data?.description : '',
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
                  <IntlMessages id="forms.code" />
                </Label>
                <Input {...codeRest} innerRef={codeRef} className="form-control" />
              </div>
              <div className="form-group">
                <Label>
                  <IntlMessages id="forms.description" />
                </Label>
                <Input {...descriptionRest} innerRef={descriptionRef} className="form-control" />
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

const mapDispatchToProps = { ...genderActions };

const mapStateToProps = () => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(GenderCreateEdit);
