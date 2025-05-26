import React, { useEffect, useState, useCallback } from 'react';
import { connect } from 'react-redux';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Button, Card, CardBody, Row, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input } from 'reactstrap';
import * as forumActions from '../../../../stores/actions/ForumAction';
import { Colxx } from '../../../common/CustomBootstrap';
import { createNotification } from '../../../../helpers/Notification';
import DataList from '../../../common/Data/DataList';
import { Loader } from '../../../common/Loader';
import ForumModal from './ForumModal';
import { FORUM_COLUMN_LIST } from '../../../../constants/Forum/ForumConstants';

const ForumList = (props: any) => {
  // Estados principales (siguiendo el estándar)
  const [dataTable, setDataTable] = useState(null);
  const [columns, setColumns] = useState(FORUM_COLUMN_LIST);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  
  // Estado para el item seleccionado (siguiendo el estándar)
  const [data, setData] = useState(null);
  
  // Estados para el formulario
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    details: ''
  });
  
  // Estados para interacciones
  const [forumInteractions, setForumInteractions] = useState([]);
  const [loadingInteractions, setLoadingInteractions] = useState(false);
  const [loadingForum, setLoadingForum] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Navegación y parámetros
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const schoolId = searchParams.get('schoolId');
  const courseId = searchParams.get('courseId');
  const academicAsignatureCourseId = searchParams.get('academicAsignatureCourseId');
  const courseName = searchParams.get('courseName');

  // Verificar si el usuario es estudiante
  const isStudentRole = props.loginReducer?.role?.id === "619551d1882a2fb6525a3078";
  
  // Cargar datos al iniciar
  useEffect(() => {
    if (schoolId) {
      getDataTable();
    } else if (props.loginReducer?.schoolId) {
      getDataTable(props.loginReducer.schoolId);
    } else {
      createNotification('error', 'Error', 'No se encontró ID de institución');
      navigate('/home');
    }
  }, []);

  // Función para formatear fechas (utilidad)
  const formatDate = useCallback((dateString: string) => {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return `Hoy a las ${date.toLocaleTimeString('es-ES', {hour: '2-digit', minute:'2-digit'})}`;
    } else if (diffDays === 1) {
      return `Ayer a las ${date.toLocaleTimeString('es-ES', {hour: '2-digit', minute:'2-digit'})}`;
    } else if (diffDays < 7) {
      return `Hace ${diffDays} días`;
    } else {
      return date.toLocaleDateString('es-ES', {
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }, []);

  // Cargar datos (siguiendo estándar con useCallback)
  const getDataTable = useCallback(async (defaultSchoolId: string | null = null) => {
    setDataTable(null);
    
    try {
      const schoolIdToUse = schoolId || defaultSchoolId;
      if (!schoolIdToUse) {
        throw new Error("ID de institución no encontrado");
      }
      
      const listData = await props.getListAllForum(schoolIdToUse);
      
      // NUEVA LÓGICA DE FILTRADO PRECISA
      let filteredForums = listData || [];
      
      // Verificar si la URL tiene parámetros específicos
      const hasUrlParams = academicAsignatureCourseId || courseId;
      
      if (hasUrlParams) {
        console.log("Filtrando por URL params - academicAsignatureCourseId:", academicAsignatureCourseId);
        
        // Si hay academicAsignatureCourseId en la URL, SOLO mostrar foros con ese ID específico
        if (academicAsignatureCourseId) {
          filteredForums = filteredForums.filter((forum: any) => {
            // Comparación exacta con el valor en BD
            return forum?.node?.academicAsignatureCourseId === academicAsignatureCourseId;
          });
        } 
        // Caso de respaldo, si hay courseId pero no academicAsignatureCourseId
        else if (courseId) {
          filteredForums = filteredForums.filter((forum: any) => {
            // Filtrado por courseId como respaldo
            return forum?.node?.courseId === courseId;
          });
        }
      } else {
        // Si NO hay parámetros en la URL, SOLO mostrar foros INSTITUCIONALES
        // (donde academicAsignatureCourseId sea null o "null")
        console.log("Mostrando SOLO foros institucionales (academicAsignatureCourseId = null)");
        
        filteredForums = filteredForums.filter((forum: any) => {
          const forumAsignatureId = forum?.node?.academicAsignatureCourseId;
          // Filtrar para mostrar solo los que tienen academicAsignatureCourseId null o "null"
          return forumAsignatureId === null || forumAsignatureId === "null" || forumAsignatureId === undefined;
        });
      }
      
      // Formatear datos para la tabla (siguiendo estándar)
      if (Array.isArray(filteredForums)) {
        setDataTable(filteredForums.map((forum: any, index: number) => {
          if (forum && forum.node) {
            // Añadir key única para resolver warning de React
            forum.key = forum.node.id || `forum-${index}`;
            forum.node.createdAt_format = formatDate(forum.node.createdAt);
          }
          return forum;
        }).filter(Boolean));
      } else {
        console.error("Respuesta no es un array:", filteredForums);
        setDataTable([]);
      }
    } catch (error) {
      console.error("Error al cargar foros:", error);
      createNotification('error', 'Error', 'No se pudieron cargar los foros');
      setDataTable([]);
    }
  }, [schoolId, courseId, academicAsignatureCourseId, props.getListAllForum, formatDate]);

  // Refrescar datos (estándar)
  const refreshDataTable = useCallback(async () => {
    await getDataTable(schoolId || props.loginReducer?.schoolId);
  }, [getDataTable, schoolId, props.loginReducer?.schoolId]);

  // Cargar interacciones
  const loadForumInteractions = useCallback(async (forumId: string) => {
    setLoadingInteractions(true);
    
    try {
      const result = await props.dataForumInteraction(forumId);
      
      if (result && result.data) {
        const interactionsArray = result.data.edges || [];
        setForumInteractions(interactionsArray);
      } else {
        setForumInteractions([]);
      }
    } catch (error) {
      console.error("Error al cargar interacciones:", error);
      setForumInteractions([]);
    } finally {
      setLoadingInteractions(false);
    }
  }, [props.dataForumInteraction]);

  // FUNCIONES CRUD ESTÁNDAR
  
  // Ver/Editar (siguiendo estándar)
  const viewEditData = useCallback(async (id: string) => {
    try {
      setLoadingForum(true);
      setErrorMessage('');
      
      // Obtener datos completos del foro
      const forumData = await props.dataForum(id);
      
      if (forumData && forumData.getForum) {
        setData(forumData.getForum);
        
        // Para el modal de creación/edición
        setFormData({
          name: forumData.getForum.name || '',
          description: forumData.getForum.description || '',
          details: forumData.getForum.details || ''
        });
        
        // Cargar interacciones para el modal de visualización
        loadForumInteractions(id);
        setViewModal(true);
      } else {
        setErrorMessage('No se pudieron cargar los detalles completos del foro.');
        createNotification('error', 'Error', 'No se pudo cargar el foro');
      }
    } catch (error) {
      console.error("Error al cargar detalles del foro:", error);
      createNotification('error', 'Error', 'No se pudo cargar el foro');
    } finally {
      setLoadingForum(false);
    }
  }, [props.dataForum, loadForumInteractions]);

  // Activar/Inactivar (siguiendo estándar)
  const changeActiveData = useCallback(async (active: boolean, id: string) => {
    try {
      await props.changeActiveForum(active, id, true);
      createNotification('success', 'Éxito', `Foro ${active ? 'activado' : 'inactivado'} correctamente`);
      refreshDataTable();
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      createNotification('error', 'Error', 'No se pudo actualizar el estado');
    }
  }, [props.changeActiveForum, refreshDataTable]);

  // Eliminar (siguiendo estándar)
  const deleteData = useCallback(async (id: string) => {
    if (window.confirm('¿Está seguro que desea eliminar este foro?')) {
      try {
        await props.deleteForum(id, true);
        createNotification('success', 'Éxito', 'Foro eliminado correctamente');
        refreshDataTable();
      } catch (error) {
        console.error("Error al eliminar foro:", error);
        createNotification('error', 'Error', 'No se pudo eliminar el foro');
      }
    }
  }, [props.deleteForum, refreshDataTable]);
  
  // Eliminar varios (siguiendo estándar)
  const deleteAll = useCallback(async (items: any[]) => {
    if (window.confirm(`¿Está seguro que desea eliminar ${items.length} foros?`)) {
      try {
        const promises = items.map((item) => props.deleteForum(item.node.id, false));
        await Promise.all(promises);
        createNotification('success', 'Éxito', 'Foros eliminados correctamente');
        refreshDataTable();
      } catch (error) {
        console.error("Error al eliminar foros:", error);
        createNotification('error', 'Error', 'No se pudieron eliminar los foros');
      }
    }
  }, [props.deleteForum, refreshDataTable]);
  
  // Activar/Inactivar varios (siguiendo estándar)
  const changeActiveDataAll = useCallback(async (items: any[]) => {
    if (window.confirm(`¿Está seguro que desea cambiar el estado de ${items.length} foros?`)) {
      try {
        const promises = items.map((item) => {
          // Invertir el estado actual
          return props.changeActiveForum(!item.node.active, item.node.id, false);
        });
        
        await Promise.all(promises);
        createNotification('success', 'Éxito', 'Estados actualizados correctamente');
        refreshDataTable();
      } catch (error) {
        console.error("Error al actualizar estados:", error);
        createNotification('error', 'Error', 'No se pudieron actualizar los estados');
      }
    }
  }, [props.changeActiveForum, refreshDataTable]);

  // Navegación adicional (siguiendo estándar)
  const additionalFunction = useCallback((item: any, btn: any) => {
    // No hay funciones adicionales específicas para foros
    // pero mantenemos la función para consistencia con el patrón
  }, []);

  // MANEJO DEL FORMULARIO
  
  // Input change
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  // Submit del formulario
  const handleSaveForum = useCallback(async () => {
    if (!formData.name || !formData.description) {
      createNotification('warning', 'Advertencia', 'Por favor complete los campos obligatorios');
      return;
    }

    try {
      const dataToSave: any = {
        name: formData.name,
        description: formData.description,
        details: formData.details,
        schoolId: schoolId || props.loginReducer.schoolId,
        academicAsignatureCourseId: academicAsignatureCourseId || null,
        schoolYearId: props.loginReducer.schoolYear
      };

      if (props.loginReducer.campusId) {
        dataToSave.campusId = props.loginReducer.campusId;
      }
      
      // Si hay un ID, es actualización
      if (data?.id) {
        dataToSave.id = data.id;
        await props.updateForum(dataToSave);
        createNotification('success', 'Éxito', 'Foro actualizado correctamente');
      } else {
        // Si no hay ID, es creación
        await props.saveNewForum(dataToSave);
        createNotification('success', 'Éxito', 'Foro creado correctamente');
      }
      
      // Resetear formulario y cerrar modal
      setFormData({ name: '', description: '', details: '' });
      setModalOpen(false);
      setData(null);
      
      // Recargar foros
      refreshDataTable();
    } catch (error) {
      console.error("Error al guardar foro:", error);
      createNotification('error', 'Error', 'No se pudo guardar el foro');
    }
  }, [formData, data, props.loginReducer, courseId, schoolId, props.saveNewForum, props.updateForum, refreshDataTable]);

  // Guardar comentario
  const handleSaveComment = useCallback(async (comment: string, questionId?: string) => {
    if (!comment.trim() || !data) return;
    
    try {
      setLoadingInteractions(true);
      setErrorMessage('');
      
      const commentData: any = {
        comment: comment,
        forumId: data.id
      };
      
      if (questionId) {
        commentData.forumQuestionId = questionId;
      }
      
      await props.saveIntetactionForum(commentData);
      await loadForumInteractions(data.id);
      createNotification('success', 'Éxito', 'Comentario guardado correctamente');
    } catch (error) {
      console.error("Error al guardar comentario:", error);
      createNotification('error', 'Error', 'No se pudo guardar el comentario');
    } finally {
      setLoadingInteractions(false);
    }
  }, [data, props.saveIntetactionForum, loadForumInteractions]);

  // Eliminar comentario
  const handleDeleteComment = useCallback(async (commentId: string) => {
    if (window.confirm('¿Está seguro que desea eliminar este comentario?')) {
      try {
        setLoadingInteractions(true);
        await props.deleteForumInteraction(commentId, true);
        
        if (data?.id) {
          await loadForumInteractions(data.id);
          createNotification('success', 'Éxito', 'Comentario eliminado correctamente');
        }
      } catch (error) {
        console.error("Error al eliminar comentario:", error);
        createNotification('error', 'Error', 'No se pudo eliminar el comentario');
      } finally {
        setLoadingInteractions(false);
      }
    }
  }, [data, props.deleteForumInteraction, loadForumInteractions]);

  // Abrir modal de creación
  const handleNewForum = useCallback(() => {
    if (isStudentRole) {
      createNotification('warning', 'Acceso restringido', 'No tienes permisos para crear foros');
      return;
    }
    
    setData(null);
    setFormData({ name: '', description: '', details: '' });
    setModalOpen(true);
  }, [isStudentRole]);

  // Toggle para modales
  const toggleFormModal = useCallback(() => {
    setModalOpen(!modalOpen);
    if (modalOpen) {
      setData(null);
      setFormData({ name: '', description: '', details: '' });
    }
  }, [modalOpen]);

  const toggleViewModal = useCallback(() => {
    setViewModal(!viewModal);
  }, [viewModal]);

  // Definir botones personalizados
  const childrenButtons = [
    {
      id: 1,
      label: 'Ver foro',
      color: 'info',
      icon: 'simple-icon-eye',
      action: 'viewForum',
    }
  ];

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
                {/* Botón nuevo foro condicionado por rol */}
                {!isStudentRole && (
                  <Button color="primary" onClick={handleNewForum}>
                    <i className="simple-icon-plus mr-2"></i>
                    Nuevo Foro
                  </Button>
                )}
              </div>
            </CardBody>
          </Card>

          {/* DataList siguiendo el estándar */}
          {dataTable === null ? (
            <Colxx sm={12} className="d-flex justify-content-center">
              <Loader />
            </Colxx>
          ) : (
            <DataList
              data={dataTable}
              columns={columns}
              match={location}
              modalOpen={modalOpen}
              setModalOpen={setModalOpen}
              viewEditData={viewEditData}
              deleteData={deleteData}
              changeActiveData={changeActiveData}
              deleteAll={deleteAll}
              changeActiveDataAll={changeActiveDataAll}
              additionalFunction={additionalFunction}
              childrenButtons={childrenButtons}
              withChildren={true}
              refreshDataTable={refreshDataTable}
              hideNewButton={true}
              isStudentRole={isStudentRole}
            />
          )}
        </Colxx>
      </Row>

      {/* Modal para crear/editar foro (siguiendo estándar) */}
      <Modal isOpen={modalOpen && !isStudentRole} toggle={toggleFormModal} size="lg">
        <ModalHeader toggle={toggleFormModal}>
          {data ? 'Editar Foro' : 'Crear Nuevo Foro'}
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
          <Button color="secondary" onClick={toggleFormModal}>
            Cancelar
          </Button>
          <Button color="primary" onClick={handleSaveForum}>
            {data ? 'Actualizar' : 'Guardar'} Foro
          </Button>
        </ModalFooter>
      </Modal>

      {/* ForumModal para ver detalles y comentarios */}
      <ForumModal
        isOpen={viewModal}
        toggle={toggleViewModal}
        forum={data}
        forumInteractions={forumInteractions}
        loadingForum={loadingForum}
        loadingInteractions={loadingInteractions}
        errorMessage={errorMessage}
        formatDate={formatDate}
        onSaveComment={handleSaveComment}
        onAddQuestion={() => {}} // No implementado
        isStudentRole={isStudentRole}
        onDeleteComment={handleDeleteComment}
        currentUserId={props.loginReducer?.userId}
        reloadInteractions={() => {
          if (data?.id) {
            loadForumInteractions(data.id);
          }
        }}
      />
    </>
  );
};

const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

const mapDispatchToProps = { ...forumActions };

export default connect(mapStateToProps, mapDispatchToProps)(ForumList);
