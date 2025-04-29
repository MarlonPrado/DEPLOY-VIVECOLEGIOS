import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Row, Button, Card, CardBody } from 'reactstrap';
import moment from 'moment';
import 'moment/locale/es';

import { createNotification } from '../../../helpers/Notification';
import * as inboxActions from '../../../stores/actions/InboxAction';
import { Colxx } from '../../common/CustomBootstrap';
import DataListSimple from '../../common/Data/DataListSimple';
import { Loader } from '../../common/Loader';
import InboxCreate from './InboxCreate';

const COLUMN_LIST = [
  { column: 'title', label: 'Título', width: '30%', translate: false, badge: false, color: '', textCenter: false },
  { column: 'createdByUser', label: 'Enviado por', width: '25%', translate: false, badge: false, color: '', textCenter: false },
  { column: 'dateSend', label: 'Fecha de envío', width: '20%', translate: false, badge: false, color: '', textCenter: false },
  { column: 'dateRead', label: 'Fecha de lectura', width: '20%', translate: false, badge: false, color: '', textCenter: false },
];

const InboxDetail = (props: any) => {
  // Estados
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [data, setData] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [columns, setColumns] = useState(COLUMN_LIST);

  // Usuario y permisos
  const userRoles = props.loginReducer?.role || {};
  const rolesQuePuedenCrearMensajes = ["DOCENTE", "ADMIN SEDE", "ADMIN COLEGIO", "GENERAL"];
  const canCreateMessage = rolesQuePuedenCrearMensajes.includes(userRoles.name || '');

  // Formateo de fechas
  const formatDate = (dateString: string) => {
    if (!dateString) return 'No leído';
    moment.locale('es');
    return moment(dateString).format('D [de] MMMM [de] YYYY, HH:mm');
  };

  // Cargar mensajes
  const loadMessages = useCallback(async () => {
    if (!props?.loginReducer?.userId) return;
    setLoading(true);
    try {
      const listData = await props.getListAllInbox(props.loginReducer.userId);
      console.log("Datos de mensajes:", listData);
      
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
        
        console.log("Mensajes procesados:", mappedMessages);
        setMessages(mappedMessages);
      } else {
        console.log("No hay mensajes o formato incorrecto");
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

  // Configurar las columnas con sus renderizadores
  useEffect(() => {
    const updatedColumns = COLUMN_LIST.map((col) => {
      if (col.column === 'createdByUser') {
        return {
          ...col,
          render: (row: any) => {
            const user = row.createdByUser;
            return user ? 
              `${user.name || ''} ${user.lastName || ''}`.trim() || 'Desconocido' 
              : 'Sistema';
          },
        };
      }
      if (col.column === 'dateSend' || col.column === 'dateRead') {
        return {
          ...col,
          render: (row: any) => (row[col.column] ? formatDate(row[col.column]) : 'No leído'),
        };
      }
      return col;
    });
    setColumns(updatedColumns);
  }, []);

  // Funciones de acción
  const onSubmit = async (dataForm: any) => {
    try {
      if (data === null) {
        // Crear nuevo mensaje
        const id = await props.saveNewInbox(dataForm);
        if (id !== undefined) {
          setCreateModalOpen(false);
          createNotification('success', 'Mensaje enviado', 'El mensaje ha sido enviado correctamente');
          loadMessages();
        }
      } else {
        // Actualizar mensaje existente
        const id = await props.updateInbox(dataForm, data.id);
        if (id !== undefined) {
          setCreateModalOpen(false);
          setData(null);
          createNotification('success', 'Mensaje actualizado', 'El mensaje ha sido actualizado correctamente');
          loadMessages();
        }
      }
    } catch (error) {
      createNotification('error', 'Error', 'No se pudo procesar el mensaje');
    }
  };

  const viewEditData = async (id: any) => {
    try {
      const formData = await props.dataInbox(id);
      setData(formData.data);
      setCreateModalOpen(true);
    } catch (error) {
      createNotification('error', 'Error', 'No se pudo cargar el detalle del mensaje');
    }
  };

  const changeActiveData = async (message: any) => {
    if (message.dateRead) return;
    try {
      await props.updateInbox({ dateRead: new Date().toISOString() }, message.id, false);
      createNotification('success', 'Mensaje leído', 'El mensaje ha sido marcado como leído');
      loadMessages();
    } catch (error) {
      createNotification('error', 'Error', 'No se pudo marcar como leído el mensaje');
    }
  };

  const deleteData = async (id: string) => {
    try {
      await props.deleteInbox(id, true);
      createNotification('success', 'Eliminado', 'Mensaje eliminado correctamente');
      loadMessages();
    } catch (error) {
      createNotification('error', 'Error', 'No se pudo eliminar el mensaje');
    }
  };

  // Configurar acciones para DataList
  const actions = [
    {
      id: 'view',
      label: 'Ver mensaje',
      color: 'primary',
      icon: 'simple-icon-eye',
      action: (row: any) => viewEditData(row.id),
    },
    {
      id: 'markAsRead',
      label: 'Marcar como leído',
      color: 'success',
      icon: 'simple-icon-check',
      action: (row: any) => changeActiveData(row),
      condition: (row: any) => !row.dateRead,
    },
    {
      id: 'delete',
      label: 'Eliminar',
      color: 'danger',
      icon: 'simple-icon-trash',
      action: (row: any) => deleteData(row.id),
    },
  ];

  return (
    <>
      <Row className="mb-4">
        <Colxx xxs="12" className="d-flex justify-content-between align-items-center">
          <h1 className="m-0">
            <i className="iconsminds-mail mr-2"></i>
            Bandeja de Entrada
          </h1>
          
          {/* Solo mostrar el botón si tiene permiso */}
          {canCreateMessage && (
            <Button
              color="primary"
              className="btn-shadow"
              onClick={() => {
                setData(null);
                setCreateModalOpen(true);
              }}
            >
              <i className="simple-icon-plus mr-2" />
              Nuevo Mensaje
            </Button>
          )}
        </Colxx>
      </Row>

      <div className="separator mb-5" />

      {loading ? (
        <Colxx sm={12} className="d-flex justify-content-center">
          <Loader />
        </Colxx>
      ) : messages.length > 0 ? (
        <DataListSimple
          data={messages}
          columns={columns}
          actions={actions}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          filterOptions={[
            { label: 'Todos', value: 'all' },
            { label: 'Leídos', value: 'read' },
            { label: 'No leídos', value: 'unread' },
          ]}
          filterValue={filterStatus}
          onFilterChange={setFilterStatus}
          refreshDataTable={loadMessages}
          trClass={(row: any) => row.dateRead ? '' : 'font-weight-bold border-left-primary'}
        />
      ) : (
        <Card className="text-center p-5">
          <CardBody>
            <div className="d-flex justify-content-center mb-3">
              <i className="iconsminds-mail-read" style={{ fontSize: '5rem', opacity: '0.5' }} />
            </div>
            <h3 className="font-weight-bold mb-3">Tu bandeja está vacía</h3>
            <p className="text-muted mb-4">
              Aún no tienes mensajes. Cuando recibas uno, aparecerá aquí.
            </p>
            {canCreateMessage && (
              <Button 
                color="outline-primary" 
                size="lg"
                onClick={() => setCreateModalOpen(true)}
              >
                <i className="simple-icon-plus mr-2"></i>
                Enviar un mensaje
              </Button>
            )}
          </CardBody>
        </Card>
      )}

      {/* Modal de creación de mensaje */}
      {canCreateMessage && (
        <InboxCreate 
          modalOpen={createModalOpen} 
          toggleModal={() => setCreateModalOpen(!createModalOpen)} 
          onSubmit={onSubmit} 
          getInboxs={loadMessages}
          data={data}
        />
      )}
    </>
  );
};

const mapStateToProps = ({ loginReducer }: any) => ({ loginReducer });

export default connect(mapStateToProps, inboxActions)(InboxDetail);
