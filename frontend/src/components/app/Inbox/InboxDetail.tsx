import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Row, Button, Card, CardBody, Modal, ModalHeader, ModalBody, ModalFooter, Table } from 'reactstrap';
import moment from 'moment';
import 'moment/locale/es';

import { createNotification } from '../../../helpers/Notification';
import * as inboxActions from '../../../stores/actions/InboxAction';
import { Colxx } from '../../common/CustomBootstrap';
import { Loader } from '../../common/Loader';
import InboxCreate from './InboxCreate';

const InboxDetail = (props: any) => {
  // Estados
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteConfirmModalOpen, setDeleteConfirmModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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
        
        // Aplicar búsqueda si existe
        if (searchTerm) {
          mappedMessages = mappedMessages.filter(msg => {
            const searchContent = `${msg.title} ${msg.message} ${msg.createdByUser?.name || ''} ${msg.createdByUser?.lastName || ''}`.toLowerCase();
            return searchContent.includes(searchTerm.toLowerCase());
          });
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
  }, [props, filterStatus, searchTerm]);

  // Efecto inicial
  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

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
      createNotification('success', 'Eliminado', 'Mensaje eliminado correctamente');
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
      createNotification('success', 'Eliminados', `${selectedItems.length} mensajes eliminados correctamente`);
      setSelectedItems([]);
      setDeleteConfirmModalOpen(false);
      loadMessages();
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

  // Toggle selección de mensaje
  const toggleSelectMessage = (message: any) => {
    if (selectedItems.find(item => item.id === message.id)) {
      setSelectedItems(selectedItems.filter(item => item.id !== message.id));
    } else {
      setSelectedItems([...selectedItems, message]);
    }
  };

  // Seleccionar/deseleccionar todos
  const toggleSelectAll = () => {
    if (selectedItems.length === paginatedMessages.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems([...paginatedMessages]);
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

  // Filtrar por estado
  const changeFilter = (filter: string) => {
    setFilterStatus(filter);
    setCurrentPage(1);
  };

  // Calcular paginación
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, messages.length);
  const paginatedMessages = messages.slice(startIndex, endIndex);
  const totalPages = Math.ceil(messages.length / pageSize);

  return (
    <>
      {/* Encabezado */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center">
          <i className="iconsminds-mail mr-2" style={{ fontSize: '1.5rem' }}></i>
          <h1 className="mb-0">Bandeja de Entrada</h1>
        </div>
        <div className="d-flex">
          <input
            type="text"
            className="form-control mr-2"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            style={{ maxWidth: '200px' }}
          />
          <div className="btn-group mr-2">
            <Button 
              color={filterStatus === 'all' ? 'primary' : 'outline-primary'} 
              onClick={() => changeFilter('all')}
              size="sm"
            >
              Todos
            </Button>
            <Button 
              color={filterStatus === 'read' ? 'primary' : 'outline-primary'} 
              onClick={() => changeFilter('read')}
              size="sm"
            >
              Leídos
            </Button>
            <Button 
              color={filterStatus === 'unread' ? 'primary' : 'outline-primary'} 
              onClick={() => changeFilter('unread')}
              size="sm"
            >
              No leídos
            </Button>
          </div>
          {selectedItems.length > 0 && (
            <Button 
              color="danger" 
              className="mr-2"
              size="sm"
              onClick={() => confirmDelete()}
            >
              <i className="simple-icon-trash mr-1"></i>
              Eliminar ({selectedItems.length})
            </Button>
          )}
          <Button 
            color="primary" 
            className="mr-2"
            size="sm"
            onClick={loadMessages}
          >
            <i className="simple-icon-refresh mr-1"></i>
            Actualizar
          </Button>
          {canCreateMessage && (
            <Button
              color="primary"
              size="sm"
              onClick={() => setCreateModalOpen(true)}
            >
              <i className="simple-icon-plus mr-1"></i>
              Agregar Nuevo
            </Button>
          )}
        </div>
      </div>

      <div className="separator mb-4"></div>

      {/* Contenido principal */}
      {loading ? (
        <div className="text-center p-5">
          <Loader />
        </div>
      ) : (
        <Card className="mb-4">
          <CardBody className="p-0">
            {messages.length > 0 ? (
              <>
                <Table hover responsive className="m-0">
                  <thead>
                    <tr>
                      <th style={{ width: '40px' }} className="text-center">
                        <div className="custom-control custom-checkbox">
                          <input
                            type="checkbox"
                            className="custom-control-input"
                            id="checkAll"
                            checked={paginatedMessages.length > 0 && selectedItems.length === paginatedMessages.length}
                            onChange={toggleSelectAll}
                          />
                          <label className="custom-control-label" htmlFor="checkAll"></label>
                        </div>
                      </th>
                      <th style={{ width: '25%' }}>Título</th>
                      <th style={{ width: '30%' }}>Mensaje</th>
                      <th style={{ width: '20%' }}>Autor</th>
                      <th style={{ width: '15%' }}>Fecha de envío</th>
                      <th style={{ width: '140px', textAlign: 'center' }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedMessages.map((message) => (
                      <tr 
                        key={message.id} 
                        className={!message.dateRead ? 'font-weight-bold' : ''}
                        style={!message.dateRead ? {borderLeft: '4px solid #00b8d8'} : {}}
                      >
                        <td className="text-center align-middle">
                          <div className="custom-control custom-checkbox">
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              id={`check_${message.id}`}
                              checked={!!selectedItems.find(item => item.id === message.id)}
                              onChange={() => toggleSelectMessage(message)}
                            />
                            <label className="custom-control-label" htmlFor={`check_${message.id}`}></label>
                          </div>
                        </td>
                        <td className="align-middle" onClick={() => viewMessage(message)} style={{cursor: 'pointer'}}>
                          {truncateText(message.title, 40)}
                          {!message.dateRead && (
                            <span className="badge badge-primary ml-2">Nuevo</span>
                          )}
                        </td>
                        <td className="align-middle" onClick={() => viewMessage(message)} style={{cursor: 'pointer'}}>
                          {truncateText(message.message, 50)}
                        </td>
                        <td className="align-middle" onClick={() => viewMessage(message)} style={{cursor: 'pointer'}}>
                          {message.createdByUser?.name ? 
                            `${message.createdByUser.name || ''} ${message.createdByUser.lastName || ''}`.trim() 
                            : 'Sistema'
                          }
                        </td>
                        <td className="align-middle" onClick={() => viewMessage(message)} style={{cursor: 'pointer'}}>
                          {formatDateShort(message.dateSend)}
                        </td>
                        <td className="text-center">
                          <div className="d-flex justify-content-center">
                            <Button 
                              color="info" 
                              size="sm" 
                              className="mr-1"
                              onClick={() => viewMessage(message)}
                              title="Ver detalles"
                            >
                              <i className="simple-icon-eye"></i>
                            </Button>
                            {!message.dateRead && (
                              <Button 
                                color="success" 
                                size="sm" 
                                className="mr-1"
                                onClick={() => markAsRead(message)}
                                title="Marcar como leído"
                              >
                                <i className="simple-icon-check"></i>
                              </Button>
                            )}
                            <Button 
                              color="danger" 
                              size="sm"
                              onClick={() => confirmDelete(message)}
                              title="Eliminar"
                            >
                              <i className="simple-icon-trash"></i>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                {/* Paginación */}
                <div className="d-flex justify-content-between align-items-center p-3">
                  <div>
                    Mostrando {startIndex + 1}-{endIndex} de {messages.length}
                  </div>
                  <div className="d-flex">
                    <div className="mr-3">
                      <select 
                        className="form-control form-control-sm" 
                        value={pageSize}
                        onChange={(e) => {
                          setPageSize(parseInt(e.target.value));
                          setCurrentPage(1);
                        }}
                      >
                        <option value="5">5 por página</option>
                        <option value="10">10 por página</option>
                        <option value="20">20 por página</option>
                        <option value="50">50 por página</option>
                      </select>
                    </div>
                    <div>
                      <nav>
                        <ul className="pagination pagination-sm mb-0">
                          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button 
                              className="page-link" 
                              onClick={() => setCurrentPage(1)}
                              disabled={currentPage === 1}
                            >
                              «
                            </button>
                          </li>
                          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button 
                              className="page-link" 
                              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                              disabled={currentPage === 1}
                            >
                              ‹
                            </button>
                          </li>
                          {Array.from({length: Math.min(5, totalPages)}, (_, i) => {
                            let pageNum = currentPage;
                            if (currentPage <= 3) {
                              pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + i;
                            } else {
                              pageNum = currentPage - 2 + i;
                            }
                            
                            if (pageNum <= totalPages && pageNum > 0) {
                              return (
                                <li 
                                  className={`page-item ${currentPage === pageNum ? 'active' : ''}`}
                                  key={pageNum}
                                >
                                  <button 
                                    className="page-link" 
                                    onClick={() => setCurrentPage(pageNum)}
                                  >
                                    {pageNum}
                                  </button>
                                </li>
                              );
                            }
                            return null;
                          })}
                          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button 
                              className="page-link" 
                              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                              disabled={currentPage === totalPages}
                            >
                              ›
                            </button>
                          </li>
                          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button 
                              className="page-link" 
                              onClick={() => setCurrentPage(totalPages)}
                              disabled={currentPage === totalPages}
                            >
                              »
                            </button>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center p-5">
                <div className="mb-3">
                  <i className="iconsminds-mail-read" style={{ fontSize: '5rem', opacity: '0.3' }}></i>
                </div>
                <h2 className="font-weight-bold">No hay mensajes</h2>
                <p className="text-muted mb-4">Tu bandeja de entrada está vacía. Los nuevos mensajes aparecerán aquí.</p>
                {canCreateMessage && (
                  <Button 
                    color="primary" 
                    onClick={() => setCreateModalOpen(true)}
                  >
                    <i className="simple-icon-plus mr-2"></i>
                    Enviar un mensaje
                  </Button>
                )}
              </div>
            )}
          </CardBody>
        </Card>
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
              <div className="bg-light p-4 rounded">
                <div style={{ whiteSpace: 'pre-wrap' }}>
                  {selectedMessage.message}
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
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
      >
        <ModalHeader toggle={() => setDeleteConfirmModalOpen(false)} className="bg-danger text-white">
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
            Confirmar eliminación
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
