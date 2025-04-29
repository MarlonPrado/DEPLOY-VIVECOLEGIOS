import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Row, Button, Card, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import moment from 'moment';
import 'moment/locale/es';

import { createNotification } from '../../../helpers/Notification';
import * as inboxActions from '../../../stores/actions/InboxAction';
import { Colxx } from '../../common/CustomBootstrap';
import { Loader } from '../../common/Loader';
import InboxCreate from './InboxCreate';
import DataListSimple from '../../common/Data/DataListSimple';

const InboxDetail = (props: any) => {
  // Estados
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
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
    if (!props?.loginReducer?.userId) return;
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
  }, [props, filterStatus]);

  // Efecto inicial
  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  // Definir columnas
  const columns = [
    { 
      column: 'title', 
      label: 'Título', 
      width: '25%',
      render: (row: any) => truncateText(row.title, 40)
    },
    { 
      column: 'message', 
      label: 'Mensaje', 
      width: '30%',
      render: (row: any) => truncateText(row.message, 50)
    },
    { 
      column: 'createdByUser', 
      label: 'Autor', 
      width: '20%',
      render: (row: any) => {
        const user = row.createdByUser;
        if (!user) return 'Sistema';
        return `${user.name || ''} ${user.lastName || ''}`.trim() || 'Desconocido';
      }
    },
    { 
      column: 'dateSend', 
      label: 'Fecha de envío', 
      width: '15%',
      render: (row: any) => formatDateShort(row.dateSend)
    }
  ];

  // Marcar como leído
  const markAsRead = async (message: any) => {
    if (message.dateRead) return;
    try {
      await props.updateInbox({ dateRead: new Date().toISOString() }, message.id, false);
      createNotification('success', 'Mensaje leído', 'El mensaje ha sido marcado como leído');
      loadMessages();
    } catch (error) {
      createNotification('error', 'Error', 'No se pudo marcar como leído el mensaje');
    }
  };

  // Ver mensaje
  const viewMessage = (message: any) => {
    setSelectedMessage(message);
    setViewModalOpen(true);
    if (!message.dateRead) {
      markAsRead(message);
    }
  };

  // Eliminar mensaje
  const deleteMessage = async (id: string) => {
    try {
      await props.deleteInbox(id, true);
      createNotification('success', 'Mensaje eliminado', 'Mensaje eliminado correctamente');
      setViewModalOpen(false);
      loadMessages();
    } catch (error) {
      createNotification('error', 'Error', 'No se pudo eliminar el mensaje');
    }
  };

  // Crear nuevo mensaje
  const onSubmit = async (dataForm: any) => {
    try {
      const id = await props.saveNewInbox(dataForm);
      if (id) {
        setCreateModalOpen(false);
        createNotification('success', 'Mensaje enviado', 'El mensaje ha sido enviado correctamente');
        loadMessages();
      }
    } catch (error) {
      createNotification('error', 'Error', 'No se pudo enviar el mensaje');
    }
  };

  // Configurar acciones para DataList
  const actions = [
    {
      id: 'view',
      label: 'Ver',
      color: 'primary',
      icon: 'simple-icon-eye',
      action: (row: any) => viewMessage(row)
    },
    {
      id: 'markAsRead',
      label: 'Leer',
      color: 'success',
      icon: 'simple-icon-check',
      action: (row: any) => markAsRead(row),
      condition: (row: any) => !row.dateRead
    },
    {
      id: 'delete',
      label: 'Eliminar',
      color: 'danger',
      icon: 'simple-icon-trash',
      action: (row: any) => deleteMessage(row.id)
    }
  ];

  return (
    <>
      <Row className="mb-4">
        <Colxx xxs="12">
          <h1 className="mb-3">
            <i className="iconsminds-mail mr-2"></i>
            Bandeja de Entrada
          </h1>
        </Colxx>
      </Row>

      {loading ? (
        <Row>
          <Colxx xxs="12" className="d-flex justify-content-center">
            <Loader />
          </Colxx>
        </Row>
      ) : (
        <DataListSimple
          data={messages}
          columns={columns}
          actions={actions}
          refreshDataTable={loadMessages}
          toggleModal={() => {
            setCreateModalOpen(true);
          }}
          filterOptions={[
            { label: 'Todos', value: 'all' },
            { label: 'Leídos', value: 'read' },
            { label: 'No leídos', value: 'unread' },
          ]}
          filterValue={filterStatus}
          onFilterChange={setFilterStatus}
          deleteData={deleteMessage}
          trClass={(row: any) => !row.dateRead ? 'font-weight-bold' : ''}
        />
      )}

      {/* Modal para ver mensaje en detalle */}
      <Modal
        isOpen={viewModalOpen}
        toggle={() => setViewModalOpen(!viewModalOpen)}
        size="lg"
      >
        {selectedMessage && (
          <>
            <ModalHeader toggle={() => setViewModalOpen(false)}>
              {selectedMessage.title}
            </ModalHeader>
            <ModalBody>
              <div className="d-flex justify-content-between mb-3">
                <div>
                  <p className="mb-1"><strong>De:</strong> {
                    selectedMessage.createdByUser 
                      ? `${selectedMessage.createdByUser.name || ''} ${selectedMessage.createdByUser.lastName || ''}`.trim() 
                      : 'Sistema'
                  }</p>
                  <p className="mb-1"><strong>Enviado:</strong> {formatDate(selectedMessage.dateSend)}</p>
                </div>
                <div>
                  {selectedMessage.dateRead ? (
                    <p className="mb-1"><strong>Leído:</strong> {formatDate(selectedMessage.dateRead)}</p>
                  ) : (
                    <p className="mb-1 text-warning"><strong>Estado:</strong> No leído</p>
                  )}
                </div>
              </div>
              <div className="separator my-4"></div>
              <Card className="bg-light p-4">
                <div style={{ whiteSpace: 'pre-wrap' }}>
                  {selectedMessage.message}
                </div>
              </Card>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" onClick={() => deleteMessage(selectedMessage.id)}>
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
