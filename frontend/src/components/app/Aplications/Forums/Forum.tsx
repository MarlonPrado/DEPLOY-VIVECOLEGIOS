/* eslint-disable jsx-a11y/anchor-is-valid */
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  InputGroup,
  Nav,
  NavItem,
  Row,
  TabContent,
  TabPane,
} from 'reactstrap';
import { useForm } from 'react-hook-form';
import IntlMessages from '../../../../helpers/IntlMessages';
import { Colxx } from '../../../common/CustomBootstrap';
import CommentWithLikes from '../AplicationsComponents/CommentWithLikes';
import * as forumActions from '../../../../stores/actions/ForumAction';
import { createNotification } from '../../../../helpers/Notification';

const ForumApp = (props: any) => {
  const [activeTab, setActiveTab] = useState('details');
  const [data, setData] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Obtener parámetros de URL
  const id = searchParams.get('id');
  const courseId = searchParams.get('courseId');

  const methods = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const { register, reset } = methods;

  const cleanForm = async () => {
    reset();
  };

  // Cargar datos del foro
  useEffect(() => {
    if (!id) {
      createNotification('error', 'Error', 'No se proporcionó ID del foro');
      navigate(-1);
      return;
    }

    loadForumData();
  }, [id]);

  // Cargar datos del foro y comentarios
  const loadForumData = async () => {
    setLoading(true);
    try {
      // Cargar datos del foro
      const forumData = await props.dataForum(id);
      setData(forumData.data);
      
      // Cargar comentarios
      await loadComments();
    } catch (error) {
      console.error("Error al cargar datos del foro:", error);
      createNotification('error', 'Error', 'No se pudieron cargar los datos del foro');
    } finally {
      setLoading(false);
    }
  };

  // Cargar comentarios del foro
  const loadComments = async () => {
    try {
      const result = await props.dataForumInteraction(id);
      setComments(result?.data?.edges || []);
    } catch (error) {
      console.error("Error al cargar comentarios:", error);
      createNotification('error', 'Error', 'No se pudieron cargar los comentarios');
    }
  };

  // Guardar un nuevo comentario
  const saveComment = async (dataSend: any) => {
    if (!dataSend.comment || dataSend.comment.trim() === '') {
      createNotification('warning', 'Advertencia', 'El comentario no puede estar vacío');
      return;
    }
    
    try {
      dataSend.forumId = id;
      await props.saveIntetactionForum(dataSend);
      await loadComments();
      cleanForm();
      createNotification('success', 'Éxito', 'Comentario guardado correctamente');
    } catch (error) {
      console.error("Error al guardar comentario:", error);
      createNotification('error', 'Error', 'No se pudo guardar el comentario');
    }
  };

  // Registrar campo de comentario
  const { ref: commentsRef, ...commentsRest } = register('comment', {
    required: true
  });

  // URL para volver atrás según si venimos de un curso específico
  const getBackUrl = () => {
    if (courseId) {
      return `/forumList?courseId=${courseId}`;
    }
    return '/forumList';
  };

  return (
    <>
      <Row>
        <Colxx xxs="12" xl="12" className="col-left">
          <Card className="mb-4 rounded-card">
            <CardBody>
              <div className="d-flex">
                <Button
                  color="light"
                  className="mr-3 p-1"
                  onClick={() => navigate(getBackUrl())}
                >
                  <i className="iconsminds-left-1 lead text-primary"></i>
                </Button>
                {loading ? (
                  <div className="d-flex align-items-center">
                    <span className="loading-spinner-small"></span>
                  </div>
                ) : (
                  <div>
                    <p className="mb-0 lead font-bold">{data?.name}</p>
                    <p className="mb-0 ">{data?.description}</p>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
          <Card className="mb-4 rounded-card">
            <CardHeader>
              <Nav tabs className="card-header-tabs ">
                <NavItem>
                  <a
                    className={classNames({
                      active: activeTab === 'details',
                      'nav-link': true,
                    })}
                    onClick={() => setActiveTab('details')}
                  >
                    <IntlMessages id="layouts.details" />
                  </a>
                </NavItem>
                <NavItem>
                  <a
                    className={classNames({
                      active: activeTab === 'comments',
                      'nav-link': true,
                    })}
                    onClick={() => setActiveTab('comments')}
                  >
                    <IntlMessages id="layouts.comments" />
                    ({comments?.length || 0})
                  </a>
                </NavItem>
              </Nav>
            </CardHeader>

            <TabContent activeTab={activeTab}>
              <TabPane tabId="details">
                <Row>
                  <Colxx sm="12">
                    <CardBody>
                      {loading ? (
                        <div className="d-flex justify-content-center p-5">
                          <div className="loading" />
                        </div>
                      ) : (
                        <p>{data?.details}</p>
                      )}
                    </CardBody>
                  </Colxx>
                </Row>
              </TabPane>
              <TabPane tabId="comments">
                <Row>
                  <Colxx sm="12">
                    <CardBody>
                      {loading ? (
                        <div className="d-flex justify-content-center p-5">
                          <div className="loading" />
                        </div>
                      ) : (
                        <>
                          {comments?.length > 0 ? (
                            comments.map((item: any) => (
                              <CommentWithLikes
                                className={''}
                                data={item?.node}
                                key={`comments_${item.node.id}`}
                              />
                            ))
                          ) : (
                            <div className="text-center p-4 text-muted">
                              <i className="iconsminds-speach-bubble-dialog d-block" style={{fontSize: '2rem'}}></i>
                              <p className="mt-3">No hay comentarios aún. Sé el primero en comentar.</p>
                            </div>
                          )}
                          <InputGroup className="comment-container mt-4">
                            <Input 
                              {...commentsRest} 
                              innerRef={commentsRef} 
                              placeholder="Añadir comentarios" 
                            />
                            <Button 
                              color="primary" 
                              className="btn-rounded-preppend" 
                              onClick={() => saveComment(methods.getValues())}
                            >
                              <span className="d-inline-block">
                                <IntlMessages id="pages.send" />
                              </span>{' '}
                              <i className="simple-icon-arrow-right ml-2" />
                            </Button>
                          </InputGroup>
                        </>
                      )}
                    </CardBody>
                  </Colxx>
                </Row>
              </TabPane>
            </TabContent>
          </Card>
        </Colxx>
      </Row>
    </>
  );
};

const mapDispatchToProps = { ...forumActions };

const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

export default connect(mapStateToProps, mapDispatchToProps)(ForumApp);
