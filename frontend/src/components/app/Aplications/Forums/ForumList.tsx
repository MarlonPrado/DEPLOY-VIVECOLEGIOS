import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Button, Card, CardBody, Row, Modal, ModalHeader, 
  ModalBody, ModalFooter, FormGroup, Label, Input, Nav, 
  NavItem, TabContent, TabPane 
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
  const [currentForum, setCurrentForum] = useState(null);
  const [activeTab, setActiveTab] = useState('1');
  
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

  // Función para cargar foros
  const loadForums = async (defaultSchoolId: string | null = null) => {
    setIsLoading(true);
    try {
      // Usar el schoolId de la URL o el valor por defecto
      const schoolIdToUse = schoolId || defaultSchoolId;
      if (!schoolIdToUse) {
        throw new Error("ID de institución no encontrado");
      }
      
      // Cargar todos los foros sin filtrar por courseId inicialmente
      const result = await props.getListAllForum(schoolIdToUse);
      console.log("Foros cargados:", result);
      
      // Por ahora, mostrar todos los foros sin filtro
      setItems(result || []);
    } catch (error) {
      console.error("Error al cargar foros:", error);
      createNotification('error', 'Error', 'No se pudieron cargar los foros');
      setItems([]);
    } finally {
      setIsLoading(false);
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
      
      // Corregido: Crear el objeto dataToSave con los campos correctos según el esquema
      const dataToSave: any = {
        name: formData.name,
        description: formData.description,
        details: formData.details,
        schoolId: schoolId || props.loginReducer.schoolId,
        academicAsignatureCourseId: courseId || null,  // Cambiado de courseId a academicAsignatureCourseId
        schoolYearId: props.loginReducer.schoolYear
      };

      // Agregar campusId solo si existe
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
        // Corregir el llamado a deleteForum para incluir showToast
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
                        Creado: {new Date(item.node.createdAt).toLocaleString()}
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

      {/* Modal para ver foro - Corregido el comportamiento de las pestañas */}
      <Modal isOpen={viewModal} toggle={() => setViewModal(!viewModal)} size="lg">
        <ModalHeader toggle={() => setViewModal(!viewModal)}>
          {currentForum?.name}
        </ModalHeader>
        <ModalBody>
          <Nav tabs>
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
                      <th>Fecha de creación</th>
                      <td>{currentForum?.createdAt ? new Date(currentForum.createdAt).toLocaleString() : '-'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </TabPane>
            <TabPane tabId="2">
              <div className="mb-4">
                <h5>Comentarios</h5>
                {/* Datos quemados para comentarios */}
                <Card className="mb-3">
                  <CardBody>
                    <div className="d-flex">
                      <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mr-3" style={{width: 40, height: 40}}>JP</div>
                      <div>
                        <h6 className="mb-1">Juan Pérez</h6>
                        <p className="mb-2">Excelente foro, me ha servido mucho para comprender mejor los conceptos.</p>
                        <small className="text-muted">Hace 2 días</small>
                      </div>
                    </div>
                  </CardBody>
                </Card>
                <Card className="mb-3">
                  <CardBody>
                    <div className="d-flex">
                      <div className="rounded-circle bg-info text-white d-flex align-items-center justify-content-center mr-3" style={{width: 40, height: 40}}>MR</div>
                      <div>
                        <h6 className="mb-1">María Rodríguez</h6>
                        <p className="mb-2">Tengo una duda sobre el tema planteado. ¿Podríamos profundizar en la segunda parte?</p>
                        <small className="text-muted">Hace 1 día</small>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </TabPane>
            <TabPane tabId="3">
              <div className="mb-4">
                <h5>Preguntas del foro</h5>
                {/* Datos quemados para preguntas */}
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
            <TabPane tabId="4">
              <div className="mb-4">
                <h5>Respuestas a preguntas</h5>
                {/* Datos quemados para respuestas */}
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
