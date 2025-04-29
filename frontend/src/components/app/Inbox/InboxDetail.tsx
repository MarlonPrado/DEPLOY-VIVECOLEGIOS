import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Button, Card, CardBody, Badge, Modal, ModalHeader, ModalBody, ModalFooter, Row } from 'reactstrap';
import moment from 'moment';
import 'moment/locale/es';
import { Loader } from '../../common/Loader';
import IntlMessages from '../../../helpers/IntlMessages';
import * as inboxActions from '../../../stores/actions/InboxAction';
import * as notificationActions from '../../../stores/actions/NotificationAction';
import { Colxx } from '../../common/CustomBootstrap';
import DataList from '../../common/Data/DataList';
import InboxCreate from './InboxCreate';
import { createNotification } from '../../../helpers/Notification';
import defaultAvatar from '../../../assets/img/profiles/l-1.jpg';

const COLUMN_LIST = [
  { column: 'title', label: 'Título', width: '30%', translate: false, badge: false, color: '', textCenter: false },
  { column: 'user', label: 'Autor', width: '25%', translate: false, badge: false, color: '', textCenter: false },
  { column: 'dateSend', label: 'Fecha de envío', width: '20%', translate: false, badge: false, color: '', textCenter: false },
  { column: 'dateRead', label: 'Fecha de lectura', width: '20%', translate: false, badge: false, color: '', textCenter: false },
];

const InboxDetail = (props: any) => {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [data, setData] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all'); // all, read, unread
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const userRoles = props.loginReducer?.role || {};

  console.log("SOBRE EL ROL")
  console.log(props.loginReducer?.role)

  // Implementación con array para mejor mantenibilidad
  const rolesQuePuedenCrearMensajes = ["DOCENTE", "ADMIN SEDE", "ADMIN COLEGIO", "GENERAL"];
  const canCreateMessage = rolesQuePuedenCrearMensajes.includes(userRoles.name);

  // Opcionalmente, para depuración:
  console.log("Nombre del rol:", userRoles.name);
  console.log("¿Puede crear mensajes?:", canCreateMessage);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return moment(dateString).format('D [de] MMMM [de] YYYY, HH:mm');
  };

  const loadMessages = useCallback(async () => {
    console.log("USER ID", props?.loginReducer?.userId)
    if (!props?.loginReducer?.userId) return;
    setLoading(true);
    try {
      const listData = await props.getListAllInbox(props.loginReducer.userId);
      console.log("LISTA DE MENSAJES", listData);
      if (listData && Array.isArray(listData)) {
        let filtered = listData.map((c: any) => c.node);
        if (filterStatus === 'read') {
          filtered = filtered.filter((msg: any) => msg.dateRead);
        } else if (filterStatus === 'unread') {
          filtered = filtered.filter((msg: any) => !msg.dateRead);
        }
        setMessages(filtered);
      } else {
        setMessages([]);
      }
    } catch (error) {
      createNotification('error', 'Error', 'No se pudo cargar los mensajes');
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, [props, filterStatus]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  // Agregar depuración de roles
  useEffect(() => {
    console.log("Roles del usuario:", userRoles);
    console.log("Puede crear mensajes:", canCreateMessage);
  }, [userRoles, canCreateMessage]);

  const onSubmit = async (dataForm: any) => {
    if (data === null) {
      await props.saveNewInbox(dataForm).then((id: any) => {
        if (id !== undefined) {
          setCreateModalOpen(false);
          loadMessages();
        }
      });
    } else {
      await props.updateInbox(dataForm, data.id).then((id: any) => {
        if (id !== undefined) {
          setCreateModalOpen(false);
          setData(null);
          loadMessages();
        }
      });
    }
  };

  const viewEditData = async (id: any) => {
    await props.dataInbox(id).then((formData: any) => {
      setData(formData.data);
      setCreateModalOpen(true);
    });
  };

  const changeActiveData = async (message: any) => {
    if (message.dateRead) return;
    await props.updateInbox({ dateRead: new Date().toISOString() }, message.id, false).then(() => {
      loadMessages();
    });
  };

  const deleteData = async (id: string) => {
    try {
      await props.deleteInbox(id, true); // Notar el true como tercer parámetro
      
      // Resto igual...
    } catch (error) {
      console.error("Error al eliminar mensaje:", error);
      createNotification('error', 'Error', 'No se pudo eliminar el mensaje');
    }
  };

  const columns = COLUMN_LIST.map((col) => {
    if (col.column === 'user') {
      return {
        ...col,
        render: (row: any) => (row.user ? `${row.user.name} ${row.user.lastName}` : 'Desconocido'),
      };
    }
    if (col.column === 'dateSend' || col.column === 'dateRead') {
      return {
        ...col,
        render: (row: any) => (row[col.column] ? formatDate(row[col.column]) : ''),
      };
    }
    return col;
  });

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
            <IntlMessages id="menu.inbox" />
          </h1>
          <Button
            color="primary"
            className="btn-shadow"
            onClick={() => {
              setData(null);
              setCreateModalOpen(true);
            }}
            disabled={!canCreateMessage}
            title={!canCreateMessage ? 'No tienes permiso para crear mensajes' : ''}
          >
            <i className="simple-icon-plus mr-2" />
            <IntlMessages id="pages.newMessage" />
          </Button>
        </Colxx>
      </Row>

      <div className="separator mb-5" />

      {loading ? (
        <Colxx sm={12} className="d-flex justify-content-center">
          <Loader />
        </Colxx>
      ) : messages.length > 0 ? (
        <DataList
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
        />
      ) : (
        <Card className="text-center p-5 bg-white">
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

      <InboxCreate 
        modalOpen={createModalOpen} 
        toggleModal={() => setCreateModalOpen(!createModalOpen)} 
        onSubmit={onSubmit} 
        getInboxs={loadMessages} // Esta prop faltaba
      />
    </>
  );
};

const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

const mapDispatchToProps = {
  ...inboxActions,
  getListSomeNotification: notificationActions.getListSomeNotification,
  updateNotification: notificationActions.updateNotification,
};

export default connect(mapStateToProps, mapDispatchToProps)(InboxDetail);
