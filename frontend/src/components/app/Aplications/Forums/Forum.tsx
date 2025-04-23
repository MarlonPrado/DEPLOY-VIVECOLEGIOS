/* eslint-disable jsx-a11y/anchor-is-valid */
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router';
import { NavLink, useSearchParams } from 'react-router-dom';
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

const ForumApp = (props: any) => {
  const [activeTab, setActiveTab] = useState('details');
  const [data, setData] = useState(null);
  const [comments, setComments] = useState([]);

  let navigate = useNavigate();

  let [params] = useSearchParams();

  const methods = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const { handleSubmit, control, register, reset, setValue, getValues } = methods;

  const cleanForm = async () => {
    reset();
  };


  useEffect(() => {
    const id = params.get('id');
    props.dataForum(id).then((res: any) => {
      setData(res.data);
      getComments();
    });
  }, []);

  const getComments = async () => {
    const id = params.get('id');
    props.dataForumInteraction(id).then((res: any) => {
      setComments(res?.data?.edges);
    });
  };

  const saveComment = async (dataSend: any) => {
    const id = params.get('id');
    dataSend.forumId = id;
    props.saveIntetactionForum(dataSend).then((listData: any) => {
      getComments();
      cleanForm();
    });
  };

  const { ref: commentsRef, ...commentsRest } = register('comment', {
    required: true,
    value: props?.data?.id ? props?.data?.comments : '',
  });


  return (
    <>
      <Row>
        <Colxx xxs="12" xl="12" className="col-left">
          <Card className="mb-4 rounded-card">
            <CardBody>
              <div className="d-flex">
                <i
                  onClick={() => {
                    return navigate('/foros');
                  }}
                  className="lead mr-3 cursor-pointer iconsminds-left-1 text-primary"
                ></i>
                <div>
                  <p className="mb-0 lead font-bold">{data?.name}</p>
                  <p className="mb-0 ">{data?.description}</p>
                </div>
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
                    onClick={() => { return setActiveTab('details') }}
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
                    onClick={() => { return setActiveTab('comments') }}
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
                      <p>{data?.details}</p>
                    </CardBody>
                  </Colxx>
                </Row>
              </TabPane>
              <TabPane tabId="comments">
                <Row>
                  <Colxx sm="12">
                    <CardBody>
                      {comments?.length > 0 ?
                        <>
                          {comments.map((item: any) => {
                            return (
                              <CommentWithLikes
                                className={''}
                                data={item?.node}
                                key={`comments_${item.node.id}`}
                              />
                            );
                          })}
                        </>
                        : ''}
                      <InputGroup className="comment-container">
                        <InputGroup className="input-group-prepend">
                          <Input {...commentsRest} innerRef={commentsRef} placeholder="Añadir comentarios" />
                          <Button color="primary" className="btn-rounded-preppend" onClick={() => {
                            return saveComment(methods.getValues());
                          }}>
                            <span className="d-inline-block">
                              {<IntlMessages id="pages.send" />}
                            </span>{' '}
                            <i className="simple-icon-arrow-right ml-2" />
                          </Button>
                        </InputGroup>
                      </InputGroup>
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
