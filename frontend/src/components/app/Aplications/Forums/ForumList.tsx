import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Button, Card, CardBody, Row, Modal, ModalHeader, 
  ModalBody, ModalFooter, FormGroup, Label, Input, Nav, 
  NavItem, TabContent, TabPane, InputGroup, Alert
} from 'reactstrap';
import * as forumActions from '../../../../stores/actions/ForumAction';
import { Colxx } from '../../../common/CustomBootstrap';
import { createNotification } from '../../../../helpers/Notification';
import IntlMessages from '../../../../helpers/IntlMessages';
import classnames from 'classnames';

const ForumListApp = (props: any) => {
  // Estados para la aplicación
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [formModal, setFormModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    details: ''
  });
  const [currentForum, setCurrentForum] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('1');
  
  // Nuevos estados para comentarios e interacciones
  const [forumInteractions, setForumInteractions] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loadingInteractions, setLoadingInteractions] = useState(false);
  const [loadingForum, setLoadingForum] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const commentInputRef = useRef<HTMLInputElement>(null);
  
  // Navegación y parámetros
  const navigate = useNavigate();
  const schoolId = searchParams.get('schoolId');
  const courseId = searchParams.get('courseId');
  const courseName = searchParams.get('courseName');

  // Cargar datos iniciales
  useEffect(() => {
    if (schoolId) {
      loadForums();
    } else if (props.loginReducer?.schoolId) {
      loadForums(props.loginReducer.schoolId);
    } else {
      createNotification('error', 'Error', 'No se encontró ID de institución');
      navigate('/home');
    }
  }, []);

  // Función para formatear fechas de manera amigable
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      // Hoy - Mostrar hora
      return `Hoy a las ${date.toLocaleTimeString('es-ES', {hour: '2-digit', minute:'2-digit'})}`;
    } else if (diffDays === 1) {
      // Ayer
      return `Ayer a las ${date.toLocaleTimeString('es-ES', {hour: '2-digit', minute:'2-digit'})}`;
    } else if (diffDays < 7) {
      // Esta semana
      return `Hace ${diffDays} días`;
    } else {
      // Más de una semana
      return date.toLocaleDateString('es-ES', {
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  // Función para cargar foros
  const loadForums = async (defaultSchoolId: string | null = null) => {
    setIsLoading(true);
    try {
      // Usar el schoolId de la URL o el valor por defecto
      const schoolIdToUse = schoolId || defaultSchoolId;
      if (!schoolIdToUse) {
        throw new Error("ID de institución no encontrado");
      }
      
      // Cargar todos los foros
      const result = await props.getListAllForum(schoolIdToUse);
      console.log("Foros cargados:", result);
      
      // Filtrar por courseId si está disponible usando JSON.stringify para buscar el ID
      let filteredForums = result || [];
      if (courseId) {
        console.log("Filtrando por courseId:", courseId);
        filteredForums = filteredForums.filter((forum: any) => {
          const forumString = JSON.stringify(forum);
          return forumString.includes(courseId);
        });
        console.log("Foros después del filtrado:", filteredForums.length);
      }
      
      setItems(filteredForums);
    } catch (error) {
      console.error("Error al cargar foros:", error);
      createNotification('error', 'Error', 'No se pudieron cargar los foros');
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar interacciones del foro cuando se abre el modal
  const loadForumInteractions = async (forumId: string) => {
    setLoadingInteractions(true);
    try {
      const interactionsData = await props.dataForumInteraction(forumId);
      
      if (interactionsData && interactionsData.getForumInteractions) {
        setForumInteractions(interactionsData.getForumInteractions.edges || []);
      } else {
        setForumInteractions([]);
      }
    } catch (error) {
      console.error("Error al cargar interacciones:", error);
      setForumInteractions([]);
    } finally {
      setLoadingInteractions(false);
    }
  };

  // Manejar cambio en el formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Crear o actualizar foro
  const handleSaveForum = async () => {
    if (!formData.name || !formData.description) {
      createNotification('warning', 'Advertencia', 'Por favor complete los campos obligatorios');
      return;
    }

    try {
      setIsLoading(true);
      
      const dataToSave: any = {
        name: formData.name,
        description: formData.description,
        details: formData.details,
        schoolId: schoolId || props.loginReducer.schoolId,
        academicAsignatureCourseId: courseId || null,
        schoolYearId: props.loginReducer.schoolYear
      };

      if (props.loginReducer.campusId) {
        dataToSave.campusId = props.loginReducer.campusId;
      }

      await props.saveNewForum(dataToSave);
      createNotification('success', 'Éxito', 'Foro creado correctamente');
      
      // Resetear el formulario y cerrar modal
      setFormData({
        name: '',
        description: '',
        details: ''
      });
      setFormModal(false);
      
      // Recargar foros
      loadForums(schoolId || props.loginReducer.schoolId);
    } catch (error) {
      console.error("Error al guardar foro:", error);
      createNotification('error', 'Error', 'No se pudo guardar el foro');
    } finally {
      setIsLoading(false);
    }
  };

  // Activar/Inactivar foro
  const handleToggleActive = async (forum: any) => {
    try {
      setIsLoading(true);
      const newStatus = !forum.node.active;
      await props.changeActiveForum(newStatus, forum.node.id, true);
      createNotification('success', 'Éxito', `Foro ${newStatus ? 'activado' : 'inactivado'} correctamente`);
      loadForums(schoolId || props.loginReducer.schoolId);
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      createNotification('error', 'Error', 'No se pudo actualizar el estado');
    } finally {
      setIsLoading(false);
    }
  };

  // Eliminar foro
  const handleDelete = async (forum: any) => {
    if (window.confirm('¿Está seguro que desea eliminar este foro?')) {
      try {
        setIsLoading(true);
        await props.deleteForum(forum.node.id, true);
        createNotification('success', 'Éxito', 'Foro eliminado correctamente');
        loadForums(schoolId || props.loginReducer.schoolId);
      } catch (error) {
        console.error("Error al eliminar foro:", error);
        createNotification('error', 'Error', 'No se pudo eliminar el foro');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Ver detalles del foro - Versión corregida
  const handleViewForum = async (forum: any) => {
    try {
      // Primero abrimos el modal y luego cargamos los datos
      setCurrentForum(forum.node); // Usamos los datos básicos del foro primero
      setViewModal(true);
      setLoadingForum(true);
      setErrorMessage('');
      
      // Obtener datos completos del foro
      const forumData = await props.dataForum(forum.node.id);
      
      if (forumData && forumData.getForum) {
        console.log("Datos del foro cargados:", forumData.getForum);
        setCurrentForum(forumData.getForum);
        
        // Cargar interacciones (comentarios) del foro
        loadForumInteractions(forum.node.id);
      } else {
        setErrorMessage('No se pudieron cargar los detalles completos del foro.');
      }
    } catch (error) {
      console.error("Error al cargar detalles del foro:", error);
      setErrorMessage('No se pudieron cargar los detalles del foro. Por favor intente nuevamente.');
    } finally {
      setLoadingForum(false);
    }
  };

  // Cambiar pestaña en el modal
  const toggleTab = (tab: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (activeTab !== tab) setActiveTab(tab);
  };

  // Guardar un nuevo comentario - Corregido para evitar errores de objeto undefined
  const handleSaveComment = async () => {
    if (!newComment.trim() || !currentForum) return;
    
    try {
      setLoadingInteractions(true);
      setErrorMessage('');
      
      // Verificamos que el currentForum existe y tiene id antes de continuar
      if (!currentForum || !currentForum.id) {
        throw new Error("No se pudo identificar el foro actual");
      }
      
      // Creamos el objeto de comentario correctamente
      const commentData = {
        comment: newComment,
        forumId: currentForum.id
      };
      
      console.log("Guardando comentario:", commentData);
      
      await props.saveIntetactionForum(commentData);
      
      // Limpiar el campo y recargar comentarios
      setNewComment('');
      await loadForumInteractions(currentForum.id);
      
      // Enfocar de nuevo el campo de texto
      if (commentInputRef.current) {
        commentInputRef.current.focus();
      }
    } catch (error) {
      console.error("Error al guardar comentario:", error);
      setErrorMessage('No se pudo guardar el comentario. Por favor intente nuevamente.');
    } finally {
      setLoadingInteractions(false);
    }
  };

  // Manejar la pulsación de Enter para enviar el comentario
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSaveComment();
    }
  };

  return (
    <>
      <Row>
        <Colxx xxs="12" className="mb-4">
          <Card className="mb-4">
            <CardBody>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h1>Foros</h1>
                  {courseName && <p className="text-muted">Curso: {courseName}</p>}
                </div>
                <Button color="primary" onClick={() => setFormModal(true)}>
                  <i className="simple-icon-plus mr-2"></i>
                  Nuevo Foro
                </Button>
              </div>
            </CardBody>
          </Card>

          {isLoading ? (
            <div className="text-center my-5">
              <div className="loading"></div>
            </div>
          ) : items.length > 0 ? (
            items.map((item: any, index: number) => (
              <Card key={item.node.id} className="mb-3">
                <CardBody>
                  <div className="d-flex justify-content-between">
                    <div className="w-75">
                      <h5 className="mb-1">{item.node.name}</h5>
                      <p className="text-muted mb-2">{item.node.description}</p>
                      <small className="text-muted">
                        Creado: {formatDate(item.node.createdAt)}
                      </small>
                      {!item.node.active && (
                        <span className="badge badge-danger ml-2">Inactivo</span>
                      )}
                    </div>
                    <div className="d-flex">
                      <Button 
                        color="info" 
                        size="sm" 
                        className="mr-2 d-flex align-items-center"
                        onClick={() => handleViewForum(item)}
                      >
                        <i className="simple-icon-eye mr-1"></i>
                        Ver foro
                      </Button>
                      <Button 
                        color={item.node.active ? "warning" : "success"} 
                        size="sm" 
                        className="mr-2 d-flex align-items-center"
                        onClick={() => handleToggleActive(item)}
                      >
                        <i className={`simple-icon-${item.node.active ? 'close' : 'check'} mr-1`}></i>
                        {item.node.active ? 'Inactivar' : 'Activar'}
                      </Button>
                      <Button 
                        color="danger" 
                        size="sm"
                        className="d-flex align-items-center"
                        onClick={() => handleDelete(item)}
                      >
                        <i className="simple-icon-trash mr-1"></i>
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))
          ) : (
            <Card>
              <CardBody className="text-center py-5">
                <i className="iconsminds-speach-bubble-dialog mb-4" style={{ fontSize: '3rem', opacity: 0.4 }}></i>
                <h3>No hay foros disponibles</h3>
                <p className="text-muted">Cree un nuevo foro usando el botón "Nuevo Foro"</p>
              </CardBody>
            </Card>
          )}
        </Colxx>
      </Row>

      {/* Modal para crear foro */}
      <Modal isOpen={formModal} toggle={() => setFormModal(!formModal)} size="lg">
        <ModalHeader toggle={() => setFormModal(!formModal)}>
          Crear Nuevo Foro
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="name">Título *</Label>
            <Input
              type="text"
              name="name"
              id="name"
              placeholder="Título del foro"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="description">Descripción *</Label>
            <Input
              type="text"
              name="description"
              id="description"
              placeholder="Breve descripción del foro"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="details">Detalles</Label>
            <Input
              type="textarea"
              name="details"
              id="details"
              rows="5"
              placeholder="Contenido detallado del foro"
              value={formData.details}
              onChange={handleInputChange}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setFormModal(false)}>
            Cancelar
          </Button>
          <Button color="primary" onClick={handleSaveForum} disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm mr-1" role="status" aria-hidden="true"></span>
                Guardando...
              </>
            ) : (
              'Guardar Foro'
            )}
          </Button>
        </ModalFooter>
      </Modal>

      {/* Modal para ver foro - Versión corregida que siempre se abre */}
      <Modal isOpen={viewModal} toggle={() => setViewModal(!viewModal)} size="lg">
        <ModalHeader toggle={() => setViewModal(!viewModal)} className="p-0 border-0">
          <div className="w-100 p-4 text-white" style={{ 
            background: 'linear-gradient(135deg, #2D81FF 0%, #6EB5FF 100%)'
          }}>
            <h3 className="mb-2 font-weight-bold">
              {loadingForum ? 'Cargando...' : currentForum?.name || 'Detalles del foro'}
            </h3>
            <p className="mb-0 opacity-90">
              {loadingForum ? '' : currentForum?.description || ''}
            </p>
          </div>
        </ModalHeader>
        
        <Nav tabs className="p-0 border-0">
          <NavItem>
            <a
              className={classnames({ active: activeTab === '1' }, 'nav-link border-0 font-weight-bold')}
              onClick={(e) => toggleTab('1', e)}
              href="#tab1"
              role="button"
            >
              Detalles
            </a>
          </NavItem>
          <NavItem>
            <a
              className={classnames({ active: activeTab === '2' }, 'nav-link border-0 font-weight-bold')}
              onClick={(e) => toggleTab('2', e)}
              href="#tab2"
              role="button"
            >
              Comentarios
            </a>
          </NavItem>
          <NavItem>
            <a
              className={classnames({ active: activeTab === '3' }, 'nav-link border-0 font-weight-bold')}
              onClick={(e) => toggleTab('3', e)}
              href="#tab3"
              role="button"
            >
              Preguntas
            </a>
          </NavItem>
          <NavItem>
            <a
              className={classnames({ active: activeTab === '4' }, 'nav-link border-0 font-weight-bold')}
              onClick={(e) => toggleTab('4', e)}
              href="#tab4"
              role="button"
            >
              Respuestas
            </a>
          </NavItem>
        </Nav>
        
        <ModalBody className="pt-3">
          {loadingForum && (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Cargando...</span>
              </div>
              <p className="mt-3">Cargando información del foro...</p>
            </div>
          )}
          
          {errorMessage && (
            <Alert color="danger">
              <i className="simple-icon-exclamation mr-2"></i>
              {errorMessage}
            </Alert>
          )}
          
          {!loadingForum && (
            <TabContent activeTab={activeTab} className="pt-2">
              {/* Tab de Detalles */}
              <TabPane tabId="1">
                <div className="info-section mb-4">
                  <h5 className="section-title">Descripción</h5>
                  <p className="section-content">{currentForum?.description || 'Sin descripción'}</p>
                </div>
                
                <div className="info-section mb-4">
                  <h5 className="section-title">Detalles</h5>
                  <div className="p-3 bg-light rounded mb-4">
                    {currentForum?.details ? (
                      <div style={{ whiteSpace: 'pre-wrap' }}>
                        {currentForum.details}
                      </div>
                    ) : (
                      <p className="text-muted mb-0">No hay detalles disponibles</p>
                    )}
                  </div>
                </div>
                
                <div className="info-section">
                  <h5 className="section-title">Información adicional</h5>
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <tbody>
                        <tr>
                          <th style={{width: '30%'}}>Estado</th>
                          <td>
                            {currentForum?.active ? (
                              <span className="badge badge-success px-3 py-2">Activo</span>
                            ) : (
                              <span className="badge badge-danger px-3 py-2">Inactivo</span>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <th>Fecha de creación</th>
                          <td>{currentForum?.createdAt ? formatDate(currentForum.createdAt) : '-'}</td>
                        </tr>
                        <tr>
                          <th>Última actualización</th>
                          <td>{currentForum?.updatedAt ? formatDate(currentForum.updatedAt) : '-'}</td>
                        </tr>
                        <tr>
                          <th>ID del foro</th>
                          <td><code>{currentForum?.id || '-'}</code></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabPane>
              
              {/* Tab de Comentarios */}
              <TabPane tabId="2">
                <div className="comments-container d-flex flex-column" style={{ minHeight: "400px" }}>
                  {/* Área de mensajes con scroll */}
                  <div 
                    className="flex-grow-1 mb-3 overflow-auto" 
                    style={{ maxHeight: "350px" }}
                  >
                    {loadingInteractions ? (
                      <div className="text-center py-5">
                        <div className="spinner-border text-primary mb-3" role="status">
                          <span className="sr-only">Cargando...</span>
                        </div>
                        <p>Cargando comentarios...</p>
                      </div>
                    ) : forumInteractions && forumInteractions.length > 0 ? (
                      forumInteractions.map((interaction: any, index: number) => (
                        <Card key={interaction.node?.id || index} className="mb-3">
                          <CardBody className="py-3">
                            <div className="d-flex">
                              <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mr-3" style={{width: 40, height: 40}}>
                                {interaction.node?.user?.firstName?.[0] || 'U'}{interaction.node?.user?.lastName?.[0] || ''}
                              </div>
                              <div className="flex-grow-1">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                  <h6 className="mb-0 font-weight-bold">
                                    {interaction.node?.user ? 
                                      `${interaction.node.user.firstName || ''} ${interaction.node.user.lastName || ''}`.trim() 
                                      : 'Usuario'
                                    }
                                  </h6>
                                  <small className="text-muted">
                                    {interaction.node?.createdAt ? formatDate(interaction.node.createdAt) : '-'}
                                  </small>
                                </div>
                                <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                                  {interaction.node?.comment || 'Sin contenido'}
                                </p>
                              </div>
                            </div>
                          </CardBody>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-5">
                        <i className="simple-icon-bubble mb-3" style={{ fontSize: '2rem', opacity: 0.4 }}></i>
                        <p>No hay comentarios en este foro</p>
                        <p className="text-muted">Sé el primero en comentar</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Área de entrada de texto */}
                  <div className="mt-auto border-top pt-3">
                    <InputGroup>
                      <Input
                        type="text"
                        placeholder="Escribe un comentario..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyPress={handleKeyPress}
                        innerRef={commentInputRef}
                        disabled={loadingInteractions}
                      />
                      <Button 
                        color="primary" 
                        onClick={handleSaveComment}
                        disabled={loadingInteractions || !newComment.trim()}
                      >
                        {loadingInteractions ? (
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        ) : (
                          <i className="simple-icon-paper-plane"></i>
                        )}
                      </Button>
                    </InputGroup>
                    <small className="text-muted">Presiona Enter para enviar</small>
                  </div>
                </div>
              </TabPane>
              
              {/* Tab de Preguntas */}
              <TabPane tabId="3">
                <div className="mb-4 d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="mb-0">Preguntas del foro</h5>
                    <Button 
                      color="outline-primary" 
                      size="sm"
                      onClick={() => {
                        createNotification('info', 'Información', 'Funcionalidad en desarrollo');
                      }}
                    >
                      <i className="simple-icon-plus mr-2"></i>
                      Nueva Pregunta
                    </Button>
                  </div>
                  
                  <div className="text-center py-5">
                    <i className="iconsminds-mail-question mb-3" style={{ fontSize: '3rem', opacity: 0.4 }}></i>
                    <h4>Preguntas del foro</h4>
                    <p className="text-muted">No hay preguntas disponibles para este foro</p>
                  </div>
                </div>
              </TabPane>
              
              {/* Tab de Respuestas */}
              <TabPane tabId="4">
                <div className="mb-4">
                  <h5 className="mb-4">Respuestas a preguntas</h5>
                  
                  <div className="text-center py-5">
                    <i className="iconsminds-speach-bubble-dialog mb-3" style={{ fontSize: '3rem', opacity: 0.4 }}></i>
                    <h4>Respuestas del foro</h4>
                    <p className="text-muted">No hay respuestas disponibles para este foro</p>
                  </div>
                </div>
              </TabPane>
            </TabContent>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setViewModal(false)}>
            Cerrar
          </Button>
        </ModalFooter>
      </Modal>

      <style>
        {`
        .section-title {
          font-weight: 600;
          color: #3a3a3a;
          margin-bottom: 10px;
          padding-bottom: 5px;
          border-bottom: 2px solid #f0f0f0;
        }
        
        .info-section {
          margin-bottom: 25px;
        }
        
        .badge {
          font-size: 90%;
          padding: 0.4em 0.8em;
        }
        
        .nav-tabs .nav-link.active {
          font-weight: bold;
          color: #2D81FF;
          border-bottom: 3px solid #2D81FF !important;
          background: transparent;
        }
        
        .nav-tabs .nav-link {
          border: none;
          padding: 1rem 1.5rem;
          color: #6c757d;
        }

        .table th {
          background-color: #f8f9fa;
        }

        /* Estilo para los comentarios */
        .comments-container .card {
          transition: all 0.2s ease;
          border-left: 3px solid transparent;
        }

        .comments-container .card:hover {
          border-left: 3px solid #2D81FF;
          box-shadow: 0 3px 10px rgba(0,0,0,0.1);
        }
        `}
      </style>
    </>
  );
};

const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

export default connect(mapStateToProps, {
  ...forumActions
})(ForumListApp);
