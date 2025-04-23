import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Loader } from '../../common/Loader';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';
import ProfileImg from '../../../assets/img/profiles/l-1.jpg';
import IntlMessages from '../../../helpers/IntlMessages';
import * as inboxActions from '../../../stores/actions/InboxAction';
import * as notificationActions from '../../../stores/actions/NotificationAction';
import { Colxx } from '../../common/CustomBootstrap';
import InboxCreate from './InboxCreate';
import svgEmpty from '../../../assets/img/svg/scene-inbox-empty.svg';

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
  };
}

interface InboxProps {
  loginReducer: {
    userId: string;
  };
  getListAllInbox: (userId: string) => Promise<any>;
  updateInbox: (data: any, id: string) => Promise<any>;
  getListSomeNotification?: (userId: string) => Promise<any>;
  updateNotification?: (data: any, id: string) => Promise<any>;
}

const Inbox = (props: InboxProps) => {
  const [loading, setLoading] = useState(true);
  const [notifications, setInboxs] = useState<InboxMessage[]>([]);
  const [modalOpen, setModalOpen] = useState(false);  

  // Efecto para cargar los mensajes iniciales
  useEffect(() => {
    try {
      props.getListAllInbox(props?.loginReducer?.userId).then((listData: any) => {
        if (listData && Array.isArray(listData)) {
          setInboxs(
            listData.map((c: any) => c.node)
          );
        } else {
          console.error("Formato de datos incorrecto:", listData);
          setInboxs([]);
        }
        setLoading(false);
      }).catch((error: Error) => { // Aquí está la corrección del error TS7006
        console.error("Error al cargar mensajes:", error);
        setInboxs([]);
        setLoading(false);
      });
    } catch (error: unknown) { // También corrección aquí
      console.error("Error general:", error);
      setInboxs([]);
      setLoading(false);
    }
  }, []);

  // Función para actualizar la lista de mensajes
  const getInboxs = async () => {
    try {
      const listData = await props.getListAllInbox(props?.loginReducer?.userId);
      
      if (listData && Array.isArray(listData)) {
        setInboxs(
          listData.map((c: any) => c.node)
        );
      } else {
        console.error("Formato de datos incorrecto en actualización:", listData);
        // No actualizamos el estado para mantener los mensajes existentes
      }
    } catch (error: unknown) {
      console.error("Error al actualizar mensajes:", error);
      // No actualizamos el estado para mantener los mensajes existentes
    }
  };

  // Función para marcar un mensaje como leído
  const markAsRead = async (item: InboxMessage) => {
    try {
  
      await props.updateInbox({ dateRead: new Date() }, item.id);
      
    
      if (props.getListSomeNotification && props.updateNotification) {
        try {
          // Buscar notificaciones actuales del usuario
          const notifications = await props.getListSomeNotification(props.loginReducer.userId);
          
          // Filtrar las que coincidan con el título del mensaje (aproximación)
          const matchingNotifications = notifications?.filter((n: any) => 
            n.node.title?.includes(item.title) || 
            (n.node.message && item.message && n.node.message.includes(item.message))
          );
          
          // Chulear el leido e actualizar pestaña
          if (matchingNotifications && matchingNotifications.length > 0) {
            const updatePromises = matchingNotifications.map((n: any) =>
              props.updateNotification({ dateRead: new Date() }, n.node.id)
            );
            await Promise.all(updatePromises);
          }
        } catch (notificationError) {
          console.warn("No se pudieron actualizar las notificaciones relacionadas:", notificationError);
        }
      }
      
      // 3. Actualizar UI
      await getInboxs();

      // 4. Forzar actualización programática del contador
      // Esta es la solución más simple pero menos elegante
      setTimeout(() => {
        // Guarda la posición del scroll
        const scrollPosition = window.scrollY;
        
        // Recarga la página pero mantiene la posición del scroll
        window.location.reload();
        
        // Se puede almacenar la posición en sessionStorage para recuperarla después
        sessionStorage.setItem('scrollPosition', scrollPosition.toString());
        
        // Después del reload, en useEffect del componente:
        // const savedPosition = sessionStorage.getItem('scrollPosition');
        // if (savedPosition) window.scrollTo(0, parseInt(savedPosition));
      }, 500); // Pequeño retraso para que se guarden los cambios
    } catch (error) {
      console.error("Error al marcar como leído:", error);
    }
  };

  return (
    <>
      {loading ? (
        <>
          <Colxx sm={12} className="d-flex justify-content-center">
            <Loader/>
          </Colxx>
        </>
      ) : (
        <>
          <div className="row mb-3 mr-2 d-flex justify-content-end">
            <Button
              color="primary"
              size="lg"
              className="top-right-button"
              onClick={() => setModalOpen(!modalOpen)}
              disabled={false}

            >
              <IntlMessages id="pages.newMessage" />
            </Button>
          </div>        
          <div className="row">
            <div className="col-12 chat-app">
              <div className="scroll">
                <PerfectScrollbar options={{ suppressScrollX: true, wheelPropagation: false }}>
                  {notifications.length > 0 ? (
                    <>
                      {notifications.map((item: InboxMessage, index: number) => (
                        <React.Fragment key={item.id || index}>
                          <div className="clearfix"></div>
                          <div className="card d-inline-block mb-3 float-left mr-2 w-100">
                            <div className="position-absolute pt-1 pr-2 r-0">
                              <span className="text-extra-small text-muted">
                                {item?.dateSend ? moment(item.dateSend).format('YYYY-MM-DD h:mm a') : ''}
                              </span>
                            </div>
                            <div className="card-body">
                              <div className="d-flex flex-row">
                                <span className="d-flex">
                                  <img
                                    alt="Profile Picture"
                                    src={ProfileImg}
                                    className="img-thumbnail border-0 rounded-circle mr-3 list-thumbnail align-self-center xsmall"
                                  />
                                </span>
                                <div className="d-flex flex-grow-1 min-width-zero">
                                  <div className="m-2 pl-0 align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero">
                                    <div className="min-width-zero">
                                      <p
                                        className={`mb-0 truncate list-item-heading ${
                                          item.dateRead ? '' : 'font-bold'
                                        }`}
                                      >
                                        <span>
                                          {item?.user?.name || 'Usuario'} {item?.user?.lastName || ''}
                                        </span>
                                      </p>
                                    </div>
                                    {!item.dateRead && (
                                      <span
                                        className="ml-2 badge badge-info cursor-pointer"
                                        onClick={() => markAsRead(item)}
                                      >
                                        <IntlMessages id="info.markAsRead" />
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="chat-text-left">
                                <p
                                  className={`mb-0 text-semi-muted ${
                                    item.dateRead ? '' : 'font-bold'
                                  }`}
                                >
                                  {item.title || 'Sin título'}: {item?.message || 'Sin mensaje'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </React.Fragment>
                      ))}
                    </>
                  ) : (
                    <div className='d-flex align-items-center justify-content-center flex-column'>               
                      <img className="card-img-left w-30" src={svgEmpty} alt="Card cap" />
                      <h4 className='font-bold mt-4 mb-1'>Sin registros</h4>
                      <span className='font-bold text-muted'>No se encontraron mensajes</span>
                    </div>
                  )}
                </PerfectScrollbar>
              </div>
            </div>
          </div>
          <InboxCreate
            modalOpen={modalOpen}
            getInboxs={getInboxs}
            toggleModal={() => setModalOpen(!modalOpen)}
          />
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

export default connect(mapStateToProps, mapDispatchToProps)(Inbox);
