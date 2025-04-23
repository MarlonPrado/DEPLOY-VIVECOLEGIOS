/* eslint-disable react/no-array-index-key */
import classnames from 'classnames';
import React, { useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { CardHeader, Nav, NavItem, TabContent, TabPane } from 'reactstrap';
import IntlMessages from '../../../../helpers/IntlMessages';
import { getInitialsName } from '../../../../helpers/Utils';
import * as chatActions from '../../../../stores/actions/Chat/ChatActions';
import ApplicationMenu from '../AplicationsComponents/ApplicationMenu';


const ChatApplicationMenu = (props: any
) => {
  const [searchKey, setSearchKey] = useState('');

  const handleSearchContact = (keyword: string) => {
    setSearchKey(keyword);

    if (keyword.length > 0) {
      if (props.activeTab !== 'contacts') {
        props.toggleAppMenu('contacts');
      }
      props.searchContactAction(keyword);
    } else {
      props.searchContactAction('');
    }
  };

  const toggleMenu = (tab: string) => {
    if (props.activeTab !== tab) {
      props.toggleAppMenu(tab);
    }
    if (tab === 'messages') {
      handleSearchContact('');
    }
  };

  const handleConversationClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, selectedUserId: any) => {
    props.changeConversation(selectedUserId);
    handleSearchContact('');
  };

  const handleContactClick = (userId: any) => {
    if (props.activeTab !== 'messages') {
      props.toggleAppMenu('messages');
      props.searchContact('');
    }

    const conversation = props.chatReducer.conversations.find(
      (x: { users: string | any[]; }) => x.users.includes(props.chatReducer.currentUser.id) && x.users.includes(userId)
    );
    if (conversation) {
      props.changeConversation(userId);
    } else {
      props.createConversation(props.chatReducer.currentUser.id, userId, props.chatReducer.conversations);
      props.changeConversation(userId);
    }
  };

  // const { messages } = intl;

  return (
    <ApplicationMenu>
      <CardHeader className="pl-0 pr-0">
        <Nav tabs className="card-header-tabs ml-0 mr-0">
          <NavItem className="w-50 text-center">
            <NavLink
              to="#"
              className={classnames({
                active: props.activeTab === 'messages',
                'nav-link': true,
              })}
              onClick={() => toggleMenu('messages')}
            >
              <IntlMessages id="chat.messages" />
            </NavLink>
          </NavItem>
          <NavItem className="w-50 text-center">
            <NavLink
              to="#"
              className={classnames({
                active: props.activeTab === 'contacts',
                'nav-link': true,
              })}
              onClick={() => props.toggleAppMenu('contacts')}
            >
              <IntlMessages id="chat.contacts" />
            </NavLink>
          </NavItem>
        </Nav>
      </CardHeader>

      <div className="pt-4 pr-4 pl-4 pb-0">
        <div className="form-group">
          <input
            type="text"
            className="form-control rounded"
            placeholder='buscar'
            value={searchKey}
            onChange={(e) => handleSearchContact(e.target.value)}
          />
        </div>
      </div>

      <TabContent activeTab={props.activeTab} className="chat-app-tab-content">
        <TabPane tabId="messages" className="chat-app-tab-pane">
          <PerfectScrollbar
            options={{ suppressScrollX: true, wheelPropagation: false }}
          >
            <div className="pt-2 pr-4 pl-4 pb-2">
              {props.chatReducer.loadingContacts &&
                props.chatReducer.loadingConversations &&
                props.chatReducer.conversations.map((item: { users: any[]; lastMessageTime: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal; }, index: React.Key) => {
                  const otherUser = props.chatReducer.allContacts.find(
                    (u: { id: any; }) => u.id === item.users.find((x: any) => x !== props.chatReducer.currentUser.id)
                  );
                  return (
                    <div
                      key={index}
                      className="d-flex flex-row mb-1 border-bottom pb-3 mb-3"
                    >
                      <NavLink
                        className="d-flex"
                        to="#"
                        onClick={(e) =>
                          handleConversationClick(e, otherUser.id)
                        }
                      >
                        <span className="img-thumbnail border-0 span-initials rounded-circle mr-3 list-thumbnail align-self-center xsmall">{getInitialsName(otherUser.name)}</span>
                        <div className="d-flex flex-grow-1 min-width-zero">
                          <div className="pl-0 align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero">
                            <div className="min-width-zero">
                              <p className=" mb-0 truncate">{otherUser.name}</p>
                              <p className="mb-1 text-muted text-small">
                                {item.lastMessageTime}
                              </p>
                            </div>
                          </div>
                        </div>
                      </NavLink>
                    </div>
                  );
                })}
            </div>
          </PerfectScrollbar>
        </TabPane>
        <TabPane tabId="contacts" className="chat-app-tab-pane">
          <PerfectScrollbar
            options={{ suppressScrollX: true, wheelPropagation: false }}
          >
            <div className="pt-2 pr-4 pl-4 pb-2">
              {props.chatReducer.loadingContacts &&
                props.chatReducer.contacts
                  .filter((x: { id: any; }) => x.id !== props.chatReducer.currentUser.id)
                  .map((item: { id: any; name: {}; thumb: string; }, index: React.Key) => {
                    return (
                      <div
                        key={index}
                        className="d-flex flex-row mb-3 border-bottom pb-3"
                      >
                        <NavLink
                          className="d-flex"
                          to="#"
                          onClick={() => handleContactClick(item.id)}
                        >
                          <span className="img-thumbnail border-0 span-initials rounded-circle mr-3 list-thumbnail align-self-center xsmall">{getInitialsName(item.name)}</span>
                          <div className="d-flex flex-grow-1 min-width-zero">
                            <div className="m-2 pl-0 align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero">
                              <div className="min-width-zero">
                                <p className="mb-0 truncate">{item.name?.toString()}</p>
                              </div>
                            </div>
                          </div>
                        </NavLink>
                      </div>
                    );
                  })}
            </div>
          </PerfectScrollbar>
        </TabPane>
      </TabContent>
    </ApplicationMenu>
  );
};

const mapDispatchToProps = { ...chatActions };

const mapStateToProps = ({ chatReducer }: any) => {
  return { chatReducer };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatApplicationMenu);
