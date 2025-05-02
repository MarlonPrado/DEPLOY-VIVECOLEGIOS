import React, { useState, useEffect, useRef } from 'react';
import { 
  Modal, ModalHeader, ModalBody, ModalFooter, Button, 
  Nav, NavItem, TabContent, TabPane, Card, CardBody, 
  InputGroup, Input, Alert, Badge
} from 'reactstrap';
import { createNotification } from '../../../../helpers/Notification';
import classnames from 'classnames';
import './ForumModal.css';
import ForumQuestionModal from './ForumQuestionModal';

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
  reloadInteractions: () => void; // Agregar esta línea
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
  onAddQuestion,
  reloadInteractions // Asegúrate de incluirla aquí también
}: ForumModalProps) => {
  const [activeTab, setActiveTab] = useState('1');
  const [newComment, setNewComment] = useState('');
  const [replyToQuestion, setReplyToQuestion] = useState<string | null>(null);
  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const commentInputRef = useRef<HTMLInputElement>(null);
  const replyInputRef = useRef<HTMLInputElement>(null);

  // Modifica la parte donde filtramos los comentarios - OPCIÓN 1: Asegurarse que forumInteractions es un array
  // Esta versión verifica explícitamente si forumInteractions es un array
  const comments = Array.isArray(forumInteractions) 
    ? forumInteractions.filter(interaction => !interaction.node?.forumQuestion)
    : [];

  console.log('🔍 Comments array final:', comments.length, comments);

  // OPCIÓN 2: Si el problema está en la estructura anidada - Intentar acceder a los datos correctamente
  // Descomentar esta línea si la estructura es data.edges en lugar de un array directo
  // const comments = forumInteractions?.data?.edges?.filter(interaction => !interaction.node?.forumQuestion) || [];

  // Agrupar preguntas y sus respuestas
  const questionsMap = new Map();
  const answers = forumInteractions?.filter(interaction => 
    interaction.node?.forumQuestion
  ) || [];
  
  answers.forEach(answer => {
    const questionId = answer.node?.forumQuestion?.id;
    if (questionId) {
      if (!questionsMap.has(questionId)) {
        questionsMap.set(questionId, {
          question: {
            id: questionId,
            name: answer.node?.forumQuestion?.name,
            forumId: answer.node?.forumQuestion?.forumId
          },
          answers: []
        });
      }
      questionsMap.get(questionId).answers.push(answer);
    }
  });
  
  const questions = Array.from(questionsMap.values());

  // Reset state when modal opens with new forum
  useEffect(() => {
    if (isOpen) {
      setActiveTab('1');
      setNewComment('');
      setReplyToQuestion(null);
    }
  }, [isOpen, forum?.id]);

  // Añadir este efecto para cargar comentarios cuando se abre el modal
  const initialLoadDone = useRef(false);

  useEffect(() => {
    if (isOpen && forum?.id) {
      // Resetear estados cuando se abre un nuevo foro
      setActiveTab('1'); // Volver a la pestaña de detalles por defecto
      setNewComment('');
      setReplyToQuestion(null);
      
      // Cargar comentarios SOLO al abrir el modal y solo si no se han cargado
      if (!initialLoadDone.current) {
        console.log('🚀 MODAL ABIERTO (carga inicial) - Forum ID:', forum.id);
        reloadInteractions();
        initialLoadDone.current = true;
      }
    }
    
    // Resetear el flag cuando se cierra el modal
    if (!isOpen) {
      initialLoadDone.current = false;
    }
  }, [isOpen, forum?.id]);

  const toggleTab = (tab: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (activeTab !== tab) {
      console.log(`🔄 Cambiando a pestaña ${tab}`);
      
      // Cargamos datos solo al cambiar a una pestaña específica y si no tenemos datos
      if ((tab === '2' || tab === '3' || tab === '4') && forum?.id) {
        // Verificar si necesitamos recargar (si no hay datos o si queremos forzar la recarga)
        const needsReload = 
          (tab === '2' && (!comments || comments.length === 0)) || 
          (tab === '3' && (!questions || questions.length === 0)) || 
          (tab === '4' && (!answers || answers.length === 0));
        
        if (needsReload) {
          console.log(`🔄 PESTAÑA ${tab} - Cargando datos porque no hay disponibles`);
          reloadInteractions();
        } else {
          console.log(`🔄 PESTAÑA ${tab} - Usando datos existentes, sin recargar`);
        }
      }
      
      setActiveTab(tab);
    }
  };

  // Manejar la pulsación de Enter para enviar el comentario
  const handleKeyPress = (e: React.KeyboardEvent, isReply = false) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (isReply) {
        handleSaveReply();
      } else {
        handleSaveComment();
      }
    }
  };

  const handleSaveComment = () => {
    if (!newComment.trim()) return;
    onSaveComment(newComment);
    setNewComment('');
  };

  const handleSaveReply = () => {
    if (!replyToQuestion || !newComment.trim()) return;
    onSaveComment(newComment, replyToQuestion);
    setNewComment('');
    setReplyToQuestion(null);
  };

  const startReplyToQuestion = (questionId: string) => {
    setReplyToQuestion(questionId);
    setNewComment('');
    setTimeout(() => {
      if (replyInputRef.current) {
        replyInputRef.current.focus();
      }
    }, 100);
  };

  const cancelReply = () => {
    setReplyToQuestion(null);
    setNewComment('');
  };

  // Permite renderizar fórmulas matemáticas en texto
  const renderFormattedText = (text: string) => {
    if (!text) return 'Sin contenido';
    
    // Si el texto contiene fórmulas matemáticas, simplemente lo mostramos como está
    return text;
  };

  // Contar comentarios y respuestas para mostrar en las pestañas
  const commentCount = comments.length;
  const questionCount = questions.length;
  const answerCount = answers.length;

  return (
    <>
      <Modal isOpen={isOpen} toggle={toggle} size="lg" className="forum-modal">
        {/* Encabezado con estilo corporativo */}
        <div className="forum-header">
          <Button 
            close 
            onClick={toggle}
            className="modal-close-button"
          />
          <h3 className="forum-title">
            {loadingForum ? 'Cargando...' : forum?.name || 'Detalles del foro'}
          </h3>
          <p className="forum-description">
            {loadingForum ? '' : forum?.description || ''}
          </p>
        </div>
        
        {/* Navegación por pestañas */}
        <Nav tabs className="forum-tabs">
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
              Comentarios {commentCount > 0 && (
                <Badge color="primary" pill>{commentCount}</Badge>
              )}
            </a>
          </NavItem>
          <NavItem>
            <a
              className={classnames({ active: activeTab === '3' }, 'nav-link')}
              onClick={(e) => toggleTab('3', e)}
              href="#tab3"
              role="button"
            >
              Preguntas {questionCount > 0 && (
                <Badge color="primary" pill>{questionCount}</Badge>
              )}
            </a>
          </NavItem>
          <NavItem>
            <a
              className={classnames({ active: activeTab === '4' }, 'nav-link')}
              onClick={(e) => toggleTab('4', e)}
              href="#tab4"
              role="button"
            >
              Respuestas {answerCount > 0 && (
                <Badge color="primary" pill>{answerCount}</Badge>
              )}
            </a>
          </NavItem>
        </Nav>
        
        <ModalBody>
          {loadingForum && !errorMessage && (
            <div className="loading-container">
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Cargando...</span>
              </div>
              <p>Cargando información del foro...</p>
            </div>
          )}
          
          {errorMessage && (
            <Alert color="danger">
              <i className="simple-icon-exclamation mr-2"></i>
              {errorMessage}
            </Alert>
          )}
          
          {!loadingForum && (
            <TabContent activeTab={activeTab} className="forum-tab-content">
              {/* Tab de Detalles */}
              <TabPane tabId="1">
                <div className="info-section">
                  <h5 className="section-title">Descripción</h5>
                  <p>{forum?.description || 'Sin descripción'}</p>
                </div>
                
                <div className="info-section">
                  <h5 className="section-title">Detalles</h5>
                  <div className="details-box">
                    {forum?.details ? (
                      <div className="details-content">
                        {forum.details}
                      </div>
                    ) : (
                      <p className="no-details">No hay detalles disponibles</p>
                    )}
                  </div>
                </div>
                
                <div className="info-section">
                  <h5 className="section-title">Información adicional</h5>
                  <div className="table-responsive">
                    <table className="info-table">
                      <tbody>
                        <tr>
                          <th>Estado</th>
                          <td>
                            {forum?.active ? (
                              <span className="status status-active">Activo</span>
                            ) : (
                              <span className="status status-inactive">Inactivo</span>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <th>Fecha de creación</th>
                          <td>{forum?.createdAt ? formatDate(forum.createdAt) : '-'}</td>
                        </tr>
                        <tr>
                          <th>Última actualización</th>
                          <td>{forum?.updatedAt ? formatDate(forum.updatedAt) : '-'}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabPane>
              
              {/* Tab de Comentarios */}
              <TabPane tabId="2">
                <div className="comments-section">
                  {/* Área de mensajes con scroll */}
                  <div className="comments-list">
                    {loadingInteractions ? (
                      <div className="loading-container">
                        <div className="spinner-border text-primary mb-3" role="status">
                          <span className="sr-only">Cargando...</span>
                        </div>
                        <p>Cargando comentarios...</p>
                      </div>
                    ) : comments.length > 0 ? (
                      comments.map((interaction: any, index: number) => (
                        <div key={interaction.node?.id || index} className="comment-item">
                          <div className="comment-avatar">
                            {interaction.node?.createdByUser?.name?.[0] || 'U'}
                            {interaction.node?.createdByUser?.lastName?.[0] || ''}
                          </div>
                          <div className="comment-content">
                            <div className="comment-header">
                              <h6 className="comment-author">
                                {interaction.node?.createdByUser ? 
                                  `${interaction.node.createdByUser.name || ''} ${interaction.node.createdByUser.lastName || ''}`.trim() 
                                  : 'Usuario'
                                }
                              </h6>
                              <span className="comment-date">
                                {interaction.node?.createdAt ? formatDate(interaction.node.createdAt) : '-'}
                              </span>
                            </div>
                            <p className="comment-text">
                              {interaction.node?.comment || 'Sin contenido'}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="empty-state">
                        <i className="simple-icon-bubble"></i>
                        <h5>No hay comentarios</h5>
                        <p>Sé el primero en comentar en este foro</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Área de entrada de texto */}
                  <div className="comment-input-area">
                    <InputGroup>
                      <Input
                        type="text"
                        placeholder="Escribe un comentario..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyPress={(e) => handleKeyPress(e, false)}
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
                    <small className="comment-help-text">Presiona Enter para enviar</small>
                  </div>
                </div>
              </TabPane>
              
              {/* Tab de Preguntas */}
              <TabPane tabId="3">
                <div className="questions-section">
                  <div className="questions-header">
                    <h5>Preguntas del foro</h5>
                    <Button 
                      color="primary" 
                      onClick={() => setQuestionModalOpen(true)}
                    >
                      <i className="simple-icon-plus mr-2"></i>
                      Nueva Pregunta
                    </Button>
                  </div>
                  
                  {loadingInteractions ? (
                    <div className="loading-container">
                      <div className="spinner-border text-primary mb-3" role="status">
                        <span className="sr-only">Cargando...</span>
                      </div>
                      <p>Cargando preguntas...</p>
                    </div>
                  ) : questions.length > 0 ? (
                    <div className="questions-list">
                      {questions.map((item, index) => (
                        <Card key={item.question.id || index} className="mb-3 question-card">
                          <CardBody className="pb-2">
                            <div className="question-header">
                              <h5 className="question-title">{item.question.name}</h5>
                              <Button 
                                color="light" 
                                size="sm" 
                                className="reply-btn"
                                onClick={() => startReplyToQuestion(item.question.id)}
                              >
                                <i className="simple-icon-action-redo mr-1"></i>
                                Responder
                              </Button>
                            </div>
                            
                            <div className="question-answers mt-3">
                              <h6 className="answers-title">
                                <i className="simple-icon-bubble mr-1"></i>
                                Respuestas ({item.answers.length})
                              </h6>
                              
                              {item.answers.length > 0 ? (
                                item.answers.map((answer: any, ansIndex: number) => (
                                  <div key={answer.node?.id || ansIndex} className="answer-item">
                                    <div className="comment-avatar answer-avatar">
                                      {answer.node?.createdByUser?.name?.[0] || 'U'}
                                      {answer.node?.createdByUser?.lastName?.[0] || ''}
                                    </div>
                                    <div className="answer-content">
                                      <div className="answer-header">
                                        <h6 className="comment-author">
                                          {answer.node?.createdByUser ? 
                                            `${answer.node.createdByUser.name || ''} ${answer.node.createdByUser.lastName || ''}`.trim() 
                                            : 'Usuario'
                                          }
                                        </h6>
                                        <span className="comment-date">
                                          {answer.node?.createdAt ? formatDate(answer.node.createdAt) : '-'}
                                        </span>
                                      </div>
                                      <p className="answer-text">
                                        {renderFormattedText(answer.node?.comment)}
                                      </p>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <p className="no-answers">Sin respuestas aún</p>
                              )}
                            </div>
                            
                            {/* Área de respuesta a pregunta específica */}
                            {replyToQuestion === item.question.id && (
                              <div className="reply-input mt-3">
                                <div className="d-flex align-items-center mb-2">
                                  <Badge color="info" className="mr-2">Respondiendo</Badge>
                                  <small className="text-muted flex-grow-1">
                                    Escribiendo respuesta para: {item.question.name}
                                  </small>
                                  <Button close onClick={cancelReply} />
                                </div>
                                <InputGroup>
                                  <Input
                                    type="text"
                                    placeholder="Escribe tu respuesta..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    onKeyPress={(e) => handleKeyPress(e, true)}
                                    innerRef={replyInputRef}
                                    disabled={loadingInteractions}
                                  />
                                  <Button 
                                    color="primary" 
                                    onClick={handleSaveReply}
                                    disabled={loadingInteractions || !newComment.trim()}
                                  >
                                    {loadingInteractions ? (
                                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    ) : (
                                      <i className="simple-icon-paper-plane"></i>
                                    )}
                                  </Button>
                                </InputGroup>
                              </div>
                            )}
                          </CardBody>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">
                      <i className="iconsminds-mail-question"></i>
                      <h5>No hay preguntas</h5>
                      <p>Añade la primera pregunta a este foro</p>
                    </div>
                  )}
                </div>
              </TabPane>
              
              {/* Tab de Respuestas */}
              <TabPane tabId="4">
                <div className="answers-section">
                  <h5>Todas las respuestas ({answers.length})</h5>
                  
                  {loadingInteractions ? (
                    <div className="loading-container">
                      <div className="spinner-border text-primary mb-3" role="status">
                        <span className="sr-only">Cargando...</span>
                      </div>
                      <p>Cargando respuestas...</p>
                    </div>
                  ) : answers.length > 0 ? (
                    <div className="answers-list">
                      {answers.map((answer: any, index: number) => (
                        <Card key={answer.node?.id || index} className="mb-3">
                          <CardBody>
                            <div className="answer-meta">
                              <Badge color="info" className="mb-2">
                                Respuesta a: {answer.node?.forumQuestion?.name}
                              </Badge>
                            </div>
                            <div className="d-flex">
                              <div className="comment-avatar">
                                {answer.node?.createdByUser?.name?.[0] || 'U'}
                                {answer.node?.createdByUser?.lastName?.[0] || ''}
                              </div>
                              <div className="comment-content">
                                <div className="comment-header">
                                  <h6 className="comment-author">
                                    {answer.node?.createdByUser ? 
                                      `${answer.node.createdByUser.name || ''} ${answer.node.createdByUser.lastName || ''}`.trim() 
                                      : 'Usuario'
                                    }
                                  </h6>
                                  <span className="comment-date">
                                    {answer.node?.createdAt ? formatDate(answer.node.createdAt) : '-'}
                                  </span>
                                </div>
                                <p className="comment-text">
                                  {renderFormattedText(answer.node?.comment)}
                                </p>
                                <Button 
                                  color="light" 
                                  size="sm" 
                                  className="mt-2"
                                  onClick={() => startReplyToQuestion(answer.node?.forumQuestion?.id)}
                                >
                                  <i className="simple-icon-action-redo mr-1"></i>
                                  Responder a esta pregunta
                                </Button>
                              </div>
                            </div>
                          </CardBody>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">
                      <i className="iconsminds-speach-bubble-dialog"></i>
                      <h5>No hay respuestas</h5>
                      <p>Aún no hay respuestas a las preguntas</p>
                    </div>
                  )}
                </div>
              </TabPane>
            </TabContent>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>
            Cerrar
          </Button>
        </ModalFooter>
      </Modal>

      {/* Modal para añadir preguntas */}
      <ForumQuestionModal 
        isOpen={questionModalOpen}
        toggle={() => setQuestionModalOpen(!questionModalOpen)}
        forumId={forum?.id}
        onSuccess={() => {
          setQuestionModalOpen(false);
          reloadInteractions();
        }}
      />
    </>
  );
};

export default ForumModal;