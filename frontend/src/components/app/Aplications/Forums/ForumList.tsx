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
import ForumModal from './ForumModal';

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

  // Toggle para abrir/cerrar modal - MOVIDO AQUÍ ARRIBA para evitar el error
  const toggleViewModal = () => {
    setViewModal(!viewModal);
  };

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

  // Define una interfaz para las interacciones para mejor tipado
  interface ForumInteractionEdge {
    node?: {
      id?: string;
      comment?: string;
      createdAt?: string;
      forumQuestion?: any;
      createdByUser?: {
        name?: string;
        lastName?: string;
      };
      // Otros campos que pueda tener
    };
  }

  // Corrige la función loadForumInteractions para manejar la estructura correcta
const loadForumInteractions = async (forumId: string) => {
  console.log('📊 INICIO loadForumInteractions - forumId:', forumId);
  setLoadingInteractions(true);
  
  try {
    console.log('📊 Ejecutando dataForumInteraction para forumId:', forumId);
    console.log('📊 Enviando consulta GraphQL getAllForumInteraction con variables:', { forumId });
    
    const result = await props.dataForumInteraction(forumId);
    console.log('📊 Respuesta completa de dataForumInteraction:', result);
    
    // CORRECCIÓN: Acceder a los datos correctamente según la estructura de la respuesta
    // La respuesta parece ser directamente un objeto con 'data', no 'getForumInteractions'
    if (result && result.data) {
      console.log('📊 Datos encontrados en la respuesta');
      
      // Verificar si hay edges en la respuesta
      const interactionsArray = result.data.edges || [];
      console.log('📊 Número total de interacciones recibidas:', interactionsArray.length);
      
      // Clasificar las interacciones para depuración
      const comments = interactionsArray.filter((edge: any) => !edge.node?.forumQuestion);
      const answers = interactionsArray.filter((edge: any) => edge.node?.forumQuestion);
      
      console.log('📊 Desglose de interacciones:', {
        totalInteractions: interactionsArray.length,
        comentarios: comments.length,
        respuestasAPreguntas: answers.length
      });
      
      // Actualizar el estado con las interacciones
      setForumInteractions(interactionsArray);
    } else {
      console.log('⚠️ No se encontraron interacciones o formato incorrecto:', result);
      setForumInteractions([]);
    }
  } catch (error) {
    console.error("❌ ERROR al cargar interacciones:", error);
    setForumInteractions([]);
  } finally {
    setLoadingInteractions(false);
    console.log('📊 FIN loadForumInteractions');
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

  // Asegurarte de que esta función esté actualizada para el ForumModal
  const handleViewForum = async (forum: any) => {
    try {
      console.log('🔍 Abriendo modal de foro:', forum.node.id);
      setCurrentForum(forum.node);
      setViewModal(true); // Primero abrimos el modal
      setLoadingForum(true);
      setErrorMessage('');
      
      console.log('🔍 Cargando datos completos del foro...');
      const forumData = await props.dataForum(forum.node.id);
      
      if (forumData && forumData.getForum) {
        console.log('🔍 Datos completos del foro obtenidos:', forumData.getForum);
        setCurrentForum(forumData.getForum);
        
        // Cargar interacciones del foro
        console.log('🔍 Iniciando carga de interacciones para forumId:', forum.node.id);
        loadForumInteractions(forum.node.id);
      } else {
        console.log('⚠️ Error: No se pudieron obtener datos completos del foro');
        setErrorMessage('No se pudieron cargar los detalles completos del foro.');
      }
    } catch (error) {
      console.error("❌ ERROR al cargar detalles del foro:", error);
      setErrorMessage('No se pudieron cargar los detalles del foro. Por favor intente nuevamente.');
    } finally {
      setLoadingForum(false);
    }
  };

  // Guardar un nuevo comentario o respuesta a pregunta
  const handleSaveComment = async (comment: string, questionId?: string) => {
    if (!comment.trim() || !currentForum) return;
    
    try {
      setLoadingInteractions(true);
      setErrorMessage('');
      
      // Verificamos que el currentForum existe y tiene id
      if (!currentForum || !currentForum.id) {
        throw new Error("No se pudo identificar el foro actual");
      }
      
      const commentData: any = {
        comment: comment,
        forumId: currentForum.id
      };
      
      // Si es una respuesta a una pregunta, agregamos el ID de la pregunta
      if (questionId) {
        commentData.forumQuestionId = questionId;
        console.log('📝 Enviando respuesta a pregunta:', commentData);
      } else {
        console.log('📝 Enviando comentario simple:', commentData);
      }
      
      console.log('📝 Ejecutando mutación GraphQL para guardar comentario/respuesta...');
      
      const result = await props.saveIntetactionForum(commentData);
      console.log('📝 Respuesta de guardar interacción:', result);
      
      // Recargar comentarios
      console.log('🔄 Recargando interacciones después de guardar...');
      await loadForumInteractions(currentForum.id);
      
      // Notificar éxito
      createNotification('success', 'Éxito', 'Comentario guardado correctamente');
    } catch (error) {
      console.error("❌ ERROR al guardar comentario/respuesta:", error);
      setErrorMessage('No se pudo guardar. Por favor intente nuevamente.');
      createNotification('error', 'Error', 'No se pudo guardar el comentario');
    } finally {
      setLoadingInteractions(false);
    }
  };

  // Agregar una nueva pregunta
  const handleAddQuestion = () => {
    // Esta función ahora es manejada por el modal de preguntas
    if (!currentForum) {
      createNotification('warning', 'Advertencia', 'No se pudo identificar el foro actual');
      return;
    }
    
    // Esta función se pasará al modal de preguntas para su procesamiento
    console.log('📝 Preparando para agregar pregunta al foro:', currentForum.id);
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

      {/* ForumModal para ver y comentar en foros */}
      <ForumModal
        isOpen={viewModal}
        toggle={toggleViewModal}
        forum={currentForum}
        forumInteractions={forumInteractions}
        loadingForum={loadingForum}
        loadingInteractions={loadingInteractions}
        errorMessage={errorMessage}
        formatDate={formatDate}
        onSaveComment={handleSaveComment}
        onAddQuestion={handleAddQuestion}
        reloadInteractions={() => {
          if (currentForum && currentForum.id) {
            console.log('🔄 Recargando interacciones desde ForumModal - forumId:', currentForum.id);
            loadForumInteractions(currentForum.id);
          } else {
            console.log('⚠️ No se puede recargar: currentForum o currentForum.id es null/undefined');
          }
        }}
      />
    </>
  );
};

const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

export default connect(mapStateToProps, {
  ...forumActions
})(ForumListApp);
