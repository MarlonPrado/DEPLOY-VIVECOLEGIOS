import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { Alert, Spinner, Input, Label, Button, FormGroup, ModalBody, ModalFooter } from 'reactstrap';
import * as forumActions from '../../../../stores/actions/ForumAction';
import { createNotification } from '../../../../helpers/Notification';
import AddNewModal from '../../../common/Data/AddNewModal';
import CreateEditAuditInformation from '../../../common/Data/CreateEditAuditInformation';

// Interface siguiendo el estándar de la aplicación
interface ForumDetailsModalProps {
  modalOpen: boolean;
  toggleModal: () => void;
  data: any; // Forum data
  isStudentRole: boolean;
  refreshDataTable: () => void;
  // Props de Redux mapeadas
  currentUserId: string;
  // Redux actions
  dataForumInteraction: (id: string) => Promise<any>;
  saveIntetactionForum: (data: any) => Promise<any>;
  deleteForumInteraction: (id: string, refresh: boolean) => Promise<any>; 
}

const ForumDetailsModal = (props: ForumDetailsModalProps) => {
  // Estados estándar
  const [loading, setLoading] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [interactions, setInteractions] = useState([]);
  const [error, setError] = useState('');
  const [comment, setComment] = useState('');
  const [commentError, setCommentError] = useState('');
  
  // Efecto para cargar interacciones cuando se abre el modal, siguiendo el patrón estándar
  useEffect(() => {
    if (props.modalOpen && props.data?.id) {
      loadInteractions(props.data.id);
    } else {
      setInteractions([]);
      setComment('');
      setCommentError('');
    }
  }, [props.modalOpen, props.data]);

  // Función para cargar interacciones/comentarios
  const loadInteractions = useCallback(async (forumId: string) => {
    if (!forumId) return;
    
    setLoadingComments(true);
    setError('');
    
    try {
      const result = await props.dataForumInteraction(forumId);
      
      if (result && result.data) {
        const interactionsArray = result.data.edges || [];
        setInteractions(interactionsArray);
      } else {
        setInteractions([]);
      }
    } catch (err) {
      console.error("Error al cargar interacciones:", err);
      setError('No se pudieron cargar los comentarios. Por favor intente nuevamente.');
    } finally {
      setLoadingComments(false);
    }
  }, [props.dataForumInteraction]);

  // Guardar comentario - Adaptado al estándar
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación estándar
    if (!comment.trim()) {
      setCommentError('El comentario es requerido');
      return;
    }

    if (comment.trim().length < 3) {
      setCommentError('El comentario debe tener al menos 3 caracteres');
      return;
    }
    
    if (!props.data?.id) return;
    
    setLoading(true);
    setError('');
    setCommentError('');
    
    try {
      const commentData = {
        comment,
        forumId: props.data.id
      };
      
      await props.saveIntetactionForum(commentData);
      createNotification('success', 'Éxito', 'Comentario guardado correctamente');
      
      // Recargar comentarios y resetear formulario
      await loadInteractions(props.data.id);
      setComment('');
      
      // Actualizar la lista de foros
      if (typeof props.refreshDataTable === 'function') {
        props.refreshDataTable();
      }
    } catch (err) {
      console.error("Error al guardar comentario:", err);
      setError('No se pudo guardar el comentario. Por favor intente nuevamente.');
      createNotification('error', 'Error', 'No se pudo guardar el comentario');
    } finally {
      setLoading(false);
    }
  };

  // Eliminar comentario (siguiendo el patrón estándar)
  const handleDeleteComment = useCallback(async (commentId: string) => {
    if (!window.confirm('¿Está seguro que desea eliminar este comentario?')) {
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await props.deleteForumInteraction(commentId, true);
      createNotification('success', 'Éxito', 'Comentario eliminado correctamente');
      
      if (props.data?.id) {
        await loadInteractions(props.data.id);
        
        // Actualizar la lista de foros
        if (typeof props.refreshDataTable === 'function') {
          props.refreshDataTable();
        }
      }
    } catch (err) {
      console.error("Error al eliminar comentario:", err);
      createNotification('error', 'Error', 'No se pudo eliminar el comentario');
      setError('No se pudo eliminar el comentario. Por favor intente nuevamente.');
    } finally {
      setLoading(false);
    }
  }, [props.data?.id, props.deleteForumInteraction, loadInteractions, props.refreshDataTable]);

  // Formatear fecha (utilidad estándar)
  const formatDate = useCallback((dateString: string) => {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  // Solo mostrar formulario de comentario si no es estudiante
  const showCommentForm = !props.isStudentRole;

  // Usar AddNewModal como en StandardCreateEdit
  return (
    <AddNewModal
      modalOpen={props.modalOpen}
      toggleModal={props.toggleModal}
      handleSubmit={handleSubmit}
      loading={loading}
      data={props.data}
      title="Detalles del Foro"
      mainTitle={props.data?.name || ''}
      hideSubmitButton={!showCommentForm}
      submitButtonText="Guardar Comentario"
    >
      <ModalBody>
        {props.data && (
          <>
            {/* Sección de Detalles del Foro - Siguiendo la estructura estándar */}
            <div className="form-group">
              <h5>Descripción</h5>
              <p className="forum-description">{props.data.description}</p>
            </div>
            
            <div className="form-group">
              <h5>Detalles</h5>
              <div className="p-3 bg-light rounded">
                {props.data.details || 'Sin detalles adicionales'}
              </div>
            </div>
            
            {/* Sección de Comentarios - Siguiendo el estándar */}
            <div className="form-group mt-4">
              <h5>Comentarios</h5>
              
              {error && (
                <Alert color="danger" className="mb-4">
                  {error}
                </Alert>
              )}
              
              {loadingComments ? (
                <div className="text-center my-4">
                  <Spinner color="primary" size="sm" />
                  <p className="mt-2 text-muted">Cargando comentarios...</p>
                </div>
              ) : interactions.length > 0 ? (
                <div className="comments-list mb-4">
                  {interactions.map((interaction: any, index: number) => (
                    <div key={interaction.node?.id || index} className="p-3 border rounded mb-3">
                      <div className="d-flex justify-content-between">
                        <div>
                          <strong>
                            {interaction.node?.createdByUser ? 
                              `${interaction.node.createdByUser.name || ''} ${interaction.node.createdByUser.lastName || ''}`.trim() 
                              : 'Usuario'
                            }
                          </strong>
                        </div>
                        <div className="d-flex align-items-center">
                          <small className="text-muted mr-2">
                            {interaction.node?.createdAt ? formatDate(interaction.node.createdAt) : '-'}
                          </small>
                          
                          {/* Botón para eliminar comentario - Siguiendo el estándar */}
                          {(props.currentUserId === interaction.node?.createdByUser?.id || 
                            !props.isStudentRole) && (
                            <Button 
                              color="link" 
                              className="p-0 text-danger" 
                              onClick={() => handleDeleteComment(interaction.node?.id)}
                              disabled={loading}
                            >
                              <i className="simple-icon-trash"></i>
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="mt-2">
                        {interaction.node?.comment || 'Sin contenido'}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center my-4">
                  <p className="text-muted">No hay comentarios aún.</p>
                </div>
              )}
            </div>
            
            {/* Formulario para comentar (siguiendo el patrón estándar) */}
            {showCommentForm && (
              <FormGroup className="mt-4">
                <Label for="comment">Escribe un comentario</Label>
                <Input
                  type="textarea"
                  id="comment"
                  rows={3}
                  placeholder="Escribe tu comentario aquí..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  invalid={!!commentError}
                  disabled={loadingComments}
                />
                {commentError && (
                  <div className="invalid-feedback d-block">
                    {commentError}
                  </div>
                )}
              </FormGroup>
            )}
          </>
        )}
      </ModalBody>
      
      {/* Footer con información de auditoría como en StandardCreateEdit */}
      {props.data?.id && (
        <ModalFooter className="p-3">
          <CreateEditAuditInformation
            created_at={props.data.createdAt}
            updated_at={props.data.updatedAt}
            created_by={props.data.createdByUser?.name}
            updated_by={props.data.updatedByUser?.name}
          />
        </ModalFooter>
      )}
    </AddNewModal>
  );
};

const mapStateToProps = ({ loginReducer }: any) => ({
  currentUserId: loginReducer?.userId
});

export default connect(mapStateToProps, { ...forumActions })(ForumDetailsModal);