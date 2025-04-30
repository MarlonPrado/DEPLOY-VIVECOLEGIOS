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
      
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === message.id 
            ? { ...msg, dateRead: new Date().toISOString() } 
            : msg
        )
      );
    } catch (error) {
      createNotification('error', 'Error', 'No se pudo marcar como leído el mensaje');
    }
  };

  // Marcar como leído silenciosamente (sin notificación)
  const markAsReadSilently = async (message: any) => {
    if (message.dateRead) return;
    
    try {
      await props.updateInbox({ dateRead: new Date().toISOString() }, message.id, false);
      
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
      
      setMessages(prevMessages => 
        prevMessages.filter(msg => !selectedItems.some(item => item.id === msg.id))
      );
      
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

  // Definir acciones para DataListSimple
  const actions = [
    {
      id: 'view',
      icon: 'simple-icon-eye',
      color: 'info',
      action: viewMessage,
      tooltip: 'Ver detalle del mensaje'
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
            actionsWidth="100px"
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

      {/* Modal para ver mensaje en detalle */}
      <Modal
        isOpen={viewModalOpen}
        toggle={() => setViewModalOpen(!viewModalOpen)}
        size="lg"
        backdrop="static"
      >
        {selectedMessage && (
          <>
            <ModalHeader toggle={() => setViewModalOpen(false)} className="bg-light">
              <div className="d-flex align-items-center">
                <i className={selectedMessage.dateRead ? 'iconsminds-mail-open mr-2' : 'iconsminds-mail mr-2'}
                   style={{ fontSize: '1.5rem', color: selectedMessage.dateRead ? '#6c757d' : '#17a2b8' }}></i>
                {selectedMessage.title}
              </div>
            </ModalHeader>
            <ModalBody>
              <div className="d-flex justify-content-between mb-3 flex-wrap">
                <div className="mb-2">
                  <p className="mb-1"><strong>De:</strong> {
                    selectedMessage.createdByUser 
                      ? `${selectedMessage.createdByUser.name || ''} ${selectedMessage.createdByUser.lastName || ''}`.trim() 
                      : 'Sistema'
                  }</p>
                  <p className="mb-1"><strong>Enviado:</strong> {formatDate(selectedMessage.dateSend)}</p>
                </div>
                <div className="mb-2">
                  {selectedMessage.dateRead ? (
                    <p className="mb-1 text-success">
                      <i className="simple-icon-check mr-1"></i>
                      <strong>Leído:</strong> {formatDate(selectedMessage.dateRead)}
                    </p>
                  ) : (
                    <p className="mb-1 text-info">
                      <i className="simple-icon-bell mr-1"></i>
                      <strong>Estado:</strong> No leído
                    </p>
                  )}
                </div>
              </div>
              <div className="separator my-4"></div>
              <div className="bg-light p-4 rounded">
                <div style={{ whiteSpace: 'pre-wrap' }}>
                  {selectedMessage.message}
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              {!selectedMessage.dateRead && (
                <Button color="success" onClick={() => markAsRead(selectedMessage)}>
                  <i className="simple-icon-check mr-2"></i>
                  Marcar como leído
                </Button>
              )}
              <Button color="danger" onClick={() => confirmDelete(selectedMessage)}>
                <i className="simple-icon-trash mr-2"></i>
                Eliminar
              </Button>
              <Button color="secondary" onClick={() => setViewModalOpen(false)}>
                Cerrar
              </Button>
            </ModalFooter>
          </>
        )}
      </Modal>

      {/* Modal para confirmar eliminación */}
      <Modal
        isOpen={deleteConfirmModalOpen}
        toggle={() => setDeleteConfirmModalOpen(!deleteConfirmModalOpen)}
        backdrop="static"
      >
        <ModalHeader toggle={() => setDeleteConfirmModalOpen(false)} className="bg-danger text-white">
          <i className="simple-icon-trash mr-2"></i>
          Confirmar eliminación
        </ModalHeader>
        <ModalBody>
          {selectedItems.length === 1 ? (
            <p>¿Está seguro que desea eliminar el mensaje <strong>"{selectedItems[0]?.title || 'Sin título'}"</strong>?</p>
          ) : (
            <p>¿Está seguro que desea eliminar <strong>{selectedItems.length} mensajes</strong>?</p>
          )}
          <p className="text-danger"><strong>Esta acción es irreversible.</strong></p>
        </ModalBody>
        <ModalFooter>
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
    </>
  );
};

const mapStateToProps = ({ loginReducer }: any) => ({ loginReducer });

export default connect(mapStateToProps, inboxActions)(InboxDetail);
