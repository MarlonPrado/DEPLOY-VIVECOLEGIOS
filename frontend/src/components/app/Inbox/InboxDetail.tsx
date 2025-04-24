import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { 
  Button, 
  Card, 
  CardBody, 
  Badge, 
  Modal, 
  ModalHeader, 
  ModalBody, 
  ModalFooter,
  Row,
  Col
} from 'reactstrap';
import moment from 'moment';
import 'moment/locale/es';
import { Loader } from '../../common/Loader';
import IntlMessages from '../../../helpers/IntlMessages';
import * as inboxActions from '../../../stores/actions/InboxAction';
import * as notificationActions from '../../../stores/actions/NotificationAction';
import { Colxx } from '../../common/CustomBootstrap';
import InboxCreate from './InboxCreate';
import { createNotification } from '../../../helpers/Notification';
import svgEmpty from '../../../assets/img/svg/scene-inbox-empty.svg';
import defaultAvatar from '../../../assets/img/profiles/l-1.jpg';

// Definir interfaces para mejorar la tipificación
interface InboxMessage {
  id: string;
  title: string;
  message: string;
  dateSend: string;
  dateRead: string | null;
  user?: {
    name: string;
    lastName: string;
    profilePhoto?: string;
  };
}

interface InboxProps {
  loginReducer: {
    userId: string;
  };
  getListAllInbox: (userId: string) => Promise<any>;
  updateInbox: (data: any, id: string) => Promise<any>;
  deleteInbox: (id: string) => Promise<any>;
  getListSomeNotification?: (userId: string) => Promise<any>;
  updateNotification?: (data: any, id: string) => Promise<any>;
}

const InboxDetail = (props: InboxProps) => {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<InboxMessage[]>([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<InboxMessage | null>(null);
  
  // Efecto para cargar los mensajes iniciales
  useEffect(() => {
    loadMessages();
    // Configurar locale español para moment
    moment.locale('es');
  }, []);

  // Función para cargar mensajes
  const loadMessages = async () => {
    setLoading(true);
    try {
      const listData = await props.getListAllInbox(props?.loginReducer?.userId);
      
      if (listData && Array.isArray(listData)) {
        setMessages(listData.map((c: any) => c.node));
      } else {
        console.error("Formato de datos incorrecto:", listData);
        setMessages([]);
      }
    } catch (error) {
      console.error("Error al cargar mensajes:", error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  // Función para ver el mensaje completo
  const viewFullMessage = (message: InboxMessage) => {
    setSelectedMessage(message);
    setViewModalOpen(true);
  };

  // Función para marcar un mensaje como leído
  const markAsRead = async (message: InboxMessage) => {
    try {
      // No mostrar acción si ya está leído
      if (message.dateRead) {
        return;
      }

      // Actualizar el mensaje
      await props.updateInbox({ dateRead: new Date() }, message.id);
      
      // Actualizar notificaciones relacionadas
      if (props.getListSomeNotification && props.updateNotification) {
        try {
          const notifications = await props.getListSomeNotification(props.loginReducer.userId);
          
          if (notifications && Array.isArray(notifications)) {
            for (let item of notifications) {
              // Buscar notificaciones relacionadas con este mensaje
              if (item.node.entityId === message.id) {
                await props.updateNotification({ dateRead: new Date() }, item.node.id);
              }
            }
          }
        } catch (notificationError) {
          console.warn("Error actualizando notificaciones:", notificationError);
        }
      }
      
      // Mostrar notificación de éxito
      createNotification('success', 'Mensaje actualizado', 'El mensaje ha sido marcado como leído');
      
      // Actualizar UI
      await loadMessages();
    } catch (error) {
      console.error("Error al marcar como leído:", error);
      createNotification('error', 'Error', 'No se pudo marcar el mensaje como leído');
    }
  };

  // Función para eliminar un mensaje
  const deleteMessage = async (id: string) => {
    try {
      await props.deleteInbox(id);
      
      // Cerrar modal si está abierto
      if (viewModalOpen && selectedMessage?.id === id) {
        setViewModalOpen(false);
        setSelectedMessage(null);
      }
      
      // Mostrar notificación de éxito
      createNotification('success', 'Mensaje eliminado', 'El mensaje ha sido eliminado correctamente');
      
      // Actualizar lista de mensajes
      await loadMessages();
    } catch (error) {
      console.error("Error al eliminar mensaje:", error);
      createNotification('error', 'Error', 'No se pudo eliminar el mensaje');
    }
  };

  // Formato relativo de fechas (hace 2 días, etc)
  const getRelativeTime = (dateString: string) => {
    return moment(dateString).fromNow();
  };
  
  // Formato completo de fecha
  const getFullDate = (dateString: string) => {
    return moment(dateString).format('D [de] MMMM [de] YYYY, HH:mm');
  };

  // Renderizar tarjeta individual de mensaje
  const renderMessageCard = (message: InboxMessage, index: number) => {
    const isUnread = !message.dateRead;
    const senderName = message.user ? `${message.user.name} ${message.user.lastName}` : 'Usuario desconocido';
    const profileImage = message.user?.profilePhoto || defaultAvatar;
    
    // Truncar mensaje a 100 caracteres
    const truncatedMessage = message.message?.length > 100
      ? `${message.message.substring(0, 100)}...`
      : message.message;
    
    return (
      <Colxx xxs="12" md="6" xl="4" key={message.id || index} className="mb-4">
        <Card 
          className={`inbox-card shadow-sm ${isUnread ? 'border-left-accent' : ''}`}
          style={{ cursor: 'pointer' }}
          onClick={() => viewFullMessage(message)}
        >
          <CardBody className="d-flex flex-column">
            <div className="d-flex mb-3">
              <div className="user-avatar mr-2">
                <img 
                  src={profileImage} 
                  alt={senderName}
                  className="img-fluid rounded-circle"
                />
              </div>
              <div className="d-flex flex-column flex-grow-1">
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="m-0 font-weight-bold">{senderName}</h6>
                  {isUnread && (
                    <Badge color="primary" pill className="font-weight-bold ml-1">
                      Nuevo
                    </Badge>
                  )}
                </div>
                <span className="text-muted small">
                  {getRelativeTime(message.dateSend)}
                </span>
              </div>
            </div>
            
            <h6 className="message-title font-weight-bold mb-1">
              {message.title || 'Sin título'}
            </h6>
            
            <p className="message-preview text-muted flex-grow-1">
              {truncatedMessage || 'Sin contenido'}
            </p>
            
            <div className="d-flex justify-content-between mt-2 pt-2 border-top">
              <Button 
                color="outline-primary" 
                size="sm" 
                onClick={(e) => {
                  e.stopPropagation();
                  viewFullMessage(message);
                }}
                className="btn-icon"
                title="Ver mensaje completo"
              >
                <i className="simple-icon-eye mr-1"></i>
                <span className="d-none d-sm-inline">Ver</span>
              </Button>
              
              <Button 
                color="outline-success" 
                size="sm" 
                onClick={(e) => {
                  e.stopPropagation();
                  markAsRead(message);
                }}
                disabled={!isUnread}
                className="btn-icon"
                title="Marcar como leído"
              >
                <i className="simple-icon-check mr-1"></i>
                <span className="d-none d-sm-inline">Leído</span>
              </Button>
              
              <Button 
                color="outline-danger" 
                size="sm" 
                onClick={(e) => {
                  e.stopPropagation();
                  deleteMessage(message.id);
                }}
                className="btn-icon"
                title="Eliminar mensaje"
              >
                <i className="simple-icon-trash mr-1"></i>
                <span className="d-none d-sm-inline">Eliminar</span>
              </Button>
            </div>
          </CardBody>
        </Card>
      </Colxx>
    );
  };

  return (
    <>
      <Row className="mb-4">
        <Colxx xxs="12" className="d-flex justify-content-between align-items-center">
          <h1 className="m-0">
            <i className="iconsminds-mail mr-2"></i>
            <IntlMessages id="menu.inbox" />
          </h1>
          <Button
            color="primary"
            size="lg"
            className="btn-shadow"
            onClick={() => setCreateModalOpen(!createModalOpen)}
          >
            <i className="simple-icon-plus mr-2"></i>
            <IntlMessages id="pages.newMessage" />
          </Button>
        </Colxx>
      </Row>

      <div className="separator mb-5"></div>
      
      {/* Pantalla de carga */}
      {loading ? (
        <div className="loading-container d-flex align-items-center justify-content-center py-5">
          <Loader />
        </div>
      ) : (
        <>
          {/* Mensajes o estado vacío */}
          {messages.length > 0 ? (
            <Row>
              {messages.map((message, index) => renderMessageCard(message, index))}
            </Row>
          ) : (
            <Card className="text-center p-5">
              <CardBody>
                <img 
                  src={svgEmpty} 
                  alt="Sin mensajes" 
                  className="img-fluid mb-4" 
                  style={{ maxWidth: '250px' }} 
                />
                <h3 className="font-weight-bold mb-3">Tu bandeja está vacía</h3>
                <p className="text-muted mb-4">
                  Aún no tienes mensajes. Cuando recibas uno, aparecerá aquí.
                </p>
                <Button 
                  color="outline-primary" 
                  size="lg"
                  onClick={() => setCreateModalOpen(true)}
                >
                  <i className="simple-icon-plus mr-2"></i>
                  Enviar un mensaje
                </Button>
              </CardBody>
            </Card>
          )}
          
          {/* Modal para crear mensaje nuevo */}
          <InboxCreate
            modalOpen={createModalOpen}
            getInboxs={loadMessages}
            toggleModal={() => setCreateModalOpen(!createModalOpen)}
          />
          
          {/* Modal para ver mensaje completo */}
          <Modal
            isOpen={viewModalOpen}
            toggle={() => setViewModalOpen(!viewModalOpen)}
            size="lg"
            className="modal-message"
          >
            {selectedMessage && (
              <>
                <ModalHeader toggle={() => setViewModalOpen(false)}>
                  {selectedMessage.title || 'Sin título'}
                </ModalHeader>
                
                <ModalBody>
                  <div className="message-header mb-4 d-flex align-items-center">
                    <div className="user-avatar-lg mr-3">
                      <img 
                        src={selectedMessage.user?.profilePhoto || defaultAvatar} 
                        alt="Remitente" 
                        className="img-fluid rounded-circle"
                      />
                    </div>
                    
                    <div>
                      <h5 className="font-weight-bold mb-1">
                        {selectedMessage.user ? `${selectedMessage.user.name} ${selectedMessage.user.lastName}` : 'Usuario desconocido'}
                      </h5>
                      <div className="text-muted">
                        <i className="simple-icon-calendar mr-2"></i>
                        {getFullDate(selectedMessage.dateSend)}
                      </div>
                      
                      {selectedMessage.dateRead && (
                        <div className="text-muted mt-1">
                          <i className="simple-icon-check mr-2"></i>
                          Leído el {getFullDate(selectedMessage.dateRead)}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="message-content p-4 bg-light rounded">
                    {selectedMessage.message.split('\n').map((line, idx) => (
                      <p key={idx} className={idx > 0 ? 'mb-2' : ''}>
                        {line || <br />}
                      </p>
                    ))}
                  </div>
                </ModalBody>
                
                <ModalFooter>
                  <div className="d-flex justify-content-between w-100">
                    <Button 
                      color="danger" 
                      outline
                      onClick={() => deleteMessage(selectedMessage.id)}
                    >
                      <i className="simple-icon-trash mr-2"></i>
                      Eliminar
                    </Button>
                    
                    <div>
                      {!selectedMessage.dateRead && (
                        <Button 
                          color="success" 
                          className="mr-2"
                          onClick={() => {
                            markAsRead(selectedMessage);
                            setViewModalOpen(false);
                          }}
                        >
                          <i className="simple-icon-check mr-2"></i>
                          Marcar como leído
                        </Button>
                      )}
                      
                      <Button 
                        color="primary" 
                        onClick={() => setViewModalOpen(false)}
                      >
                        Cerrar
                      </Button>
                    </div>
                  </div>
                </ModalFooter>
              </>
            )}
          </Modal>
        </>
      )}
    </>
  );
};

const mapDispatchToProps = { 
  ...inboxActions,
  getListSomeNotification: notificationActions.getListSomeNotification,
  updateNotification: notificationActions.updateNotification
};

const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

export default connect(mapStateToProps, mapDispatchToProps)(InboxDetail);
