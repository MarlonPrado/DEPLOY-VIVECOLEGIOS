import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Badge } from 'reactstrap';
import moment from 'moment';
import 'moment/locale/es';

import { createNotification } from '../../../helpers/Notification';
import * as inboxActions from '../../../stores/actions/InboxAction';
import { Colxx } from '../../common/CustomBootstrap';
import DataListSimple from '../../common/Data/DataListSimple';
import InboxCreate from './InboxCreate';

const InboxDetail = (props: any) => {
  // Estados
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteConfirmModalOpen, setDeleteConfirmModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState('all');

  // Usuario y permisos
  const userRoles = props.loginReducer?.role || {};
  const rolesQuePuedenCrearMensajes = ["DOCENTE", "ADMIN SEDE", "ADMIN COLEGIO", "GENERAL"];
  const canCreateMessage = rolesQuePuedenCrearMensajes.includes(userRoles.name || '');

  // Formateo de fechas
  const formatDate = (dateString: string) => {
    if (!dateString) return 'No disponible';
    moment.locale('es');
    return moment(dateString).format('DD/MM/YYYY HH:mm:ss');
  };

  // Formato corto para tabla
  const formatDateShort = (dateString: string) => {
    if (!dateString) return '-';
    return moment(dateString).format('DD/MM/YYYY');
  };

  // Acortar texto para la tabla
  const truncateText = (text: string, maxLength: number = 50) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Cargar mensajes
  const loadMessages = useCallback(async () => {
    if (!props?.loginReducer?.userId) return Promise.resolve();
    
    setLoading(true);
    try {
      console.log("loginReducer", props.loginReducer);
      const listData = await props.getListAllInbox(props.loginReducer.userId);
      
      if (listData && Array.isArray(listData)) {
        // Mapear mensajes desde la estructura cursor/node
        let mappedMessages = listData.map((item: any) => {
          const messageNode = item.node || item;
          return {
            id: messageNode.id,
            title: messageNode.title || 'Sin título',
            message: messageNode.message || '',
            dateSend: messageNode.dateSend,
            dateRead: messageNode.dateRead,
            createdByUser: messageNode.createdByUser || messageNode.user || { name: 'Sistema' },
            // Mantener referencia al nodo original para compatibilidad
            node: messageNode
          };
        });
        
        // Aplicar filtros
        if (filterStatus === 'read') {
          mappedMessages = mappedMessages.filter(msg => msg.dateRead);
        } else if (filterStatus === 'unread') {
          mappedMessages = mappedMessages.filter(msg => !msg.dateRead);
        }
        
        setMessages(mappedMessages);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error("Error al cargar mensajes:", error);
      createNotification('error', 'Error', 'No se pudo cargar los mensajes');
      setMessages([]);
    } finally {
      setLoading(false);
    }
    
    return Promise.resolve();
  }, [props, filterStatus]);

  // Efecto inicial
  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  // Marcar como leído (con notificación explícita)
  const markAsRead = async (message: any) => {
    if (message.dateRead) return;
    
    try {
      await props.updateInbox({ dateRead: new Date().toISOString() }, message.id, false);
      createNotification('success', 'Mensaje leído', 'El mensaje ha sido marcado como leído');
      
      // Actualizar tanto el mensaje seleccionado como la lista de mensajes
      if (selectedMessage && selectedMessage.id === message.id) {
        setSelectedMessage({...selectedMessage, dateRead: new Date().toISOString()});
      }
      
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === message.id 
            ? { ...msg, dateRead: new Date().toISOString() } 
            : msg
        )
      );
      
      loadMessages(); // Actualizar la lista completa
    } catch (error) {
      createNotification('error', 'Error', 'No se pudo marcar como leído el mensaje');
    }
  };

  // Marcar como leído silenciosamente (sin notificación)
  const markAsReadSilently = async (message: any) => {
    if (message.dateRead) return;
    
    try {
      await props.updateInbox({ dateRead: new Date().toISOString() }, message.id, false);
      
      // Actualizar tanto el mensaje seleccionado como la lista de mensajes
      if (selectedMessage && selectedMessage.id === message.id) {
        setSelectedMessage({...selectedMessage, dateRead: new Date().toISOString()});
      }
      
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === message.id 
            ? { ...msg, dateRead: new Date().toISOString() } 
            : msg
        )
      );
    } catch (error) {
      console.error("Error al marcar mensaje como leído:", error);
    }
  };

  // Ver mensaje
  const viewMessage = (message: any) => {
    setSelectedMessage(message);
    setViewModalOpen(true);
    
    // Marcar como leído silenciosamente al abrir
    if (!message.dateRead) {
      markAsReadSilently(message);
    }
  };

  // Eliminar mensaje
  const deleteMessage = async (id: string) => {
    try {
      await props.deleteInbox(id, true);
      createNotification('success', 'Mensaje eliminado', 'El mensaje ha sido eliminado correctamente');
      setViewModalOpen(false);
      setDeleteConfirmModalOpen(false);
      loadMessages(); 
    } catch (error) {
      createNotification('error', 'Error', 'No se pudo eliminar el mensaje');
    }
  };

  // Eliminar múltiples mensajes
  const deleteSelectedMessages = async () => {
    try {
      const promises = selectedItems.map(item => props.deleteInbox(item.id, false));
      await Promise.all(promises);
      
      createNotification('success', 'Mensajes eliminados', `Se han eliminado ${selectedItems.length} mensajes correctamente`);
      setDeleteConfirmModalOpen(false);
      setViewModalOpen(false);
      
      // Actualizar la lista completa
      loadMessages();
      
      setSelectedItems([]);
    } catch (error) {
      createNotification('error', 'Error', 'No se pudieron eliminar algunos mensajes');
    }
  };

  // Confirmar eliminación
  const confirmDelete = (message: any = null) => {
    if (message) {
      setSelectedMessage(message);
      setSelectedItems([message]);
    }
    setDeleteConfirmModalOpen(true);
  };

  // Crear nuevo mensaje
  const onSubmit = async (dataForm: any) => {
    try {
      await props.saveNewInbox(dataForm);
      setCreateModalOpen(false);
      createNotification('success', 'Mensaje enviado', 'El mensaje ha sido enviado correctamente');
      loadMessages(); 
    } catch (error) {
      createNotification('error', 'Error', 'No se pudo enviar el mensaje');
    }
  };

  // Formato de texto con tabulaciones automáticas
  const formatMessageText = (text: string) => {
    if (!text) return '';
    
    // Aplicar formato de tabulación cada 100 caracteres si no hay saltos de línea
    if (!text.includes('\n')) {
      const formatted = [];
      for (let i = 0; i < text.length; i += 100) {
        formatted.push(text.substring(i, i + 100));
      }
      return formatted.join('\n');
    }
    
    return text;
  };

  // Definir columnas para DataListSimple
  const columns = [
    {
      column: "title",
      label: "Título",
      width: "25%",
      sortable: true,
      render: (row: any) => (
        <div className="d-flex align-items-center">
          <i 
            className={row.dateRead ? 'iconsminds-mail-open mr-2' : 'iconsminds-mail mr-2'} 
            style={{ fontSize: '1.2rem', color: row.dateRead ? '#6c757d' : '#17a2b8' }}
          />
          <span className={!row.dateRead ? 'font-weight-bold' : ''}>
            {truncateText(row.title, 30)}
          </span>
          {!row.dateRead && (
            <Badge color="info" pill className="ml-2">Nuevo</Badge>
          )}
        </div>
      )
    },
    {
      column: "message",
      label: "Mensaje",
      width: "30%",
      sortable: true,
      render: (row: any) => (
        <span className={!row.dateRead ? 'font-weight-bold' : ''}>
          {truncateText(row.message, 40)}
        </span>
      )
    },
    {
      column: "createdByUser",
      label: "Autor",
      width: "20%",
      sortable: true,
      render: (row: any) => (
        <span className={!row.dateRead ? 'font-weight-bold' : ''}>
          {row.createdByUser?.name ? 
            `${row.createdByUser.name || ''} ${row.createdByUser.lastName || ''}`.trim() 
            : 'Sistema'
          }
        </span>
      )
    },
    {
      column: "dateSend",
      label: "Fecha de envío",
      width: "15%",
      sortable: true,
      render: (row: any) => (
        <span className={!row.dateRead ? 'font-weight-bold' : ''}>
          {formatDateShort(row.dateSend)}
        </span>
      )
    }
  ];

  // Definir acciones para DataListSimple - ahora en línea
  const actions = [
    {
      id: 'view',
      icon: 'simple-icon-eye',
      color: 'info',
      action: viewMessage,
      tooltip: 'Ver detalle del mensaje'
    },
    {
      id: 'mark-read',
      icon: 'simple-icon-check',
      color: 'success',
      action: markAsRead,
      condition: (row: any) => !row.dateRead,
      tooltip: 'Marcar como leído'
    },
    {
      id: 'delete',
      icon: 'simple-icon-trash',
      color: 'danger',
      action: confirmDelete,
      tooltip: 'Eliminar mensaje'
    }
  ];

  // Configurar opciones de filtro
  const filterOptions = [
    { label: 'Todos los mensajes', value: 'all' },
    { label: 'Mensajes leídos', value: 'read' },
    { label: 'Mensajes no leídos', value: 'unread' }
  ];

  // Configurar estilo personalizado para filas
  const trStyle = (row: any) => ({
    borderLeft: !row.dateRead ? '4px solid #17a2b8' : 'none'
  });

  // Estados vacíos según el filtro
  const getEmptyStateConfig = () => {
    switch (filterStatus) {
      case 'read':
        return {
          icon: 'iconsminds-mail-open',
          message: 'No tienes mensajes leídos',
          description: 'Los mensajes que hayas leído aparecerán aquí'
        };
      case 'unread':
        return {
          icon: 'iconsminds-mail',
          message: 'No tienes mensajes pendientes',
          description: '¡Felicidades! Has leído todos tus mensajes'
        };
      default:
        return {
          icon: 'iconsminds-empty-mailbox',
          message: 'No hay mensajes',
          description: 'Tu bandeja de entrada está vacía. Los nuevos mensajes aparecerán aquí.'
        };
    }
  };
  
  const emptyState = getEmptyStateConfig();

  return (
    <>
      <Row className="mb-4">
        <Colxx xxs="12">
          <div className="d-flex align-items-center">
            <i className="iconsminds-mail mr-2" style={{ fontSize: '1.5rem' }}></i>
            <h1 className="mb-0">Bandeja de Entrada</h1>
          </div>
        </Colxx>
      </Row>

      <Row>
        <Colxx xxs="12">
          <DataListSimple
            data={messages}
            columns={columns}
            actions={actions}
            onRowClick={viewMessage}
            trStyle={trStyle}
            actionsWidth="110px"
            refreshData={loadMessages}
            loading={loading}
            emptyIcon={emptyState.icon}
            emptyMessage={emptyState.message}
            emptyDescription={emptyState.description}
            onAddNew={() => setCreateModalOpen(true)}
            addButtonLabel="Nuevo"
            canCreate={canCreateMessage}
            searchPlaceholder="Buscar mensajes..."
            filterOptions={filterOptions}
            filterValue={filterStatus}
            onFilterChange={setFilterStatus}
            deleteData={(id: string) => deleteMessage(id)}
            selectable={true}
            searchFields={['title', 'message']}
          />
        </Colxx>
      </Row>

      {/* Modal para ver mensaje en detalle - Estilo verde */}
      <Modal
        isOpen={viewModalOpen}
        toggle={() => setViewModalOpen(!viewModalOpen)}
        size="lg"
        backdrop="static"
        className="message-detail-modal"
      >
        {selectedMessage && (
          <>
            <ModalHeader 
              toggle={() => setViewModalOpen(false)} 
              className={selectedMessage.dateRead ? 'bg-light' : 'bg-success text-white'}
            >
              <div className="d-flex align-items-center">
                <i className={selectedMessage.dateRead ? 'iconsminds-mail-open mr-2' : 'iconsminds-mail mr-2'}
                   style={{ fontSize: '1.5rem' }}></i>
                {selectedMessage.title}
              </div>
            </ModalHeader>
            <ModalBody className="p-4">
              <Row>
                <Col md="6" className="mb-3">
                  <div className="info-item">
                    <span className="info-label">De:</span>
                    <span className="info-value">
                      {selectedMessage.createdByUser 
                        ? `${selectedMessage.createdByUser.name || ''} ${selectedMessage.createdByUser.lastName || ''}`.trim() 
                        : 'Sistema'
                      }
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Fecha de envío:</span>
                    <span className="info-value">{formatDate(selectedMessage.dateSend)}</span>
                  </div>
                </Col>
                <Col md="6" className="mb-3">
                  <div className="info-item">
                    <span className="info-label">Estado:</span>
                    <span className={`info-value ${selectedMessage.dateRead ? 'text-success' : 'text-info'}`}>
                      <i className={selectedMessage.dateRead ? 'simple-icon-check mr-1' : 'simple-icon-bell mr-1'}></i>
                      {selectedMessage.dateRead ? 'Leído' : 'No leído'}
                    </span>
                  </div>
                  {selectedMessage.dateRead && (
                    <div className="info-item">
                      <span className="info-label">Fecha de lectura:</span>
                      <span className="info-value">{formatDate(selectedMessage.dateRead)}</span>
                    </div>
                  )}
                </Col>
              </Row>
              <div className="message-content bg-light p-4 rounded">
                <pre className="message-text">{formatMessageText(selectedMessage.message)}</pre>
              </div>
            </ModalBody>
            <ModalFooter className="bg-light">
              <div className="d-flex justify-content-between w-100">
                <div>
                  {!selectedMessage.dateRead && (
                    <Button color="success" onClick={() => markAsRead(selectedMessage)}>
                      <i className="simple-icon-check mr-2"></i>
                      Marcar como leído
                    </Button>
                  )}
                </div>
                <div>
                  <Button color="danger" onClick={() => confirmDelete(selectedMessage)} className="mr-2">
                    <i className="simple-icon-trash mr-2"></i>
                    Eliminar
                  </Button>
                  <Button color="secondary" onClick={() => setViewModalOpen(false)}>
                    Cerrar
                  </Button>
                </div>
              </div>
            </ModalFooter>
          </>
        )}
      </Modal>

      {/* Modal para confirmar eliminación - Estilo rojo unificado */}
      <Modal
        isOpen={deleteConfirmModalOpen}
        toggle={() => setDeleteConfirmModalOpen(!deleteConfirmModalOpen)}
        backdrop="static"
        className="delete-modal"
      >
        <ModalHeader toggle={() => setDeleteConfirmModalOpen(false)} className="bg-danger text-white">
          <div className="d-flex align-items-center">
            <i className="simple-icon-trash mr-2" style={{ fontSize: '1.2rem' }}></i>
            Confirmar eliminación
          </div>
        </ModalHeader>
        <ModalBody className="p-4">
          {selectedItems.length === 1 ? (
            <>
              <p>¿Está seguro que desea eliminar el siguiente mensaje?</p>
              <div className="message-preview p-3 border rounded mb-3">
                <div><strong>Título:</strong> {selectedItems[0]?.title || 'Sin título'}</div>
                <div><strong>Autor:</strong> {
                  selectedItems[0]?.createdByUser?.name 
                    ? `${selectedItems[0].createdByUser.name || ''} ${selectedItems[0].createdByUser.lastName || ''}`.trim() 
                    : 'Sistema'
                }</div>
                <div><strong>Fecha:</strong> {formatDateShort(selectedItems[0]?.dateSend)}</div>
              </div>
            </>
          ) : (
            <>
              <p>¿Está seguro que desea eliminar <strong>{selectedItems.length} mensajes</strong>?</p>
              <div className="message-count p-3 border rounded mb-3">
                <div className="text-center">
                  <i className="iconsminds-mail" style={{ fontSize: '2rem', opacity: 0.7 }}></i>
                  <div className="mt-2"><strong>{selectedItems.length}</strong> mensajes seleccionados</div>
                </div>
              </div>
            </>
          )}
          <p className="text-danger"><strong>Esta acción es irreversible.</strong></p>
        </ModalBody>
        <ModalFooter className="bg-light">
          <Button color="danger" onClick={deleteSelectedMessages}>
            <i className="simple-icon-trash mr-2"></i>
            Eliminar
          </Button>
          <Button color="light" onClick={() => setDeleteConfirmModalOpen(false)}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>

      {/* Modal de creación de mensaje */}
      {canCreateMessage && (
        <InboxCreate
          modalOpen={createModalOpen}
          toggleModal={() => setCreateModalOpen(!createModalOpen)}
          onSubmit={onSubmit}
          getInboxs={loadMessages}
        />
      )}

      <style>
        {`
        /* Estilos para modal de ver mensaje */
        .message-detail-modal .modal-header.bg-success .close {
          color: white;
          opacity: 0.9;
        }
        
        .info-item {
          margin-bottom: 8px;
        }
        
        .info-label {
          font-weight: bold;
          margin-right: 8px;
          display: inline-block;
          min-width: 120px;
        }
        
        .message-content {
          margin-top: 15px;
          border: 1px solid #e9ecef;
          max-height: 500px;
          overflow-y: auto;
        }
        
        .message-text {
          font-family: inherit;
          white-space: pre-wrap;
          margin: 0;
          font-size: 1rem;
          background: transparent;
          border: none;
        }
        
        /* Quitar hover gris en filas */
        .table-hover tbody tr:hover {
          background-color: inherit;
        }
        
        /* Evitar que los botones de acción se pongan en varias líneas */
        td .d-flex.justify-content-center {
          flex-wrap: nowrap !important;
        }
        `}
      </style>
    </>
  );
};

const mapStateToProps = ({ loginReducer }: any) => ({ loginReducer });

export default connect(mapStateToProps, inboxActions)(InboxDetail);
