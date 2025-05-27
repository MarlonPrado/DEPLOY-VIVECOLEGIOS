import React, { useState, useEffect, useRef } from 'react';
import { 
  Modal, ModalHeader, ModalBody, ModalFooter, Button, 
  InputGroup, Input, Alert, Badge
} from 'reactstrap';
import { createNotification } from '../../../../helpers/Notification';
import classnames from 'classnames';
import './ForumModal.css';

interface ForumModalProps {
  isOpen: boolean;
  toggle: () => void;
  forum: any;
  forumInteractions: any[];
  loadingForum: boolean;
  loadingInteractions: boolean;
  errorMessage: string;
  formatDate: (date: string) => string;
  onSaveComment: (comment: string, questionId?: string) => void;
  onAddQuestion: () => void;
  reloadInteractions: () => void;
  isStudentRole: boolean;
  onDeleteComment: (id: string) => void;
  currentUserId: string;
}

const ForumModal = ({
  isOpen,
  toggle,
  forum,
  forumInteractions,
  loadingForum,
  loadingInteractions,
  errorMessage,
  formatDate,
  onSaveComment,
  reloadInteractions,
  isStudentRole,
  onDeleteComment,
  currentUserId
}: ForumModalProps) => {
  const [newComment, setNewComment] = useState('');
  const commentInputRef = useRef<HTMLInputElement>(null);
  const initialLoadDone = useRef(false);

  // Filtrar solo los comentarios (no preguntas ni respuestas)
  const comments = Array.isArray(forumInteractions) 
    ? forumInteractions.filter(interaction => !interaction.node?.forumQuestion)
    : [];

  // Efecto para cargar comentarios cuando se abre el modal
  useEffect(() => {
    if (isOpen && forum?.id) {
      setNewComment('');
      
      if (!initialLoadDone.current) {
        reloadInteractions();
        initialLoadDone.current = true;
      }
    }
    
    if (!isOpen) {
      initialLoadDone.current = false;
    }
  }, [isOpen, forum?.id, reloadInteractions]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSaveComment();
    }
  };

  console.log('Estado del foro:', {
    rawValue: forum?.active,
    typeOf: typeof forum?.active,
    booleanValue: Boolean(forum?.active)
  });

  const handleSaveComment = () => {
    if (!newComment.trim()) return;
    onSaveComment(newComment);
    setNewComment('');
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      wrapClassName="modal-right"
      backdrop="static"
      size="lg"
      className="forum-modal"
    >
      <ModalHeader toggle={toggle}>
        <div className="d-flex align-items-center">
          <i className="iconsminds-speach-bubble-dialog mr-2"></i>
          <div className="forum-header-content">
            <h5 className="mb-0">{loadingForum ? 'Cargando...' : forum?.name}</h5>
            {(forum?.active === true || forum?.active === "true") ? (
              <Badge color="primary" pill className="status-badge">Activo</Badge>
            ) : (
              <Badge color="light" pill className="status-badge">Inactivo</Badge>
            )}
          </div>
        </div>
      </ModalHeader>
      
      <ModalBody>
        {loadingForum && !errorMessage && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Cargando...</span>
            </div>
            <p className="mt-3 text-muted">Cargando información del foro...</p>
          </div>
        )}
        
        {errorMessage && (
          <Alert color="danger" className="d-flex align-items-center">
            <i className="simple-icon-exclamation mr-3 font-size-lg"></i>
            <div>{errorMessage}</div>
          </Alert>
        )}
        
        {!loadingForum && (
          <>
            <div className="forum-details mb-4">
              <h6 className="section-title">Descripción</h6>
              <p className="border-bottom pb-3 forum-description-text">{forum?.description || 'Sin descripción'}</p>
              
              <h6 className="section-title">Detalles</h6>
              <div className="details-content border-bottom pb-3">
                {forum?.details ? (
                  <div className="formatted-content forum-details-text">{forum.details}</div>
                ) : (
                  <p className="text-muted">No hay detalles disponibles</p>
                )}
              </div>
              
              <div className="mt-3 d-flex justify-content-between">
                <div>
                  <small className="text-muted d-block">Creación: {forum?.createdAt ? formatDate(forum.createdAt) : '-'}</small>
                  <small className="text-muted d-block">Actualización: {forum?.updatedAt ? formatDate(forum.updatedAt) : '-'}</small>
                </div>
                <div>
                  <small className="text-muted d-block text-right">
                    Creado por: {forum?.createdByUser?.name ? 
                      `${forum.createdByUser.name} ${forum.createdByUser.lastName || ''}` : '-'}
                  </small>
                </div>
              </div>
            </div>
            
            <div className="comments-section mt-4">
              <h6 className="comment-section-title d-flex justify-content-between align-items-center">
                <span>Comentarios ({Array.isArray(forumInteractions) ? 
                  forumInteractions.filter(interaction => !interaction.node?.forumQuestion).length : 0})</span>
              </h6>
              
              <div className="comments-list mt-3" style={{maxHeight: "350px", overflowY: "auto"}}>
                {loadingInteractions ? (
                  <div className="text-center py-4">
                    <div className="spinner-border spinner-border-sm text-primary" role="status">
                      <span className="sr-only">Cargando...</span>
                    </div>
                    <p className="mt-2 text-muted small">Cargando comentarios...</p>
                  </div>
                ) : (Array.isArray(forumInteractions) && forumInteractions.filter(interaction => !interaction.node?.forumQuestion).length > 0) ? (
                  forumInteractions
                    .filter(interaction => !interaction.node?.forumQuestion)
                    .map((interaction: any, index: number) => (
                      <div key={interaction.node?.id || index} className="comment-card mb-3">
                        <div className="comment-header d-flex justify-content-between">
                          <div className="d-flex align-items-center">
                            <div className="user-avatar">
                              {interaction.node?.createdByUser?.name?.[0] || 'U'}
                              {interaction.node?.createdByUser?.lastName?.[0] || ''}
                            </div>
                            <div>
                              <div className="user-name">
                                {interaction.node?.createdByUser ? 
                                  `${interaction.node.createdByUser.name || ''} ${interaction.node.createdByUser.lastName || ''}`.trim() 
                                  : 'Usuario'
                                }
                              </div>
                              <small className="text-muted">
                                {interaction.node?.createdAt ? formatDate(interaction.node.createdAt) : '-'}
                              </small>
                            </div>
                          </div>
                          
                          {(!isStudentRole || (isStudentRole && interaction.node?.createdByUserId === currentUserId)) && (
                            <Button 
                              color="link" 
                              className="p-0 text-danger" 
                              onClick={() => onDeleteComment(interaction.node?.id)}
                              title="Eliminar comentario"
                            >
                              <i className="simple-icon-trash"></i>
                            </Button>
                          )}
                        </div>
                        <div className="comment-body mt-2">
                          {interaction.node?.comment || 'Sin contenido'}
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="text-center py-4">
                    <div className="empty-state-icon">
                      <i className="simple-icon-bubble"></i>
                    </div>
                    <p className="mt-2 mb-0">No hay comentarios</p>
                    <small className="text-muted">Sé el primero en comentar</small>
                  </div>
                )}
              </div>
            </div>

            {/* Botón de salir FUERA de la sección de comentarios */}
            <div className="exit-button-container">
              <Button 
                color="secondary" 
                block 
                outline 
                onClick={toggle}
                className="exit-button mt-4"
              >
                Salir de comentario
              </Button>
            </div>
          </>
        )}
      </ModalBody>
      
      <ModalFooter className="p-0">
        <div className="comment-input-area p-3 w-100">
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
          <small className="text-muted d-block mt-1">Presiona Enter para enviar</small>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default ForumModal;