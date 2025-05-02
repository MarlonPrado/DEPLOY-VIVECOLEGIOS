import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Button, Card, CardBody, Row, Modal, ModalHeader, 
  ModalBody, ModalFooter, FormGroup, Label, Input, Nav, 
  NavItem, TabContent, TabPane, InputGroup
} from 'reactstrap';
import * as forumActions from '../../../../stores/actions/ForumAction';
import { Colxx } from '../../../common/CustomBootstrap';
import { createNotification } from '../../../../helpers/Notification';
import IntlMessages from '../../../../helpers/IntlMessages';
import classnames from 'classnames';

const ForumListApp = (props: any) => {
  // Estados existentes
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
  const [forumQuestions, setForumQuestions] = useState([]);
  const [forumAnswers, setForumAnswers] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loadingInteractions, setLoadingInteractions] = useState(false);
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

  // Función para cargar foros con filtrado correcto y depuración mejorada
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
      
      // DEPURACIÓN AVANZADA
      console.log("Estructura completa del primer foro:", 
        result && result.length > 0 ? JSON.stringify(result[0], null, 2) : "No hay foros");
      
      // Extraer todos los campos para ver qué tenemos disponible
      if (result && result.length > 0) {
        console.log("Campos disponibles en node:", Object.keys(result[0].node));
        
        // Intentar acceder directamente al campo que necesitamos
        const hasAcademicId = "academicAsignatureCourseId" in result[0].node;
        console.log("¿Tiene academicAsignatureCourseId?", hasAcademicId);
        
        // Ver si está con otro nombre o dentro de otro objeto
        Object.keys(result[0].node).forEach(key => {
          const value = result[0].node[key];
          if (typeof value === 'object' && value !== null) {
            console.log(`Contenido del campo ${key}:`, value);
          }
        });
      }
      
      let filteredForums = result || [];
      
      // SOLUCIÓN DEFINITIVA - usar el resultado de la depuración para modificar esto
      if (courseId && filteredForums.length > 0) {
        console.log("Intentando filtrar por courseId:", courseId);
        
        // Primera opción: filtrar usando curso directamente desde el JSON
        filteredForums = filteredForums.filter((forum: any) => {
          const forumString = JSON.stringify(forum);
          return forumString.includes(courseId);
        });
        
        console.log("Foros filtrados encontrados:", filteredForums.length);
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
      }
    } catch (error) {
      console.error("Error al cargar interacciones:", error);
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

  // Ver detalles del foro
  const handleViewForum = async (forum: any) => {
    try {
      // Obtener datos completos del foro
      const forumData = await props.dataForum(forum.node.id);
      setCurrentForum(forumData.getForum);
      setViewModal(true);
      
      // Cargar interacciones (comentarios) del foro
      loadForumInteractions(forum.node.id);
    } catch (error) {
      console.error("Error al cargar detalles del foro:", error);
      createNotification('error', 'Error', 'No se pudieron cargar los detalles');
    }
  };

  // Cambiar pestaña en el modal - Corregido para prevenir la navegación
  const toggleTab = (tab: string, e: React.MouseEvent) => {
    // Prevenir la acción predeterminada del navegador (redirección)
    e.preventDefault();
    if (activeTab !== tab) setActiveTab(tab);
  };

  // Guardar un nuevo comentario
  const handleSaveComment = async () => {
    if (!newComment.trim()) return;
    
    try {
      setLoadingInteractions(true);
      
      const commentData = {
        comment: newComment,
        forumId: currentForum.id,
        userId: props.loginReducer.userId
      };
      
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
      createNotification('error', 'Error', 'No se pudo guardar el comentario');
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
                        className="mr-2"
                        onClick={() => handleViewForum(item)}
                      >
                        <i className="simple-icon-eye"></i>
                      </Button>
                      <Button 
                        color={item.node.active ? "warning" : "success"} 
                        size="sm" 
                        className="mr-2"
                        onClick={() => handleToggleActive(item)}
                      >
                        <i className={`simple-icon-${item.node.active ? 'close' : 'check'}`}></i>
                      </Button>
                      <Button 
                        color="danger" 
                        size="sm"
                        onClick={() => handleDelete(item)}
                      >
                        <i className="simple-icon-trash"></i>
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

      {/* Modal para ver foro - Mejorado visualmente */}
      <Modal isOpen={viewModal} toggle={() => setViewModal(!viewModal)} size="lg">
        <ModalHeader 
          toggle={() => setViewModal(!viewModal)} 
          className="border-0 pb-0"
        >
          <div className="w-100">
            {/* Título con borde inferior gradiente */}
            <h3 className="mb-2" style={{
              display: "inline-block",
              paddingBottom: "8px",
              borderBottom: "3px solid",
              borderImage: "linear-gradient(to right, #2D81FF 0%, #6EB5FF 100%)",
              borderImageSlice: 1
            }}>
              {currentForum?.name}
            </h3>
            {/* Descripción */}
            <p className="text-muted mb-0">{currentForum?.description}</p>
          </div>
        </ModalHeader>
        <ModalBody className="pt-0">
          <Nav tabs className="mt-3">
            <NavItem>
              <a
                className={classnames({ active: activeTab === '1' }, 'nav-link')}
                onClick={(e) => toggleTab('1', e)}
                href="#tab1"
                role="button"
              >
                Detalles
              </a>
            </NavItem>
            <NavItem>
              <a
                className={classnames({ active: activeTab === '2' }, 'nav-link')}
                onClick={(e) => toggleTab('2', e)}
                href="#tab2"
                role="button"
              >
                Comentarios
              </a>
            </NavItem>
            <NavItem>
              <a
                className={classnames({ active: activeTab === '3' }, 'nav-link')}
                onClick={(e) => toggleTab('3', e)}
                href="#tab3"
                role="button"
              >
                Preguntas
              </a>
            </NavItem>
            <NavItem>
              <a
                className={classnames({ active: activeTab === '4' }, 'nav-link')}
                onClick={(e) => toggleTab('4', e)}
                href="#tab4"
                role="button"
              >
                Respuestas
              </a>
            </NavItem>
          </Nav>
          <TabContent activeTab={activeTab} className="pt-3">
            {/* Tab de Detalles */}
            <TabPane tabId="1">
              <h5>Descripción</h5>
              <p>{currentForum?.description}</p>
              <h5>Detalles</h5>
              <p>{currentForum?.details || 'No hay detalles disponibles'}</p>
              <h5>Información adicional</h5>
              <div className="table-responsive">
                <table className="table table-bordered">
                  <tbody>
                    <tr>
                      <th style={{width: '30%'}}>Estado</th>
                      <td>{currentForum?.active ? 'Activo' : 'Inactivo'}</td>
                    </tr>
                    <tr>
                      <th>ID del Foro</th>
                      <td>{currentForum?.id || '-'}</td>
                    </tr>
                    <tr>
                      <th>Curso asociado</th>
                      <td>{currentForum?.academicAsignatureCourseId || '-'}</td>
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
                      <th>Creado por</th>
                      <td>{currentForum?.createdByUserId || '-'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </TabPane>
            
            {/* Tab de Comentarios */}
            <TabPane tabId="2">
              <div className="d-flex flex-column" style={{ height: "400px" }}>
                {/* Área de mensajes con scroll */}
                <div 
                  className="flex-grow-1 mb-3 overflow-auto" 
                  style={{ maxHeight: "300px" }}
                >
                  {loadingInteractions ? (
                    <div className="text-center my-5">
                      <div className="loading"></div>
                    </div>
                  ) : forumInteractions.length > 0 ? (
                    forumInteractions.map((interaction: any, index: number) => (
                      <Card key={interaction.node.id} className="mb-3">
                        <CardBody className="py-2">
                          <div className="d-flex">
                            <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mr-3" style={{width: 40, height: 40}}>
                              {interaction.node.user?.firstName?.[0] || ''}{interaction.node.user?.lastName?.[0] || ''}
                            </div>
                            <div className="flex-grow-1">
                              <div className="d-flex justify-content-between align-items-center mb-1">
                                <h6 className="mb-0 font-weight-bold">
                                  {interaction.node.user?.firstName} {interaction.node.user?.lastName}
                                </h6>
                                <small className="text-muted">{formatDate(interaction.node.createdAt)}</small>
                              </div>
                              <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                                {interaction.node.comment}
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
                    </div>
                  )}
                </div>
                
                {/* Área de entrada de texto */}
                <div className="mt-auto">
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
                <h5>Preguntas del foro</h5>
                
                {/* Botón para agregar nueva pregunta (solo para docentes) */}
                <Button 
                  color="outline-primary" 
                  className="mb-4 align-self-end"
                  onClick={() => {
                    // Implementar lógica para agregar pregunta
                    createNotification('info', 'Información', 'Funcionalidad en desarrollo');
                  }}
                >
                  <i className="simple-icon-plus mr-2"></i>
                  Nueva Pregunta
                </Button>
                
                {/* Lista de preguntas */}
                <Card className="mb-3">
                  <CardBody>
                    <h6 className="font-weight-bold">¿Cómo aplicaría el teorema en un caso práctico?</h6>
                    <p className="text-muted mb-0">Profesor: Carlos Martínez - Hace 3 días</p>
                  </CardBody>
                </Card>
                <Card className="mb-3">
                  <CardBody>
                    <h6 className="font-weight-bold">¿Cuáles son las limitaciones principales de este enfoque?</h6>
                    <p className="text-muted mb-0">Profesor: Carlos Martínez - Hace 3 días</p>
                  </CardBody>
                </Card>
              </div>
            </TabPane>
            
            {/* Tab de Respuestas */}
            <TabPane tabId="4">
              <div className="mb-4">
                <h5>Respuestas a preguntas</h5>
                <Card className="mb-3">
                  <CardBody>
                    <h6 className="font-weight-bold">Re: ¿Cómo aplicaría el teorema en un caso práctico?</h6>
                    <p>Se podría aplicar en situaciones donde necesitemos optimizar recursos bajo restricciones específicas, por ejemplo en problemas de programación lineal.</p>
                    <p className="text-muted mb-0">Estudiante: Ana López - Hace 2 días</p>
                  </CardBody>
                </Card>
                <Card className="mb-3">
                  <CardBody>
                    <h6 className="font-weight-bold">Re: ¿Cuáles son las limitaciones principales de este enfoque?</h6>
                    <p>La principal limitación es que solo funciona con variables continuas y no tiene en cuenta la incertidumbre del mundo real.</p>
                    <p className="text-muted mb-0">Estudiante: Pedro Gómez - Hace 1 día</p>
                  </CardBody>
                </Card>
              </div>
            </TabPane>
          </TabContent>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setViewModal(false)}>
            Cerrar
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

export default connect(mapStateToProps, {
  ...forumActions
})(ForumListApp);
