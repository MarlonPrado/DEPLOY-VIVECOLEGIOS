import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import { 
  Badge, Button, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, 
  Nav, NavItem, NavLink, TabContent, TabPane, Alert, Spinner
} from 'reactstrap';
import classnames from 'classnames';
import IntlMessages from '../../../helpers/IntlMessages';
import * as inboxActions from '../../../stores/actions/InboxAction';

const InboxCreate = (props: any) => {
  // Estados
  const [usersList, setUsersList] = useState<any[]>([]);
  const [coursesList, setCourseslist] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('1');
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Estados para campos de formulario
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  
  // Estados de carga
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(false);

  // Cambiar de pestaña
  const toggleTab = (tab: string) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
      setErrorMessage('');
      
      // Resetear selecciones al cambiar de pestaña
      setSelectedUser(null);
      setSelectedCourse(null);
    }
  };

  // Limpiar formulario
  const cleanForm = () => {
    setSelectedUser(null);
    setSelectedCourse(null);
    setActiveTab('1');
    setErrorMessage('');
    setTitle('');
    setMessage('');
  };

  // Cargar datos iniciales
  useEffect(() => {
    getDropdowns();
  }, []);

  // Obtener datos para los dropdowns
  const getDropdowns = async () => {
    try {
      setLoadingUsers(true);
      setLoadingCourses(true);
      
      const data = await props.getDropdownsInbox();
      
      // Procesar usuarios si existe data.dataUsers
      if (data && data.dataUsers && data.dataUsers.edges) {
        const users = data.dataUsers.edges.map((c: any) => {
          return { 
            label: `${c.node.name} ${c.node.lastName} - ${c.node.phone || ''}`, 
            value: c.node.id, 
            key: c.node.id 
          };
        });
        setUsersList(users);
      }
      
      // Procesar cursos si existe data.dataCourses
      if (data && data.dataCourses && data.dataCourses.edges) {
        const courses = data.dataCourses.edges.map((c: any) => {
          return { 
            label: c.node.name, 
            value: c.node.id, 
            key: c.node.id 
          };
        });
        setCourseslist(courses);
      } else {
        // Datos de cursos de ejemplo - reemplazar con datos reales
        setCourseslist([
          { label: 'Grado 10A', value: 'course1', key: 'course1' },
          { label: 'Grado 11B', value: 'course2', key: 'course2' },
          { label: 'Grado 9C', value: 'course3', key: 'course3' }
        ]);
      }
    } catch (error) {
      console.error("Error al obtener datos:", error);
      setUsersList([]);
      setCourseslist([]);
      setErrorMessage('Error al cargar usuarios y cursos');
    } finally {
      setLoadingUsers(false);
      setLoadingCourses(false);
    }
  };

  // Enviar formulario
  const onSubmit = async () => {
    // Evitar envíos múltiples
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      setErrorMessage('');
      
      // Validación básica
      if (!title || !message) {
        setErrorMessage('Por favor complete todos los campos requeridos');
        setIsSubmitting(false);
        return;
      }
      
      // Datos básicos comunes
      const baseFormData = {
        title,
        message,
        dateSend: new Date().toISOString()
      };
      
      // Construir el payload según la pestaña activa SIN recipientType
      let formData;
      
      switch (activeTab) {
        case '1': // Estudiante individual
          if (!selectedUser) {
            setErrorMessage('Por favor seleccione un estudiante');
            setIsSubmitting(false);
            return;
          }
          formData = {
            ...baseFormData,
            userId: selectedUser.value
          };
          break;
          
        case '2': // Curso específico
          if (!selectedCourse) {
            setErrorMessage('Por favor seleccione un curso');
            setIsSubmitting(false);
            return;
          }
          formData = {
            ...baseFormData,
            courseId: selectedCourse.value
          };
          break;
          
        case '3': // Todos mis cursos
          formData = {
            ...baseFormData,
            myCourses: true
          };
          break;
          
        case '4': // Toda la institución
          formData = {
            ...baseFormData,
            allInstitution: true
          };
          break;
      }
      
      console.log(`Enviando mensaje desde pestaña ${activeTab}:`, formData);
      
      // Llamada al backend
      await props.onSubmit(formData);
      
      // Si se envía correctamente, cerrar el modal y limpiar el formulario
      props.toggleModal();
      cleanForm();
      
      // Actualizar la lista de mensajes si es necesario
      if (props.getInboxs) {
        props.getInboxs();
      }
      
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
      setErrorMessage('Error al enviar el mensaje. Por favor inténtelo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Verificar si el formulario es válido según la pestaña activa
  const isFormValid = () => {
    const hasTitle = !!title;
    const hasMessage = !!message;
    const basicFieldsValid = hasTitle && hasMessage;
    
    if (!basicFieldsValid) return false;
    
    switch (activeTab) {
      case '1': // Estudiante individual
        return !!selectedUser;
      case '2': // Curso específico
        return !!selectedCourse;
      default:
        return true;
    }
  };

  // Componente para mostrar cargando en Select
  const LoadingIndicator = () => (
    <div className="d-flex align-items-center p-2">
      <Spinner size="sm" color="primary" className="mr-2" />
      <span>Cargando...</span>
    </div>
  );

  return (
    <Modal
      isOpen={props.modalOpen}
      toggle={props.toggleModal}
      wrapClassName="modal-right"
      backdrop="static"
      size="lg"
    >
      <ModalHeader toggle={props.toggleModal}>
        <i className="iconsminds-mail-send mr-2"></i>
        Nuevo Mensaje
      </ModalHeader>
      <ModalBody>
        {errorMessage && (
          <Alert color="danger" className="mb-4">
            <i className="simple-icon-exclamation mr-2"></i>
            {errorMessage}
          </Alert>
        )}
        
        <h6 className="mb-3 text-muted">Seleccione el alcance del mensaje:</h6>
        
        {/* Pestañas de alcance */}
        <Nav tabs className="separator-tabs mb-4">
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === '1' })}
              onClick={() => toggleTab('1')}
              style={{ cursor: 'pointer' }}
            >
              <i className="iconsminds-student-male mr-2"></i>
              Para un estudiante
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === '2' })}
              onClick={() => toggleTab('2')}
              style={{ cursor: 'pointer' }}
            >
              <i className="iconsminds-blackboard mr-2"></i>
              Para un curso
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === '3' })}
              onClick={() => toggleTab('3')}
              style={{ cursor: 'pointer' }}
            >
              <i className="iconsminds-books mr-2"></i>
              Para mis cursos
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === '4' })}
              onClick={() => toggleTab('4')}
              style={{ cursor: 'pointer' }}
            >
              <i className="iconsminds-building mr-2"></i>
              Para toda la IE
            </NavLink>
          </NavItem>
        </Nav>
        
        {/* Contenido de las pestañas */}
        <TabContent activeTab={activeTab}>
          {/* Pestaña 1: Para un estudiante */}
          <TabPane tabId="1">
            <div className="form-group">
              <Label>Seleccione el estudiante: <span className="text-danger">*</span></Label>
              <Select
                isClearable
                placeholder="Buscar estudiante..."
                className="react-select"
                classNamePrefix="react-select"
                options={usersList}
                value={selectedUser}
                onChange={(option) => setSelectedUser(option)}
                isLoading={loadingUsers}
                loadingMessage={() => <LoadingIndicator />}
                noOptionsMessage={() => "No se encontraron estudiantes"}
              />
            </div>
          </TabPane>
          
          {/* Pestaña 2: Para un curso */}
          <TabPane tabId="2">
            <div className="form-group">
              <Label>Seleccione el curso: <span className="text-danger">*</span></Label>
              <Select
                isClearable
                placeholder="Buscar curso..."
                className="react-select"
                classNamePrefix="react-select"
                options={coursesList}
                value={selectedCourse}
                onChange={(option) => setSelectedCourse(option)}
                isLoading={loadingCourses}
                loadingMessage={() => <LoadingIndicator />}
                noOptionsMessage={() => "No se encontraron cursos"}
              />
            </div>
          </TabPane>
          
          {/* Pestaña 3: Para todos mis cursos */}
          <TabPane tabId="3">
            <div className="alert alert-info">
              <i className="iconsminds-speach-bubble-information mr-2"></i>
              Este mensaje será enviado a todos los estudiantes en los cursos que usted enseña.
            </div>
          </TabPane>
          
          {/* Pestaña 4: Para toda la institución */}
          <TabPane tabId="4">
            <div className="alert alert-warning">
              <i className="iconsminds-speach-bubble-dialog mr-2"></i>
              Este mensaje será enviado a todos los miembros de la institución educativa.
              <br />
              <strong>Tenga en cuenta que esto puede generar un gran volumen de notificaciones.</strong>
            </div>
          </TabPane>
        </TabContent>
        
        <div className="separator my-4"></div>
        
        {/* Formulario común para todas las pestañas */}
        <div className="form-group">
          <Label>Título del mensaje: <span className="text-danger">*</span></Label>
          <Input 
            name="title"
            className="form-control"
            placeholder="Ingrese un título para el mensaje..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        
        <div className="form-group">
          <Label>Contenido del mensaje: <span className="text-danger">*</span></Label>
          <Input 
            name="message"
            className="form-control" 
            type="textarea" 
            rows={5}
            placeholder="Escriba su mensaje aquí..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
      </ModalBody>
      
      <ModalFooter>
        <div className="d-flex w-100 justify-content-between">
          <div>
            <Badge color="info" className="mr-1">
              {activeTab === '1' ? 'Mensaje individual' : 
               activeTab === '2' ? 'Mensaje a curso' : 
               activeTab === '3' ? 'Mensaje a mis cursos' :
               'Mensaje institucional'}
            </Badge>
            
            {(activeTab === '1' && selectedUser) && (
              <Badge color="primary">
                {selectedUser.label}
              </Badge>
            )}
            
            {(activeTab === '2' && selectedCourse) && (
              <Badge color="primary">
                {selectedCourse.label}
              </Badge>
            )}
          </div>
          
          <div>
            <Button color="light" onClick={props.toggleModal} className="mr-2" disabled={isSubmitting}>
              Cancelar
            </Button>
            
            <Button
              color="primary"
              onClick={onSubmit}
              disabled={!isFormValid() || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm mr-1" role="status" aria-hidden="true"></span>
                  Enviando...
                </>
              ) : (
                <>
                  <i className="simple-icon-paper-plane mr-2"></i>
                  Enviar mensaje
                </>
              )}
            </Button>
          </div>
        </div>
      </ModalFooter>
    </Modal>
  );
};

const mapDispatchToProps = { ...inboxActions };
const mapStateToProps = ({ loginReducer }: any) => ({ loginReducer });

export default connect(mapStateToProps, mapDispatchToProps)(InboxCreate);
