import React, { useEffect, useState } from 'react';
import { FormProvider, useForm, useFormState } from 'react-hook-form';
import { connect } from 'react-redux';
import Select from 'react-select';
import { Badge, Button, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Alert } from 'reactstrap';
import IntlMessages from '../../../helpers/IntlMessages';
import * as inboxActions from '../../../stores/actions/InboxAction';

// Constantes para IDs de roles
const ROLE_IDS = {
  SUPERADMIN: "619551f4882a2fb6525a307b",    // GENERAL
  ADMIN_COLEGIO: "6195519c882a2fb6525a3076", // ADMIN COLEGIO
  DOCENTE: "619551da882a2fb6525a3079",       // DOCENTE
  ESTUDIANTE: "619551d1882a2fb6525a3078",    // ESTUDIANTE
  COORDINADOR: "619551c7882a2fb6525a3077",   // COORDINADOR SEDE
  ADMIN_SEDE: "61955190882a2fb6525a3075",    // ADMIN SEDE
  ADMIN_DOCENTE: "62cce07010845aac44d05db0", // ADMIN DOCENTE
  ACUDIENTE: "619551e1882a2fb6525a307a"      // ACUDIENTE
};

const InboxCreate = (props: any) => {
  const [user, setUser] = useState(null);
  const [usersList, setUsersList] = useState(null);
  
  // Estado para controlar qué campos están deshabilitados
  const [disabledFields, setDisabledFields] = useState({
    subject: false,
    message: false,
    to: false,
    entireForm: false
  });
  
  // Estado para almacenar el rol del usuario
  const [userRole, setUserRole] = useState({
    id: "",
    name: "",
    isStudent: false,
    isTeacher: false,
    isAdmin: false,
    isSchoolAdmin: false,
    isCampusAdmin: false
  });

  const methods = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const { control, reset, register, setValue } = methods;
  const { isValid } = useFormState({ control });

  // Verificar el rol del usuario al cargar el componente
  useEffect(() => {
    // Verificamos el ID del rol del usuario
    if (props.loginReducer && props.loginReducer.role) {
      const roleId = props.loginReducer.role.id;
      
      // Determinamos el tipo de usuario según el ID del rol
      const isStudent = roleId === ROLE_IDS.ESTUDIANTE;
      const isTeacher = roleId === ROLE_IDS.DOCENTE;
      const isAcudiente = roleId === ROLE_IDS.ACUDIENTE;
      const isSuperAdmin = roleId === ROLE_IDS.SUPERADMIN;
      const isAdminColegio = roleId === ROLE_IDS.ADMIN_COLEGIO;
      const isAdminSede = roleId === ROLE_IDS.ADMIN_SEDE;
      const isCoordinador = roleId === ROLE_IDS.COORDINADOR;
      const isAdminDocente = roleId === ROLE_IDS.ADMIN_DOCENTE;
      
      // Guardamos la información del rol
      setUserRole({
        id: roleId,
        name: props.loginReducer.role.name,
        isStudent,
        isTeacher,
        isAdmin: isSuperAdmin,
        isSchoolAdmin: isAdminColegio,
        isCampusAdmin: isAdminSede
      });
      
      console.log("Información del rol:", {
        roleId,
        roleName: props.loginReducer.role.name,
        isStudent,
        isTeacher,
        isAcudiente,
        isSuperAdmin,
        isAdminColegio,
        isAdminSede
      });
      
      // Configuramos los campos según el rol
      
      // ESTUDIANTES: Formulario completamente deshabilitado con mensaje
      if (isStudent) {
        setDisabledFields({
          subject: true,
          message: true,
          to: true,
          entireForm: true
        });
        return;
      }
      
      // DOCENTES: Pueden enviar mensajes, pero no pueden modificar el asunto
      if (isTeacher) {
        setValue('title', 'VALIDADO QUE ES DOCENTE');
        setDisabledFields({
          subject: true,
          message: false,
          to: false,
          entireForm: false
        });
        return;
      }
      
      // ADMIN, ADMIN COLEGIO, ADMIN SEDE: Tienen acceso completo
      if (isSuperAdmin || isAdminColegio || isAdminSede) {
        setDisabledFields({
          subject: false,
          message: false,
          to: false,
          entireForm: false
        });
        return;
      }
      
      // ACUDIENTE, COORDINADOR, OTROS ROLES: Formulario deshabilitado
      setDisabledFields({
        subject: true,
        message: true,
        to: true,
        entireForm: true
      });
    }
  }, [props.loginReducer]);

  useEffect(() => {
    // Solo cargamos los usuarios si el formulario no está completamente deshabilitado
    if (!disabledFields.entireForm) {
      getDropdowns();
    }
  }, [disabledFields.entireForm]);

  const cleanForm = async () => {
    reset();
  };

  const getDropdowns = async () => {
    try {
      props.getDropdownsInbox().then((data: any) => {
        // Verificación de seguridad antes de acceder a dataUsers
        if (data && data.dataUsers && data.dataUsers.edges) {
          
          console.log("Datos de usuarios:", data.dataUsers.edges);
          setUsersList(
            data.dataUsers.edges.map((c: any) => {
              return { 
                label: `${c.node.name} ${c.node.lastName} - ${c.node.phone}`, 
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

  // Renderizar diferentes contenidos según el rol
  const renderFormContent = () => {
    // Si el formulario está completamente deshabilitado
    if (disabledFields.entireForm) {
      return (
        <Alert color="warning" className="mb-0">
          <h4 className="alert-heading">Formulario no disponible para tu rol</h4>
          <p className="mb-0">
            {userRole.isStudent 
              ? "Los estudiantes no pueden enviar mensajes directamente. Por favor, contacta con tu profesor o coordinador."
              : "Tu rol actual no tiene permisos para enviar mensajes en el sistema."}
          </p>
        </Alert>
      );
    }

    // Formulario normal para roles con permisos
    return (
      <>
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
            isDisabled={disabledFields.to}
          />
        </div>
        <div className="form-group">
          <Label>
            <IntlMessages id="forms.subject" />
            {disabledFields.subject && (
              <span className="ml-2 text-muted font-italic small">
                {userRole.isTeacher 
                  ? "(Campo preestablecido para docentes)" 
                  : "(Campo preestablecido)"}
              </span>
            )}
          </Label>
          <Input 
            {...titleRest} 
            innerRef={titleRef} 
            className="form-control" 
            disabled={disabledFields.subject}
          />
        </div>
        <div className="form-group">
          <Label>
            <IntlMessages id="forms.message" />
            {disabledFields.message && (
              <span className="ml-2 text-muted font-italic small">
                (Campo preestablecido)
              </span>
            )}
          </Label>
          <Input 
            {...messageRest} 
            innerRef={messageRef} 
            className="form-control" 
            disabled={disabledFields.message}
            type="textarea" 
            rows={5}
          />
        </div>
      </>
    );
  };

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
            {renderFormContent()}
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" outline onClick={props.toggleModal}>
              <IntlMessages id="pages.cancel" />
            </Button>
            {!disabledFields.entireForm && (
              <Button
                color="primary"
                onClick={() => {
                  onSubmit(methods.getValues());
                }}
                disabled={!isValid}
              >
                <IntlMessages id="pages.submit" />
              </Button>
            )}
          </ModalFooter>
        </Modal>
      </form>
    </FormProvider>
  );
};

const mapDispatchToProps = { ...inboxActions };

// Conectar con el reducer de login para obtener información del usuario actual
const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

export default connect(mapStateToProps, mapDispatchToProps)(InboxCreate);
