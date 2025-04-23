import React, { useEffect, useState } from 'react';
import { FormProvider, useForm, useFormState } from 'react-hook-form';
import { connect } from 'react-redux';
import Select from 'react-select';
import { Badge, Button, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import IntlMessages from '../../../helpers/IntlMessages';
import * as inboxActions from '../../../stores/actions/InboxAction';

const InboxCreate = (props: any) => {
  const [user, setUser] = useState(null);
  const [usersList, setUsersList] = useState(null);

  const methods = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const { control, reset, register, setValue } = methods;
  const { isValid } = useFormState({ control });

  useEffect(() => {
    getDropdowns();
  }, []);

  const cleanForm = async () => {
    reset();
  };

  const getDropdowns = async () => {
    try {
      props.getDropdownsInbox().then((data: any) => {
        // Verificación de seguridad antes de acceder a dataUsers
        if (data && data.dataUsers && data.dataUsers.edges) {
          setUsersList(
            data.dataUsers.edges.map((c: any) => {
              return { 
                label: `${c.node.name} ${c.node.lastName}`, 
                value: c.node.id, 
                key: c.node.id 
              };
            }),
          );
        } else {
          console.error("Datos incompletos recibidos:", data);
          setUsersList([]);
        }
      });
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      setUsersList([]);
    }
  };

  const onSubmit = async (dataForm: any) => {
    props.saveNewInbox(dataForm).then((data: any) => {
      props.toggleModal();
      cleanForm();
      props.getInboxs();
    });
  };

  const { ref: titleRef, ...titleRest } = register('title', {
    required: true,
    value: null,
  });
  const { ref: messageRef, ...messageRest } = register('message', {
    required: true,
    value: null,
  });
  register('dateSend', {
    required: false,
    value: new Date(),
  });

  return (
    <FormProvider {...methods}>
      <form>
        <Modal
          isOpen={props.modalOpen}
          toggle={props.toggleModal}
          wrapClassName="modal-right"
          backdrop="static"
        >
          <ModalHeader
            toggle={props.toggleModal}
            close={
              <button type="button" className="close" onClick={props.toggleModal} aria-label="Close">
                <span aria-hidden="true">×</span>
              </button>
            }
          >
            <IntlMessages id="pages.newMessage" />
          </ModalHeader>
          <ModalBody>
            <div className="form-group">
              <Label className='d-flex justify-content-between align-items-center'>
                <IntlMessages id="forms.to" />
                <div>
                  <Badge className='mr-2' color="primary" >
                    <IntlMessages id="menu.users" />
                  </Badge>
                  <Badge color="secondary" >
                    <IntlMessages id="menu.courses" />
                  </Badge>
                </div>
              </Label>
              <Select
                isClearable
                placeholder={<IntlMessages id="forms.select" />}
                {...register('userId', { required: true })}
                className="react-select"
                classNamePrefix="react-select"
                options={usersList}
                value={user}
                onChange={(selectedOption) => {
                  setValue('userId', selectedOption?.key);
                  setUser(selectedOption);
                }}
              />
            </div>
            <div className="form-group">
              <Label>
                <IntlMessages id="forms.subject" />
              </Label>
              <Input {...titleRest} innerRef={titleRef} className="form-control" />
            </div>
            <div className="form-group">
              <Label>
                <IntlMessages id="forms.message" />
              </Label>
              <Input {...messageRest} innerRef={messageRef} className="form-control" />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" outline onClick={props.toggleModal}>
              <IntlMessages id="pages.cancel" />
            </Button>
            <Button
              color="primary"
              onClick={() => {
                onSubmit(methods.getValues());
              }}
              disabled={!isValid}
            >
              <IntlMessages id="pages.submit" />
            </Button>
          </ModalFooter>
        </Modal>
      </form>
    </FormProvider>
  );
};

const mapDispatchToProps = { ...inboxActions };

const mapStateToProps = () => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(InboxCreate);
