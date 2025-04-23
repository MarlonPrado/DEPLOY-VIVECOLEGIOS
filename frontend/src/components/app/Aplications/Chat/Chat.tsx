/* eslint-disable no-underscore-dangle */
/* eslint-disable react/no-array-index-key */
import React, { useEffect, useRef, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { connect } from 'react-redux';
import { Row } from 'reactstrap';
import IntlMessages from '../../../../helpers/IntlMessages';
import * as chatActions from '../../../../stores/actions/Chat/ChatActions';
import { Colxx } from '../../../common/CustomBootstrap';
import ChatApplicationMenu from '../AplicationsComponents/ChatApplicationMenu';
import ChatHeading from '../AplicationsComponents/ChatHeading';
import MessageCard from '../AplicationsComponents/MessageCard';
import SaySomething from '../AplicationsComponents/SaySomething';

const ChatApp = (
  props: any
) => {
  const [activeTab, setActiveTab] = useState('messages');
  const [messageInput, setMessageInput] = useState('');
  const scrollBarRef = useRef(null);
  useEffect(() => {
    document.body.classList.add('no-footer');
    const currentUserId = 0;
    props.getContacts();
    props.getConversations(currentUserId);

    return () => {
      document.body.classList.remove('no-footer');
    };
  }, [props.getContacts, props.getConversations]);

  const focusScrollBottom = () => {
    setTimeout(() => {
      if (scrollBarRef.current) {
        scrollBarRef.current._ps.element.scrollTop = scrollBarRef.current._ps.contentHeight;
      }
    }, 100);
  };

  useEffect(() => {
    if (
      props.chatReducer.loadingConversations &&
      props.chatReducer.loadingContacts &&
      props.chatReducer.selectedUser == null
    ) {
      props.changeConversation(props.selectedUserId);
      focusScrollBottom();
    }
  }, [
    props.changeConversation,
    props.chatReducer.loadingContacts,
    props.chatReducer.loadingConversations,
    props.chatReducer.selectedUser,
    props.chatReducer.selectedUserId,
  ]);

  useEffect(() => {
    focusScrollBottom();
  }, [props.selectedUserId]);

  const handleChatInputPress = (e: any) => {
    if (e.key === 'Enter') {
      if (messageInput.length > 0) {
        props.addMessageToConversation(
          props.chatReducer.currentUser.id,
          props.chatReducer.selectedUser.id,
          messageInput,
          props.chatReducer.conversations,
        );
        setMessageInput('');
        setActiveTab('messages');
        focusScrollBottom();
      }
    }
  };

  const handleSendButtonClick = () => {
    if (messageInput.length > 0) {
      props.addMessageToConversation(
        props.chatReducer.currentUser.id,
        props.chatReducer.selectedUser.id,
        messageInput,
        props.chatReducer.conversations,
      );
      setMessageInput('');
      setActiveTab('messages');
      focusScrollBottom();
    }
  };

  const selectedConversation =
    props.chatReducer.loadingConversations &&
      props.chatReducer.loadingContacts &&
      props.chatReducer.selectedUser
      ? props.chatReducer.conversations.find(
        (x: any) =>
          x.users.includes(props.chatReducer.currentUser.id) &&
          x.users.includes(props.chatReducer.selectedUser.id),
      )
      : null;

  return props.chatReducer.loadingConversations && props.chatReducer.loadingContacts ? (
    <>
      <div className="dashboard-wrapper">
        <Row className="app-row">
          <Colxx xxs="12" className="chat-app">
            {props.chatReducer.loadingConversations && props.chatReducer.selectedUser && (
              <ChatHeading
                name={props.chatReducer.selectedUser.name}
                thumb={props.chatReducer.selectedUser.thumb}
                lastSeenDate={props.chatReducer.selectedUser.lastSeenDate}
              />
            )}

            {selectedConversation && (
              <PerfectScrollbar
                ref={scrollBarRef}
                // containerRef={(ref) => {}}
                options={{ suppressScrollX: true, wheelPropagation: false }}
              >
                {selectedConversation.messages.map((item: any, index: any) => {
                  const sender = props.chatReducer.allContacts.find(
                    (x: any) => x.id === item.sender,
                  );
                  return (
                    <MessageCard
                      key={index}
                      sender={sender}
                      item={item}
                      currentUserid={props.chatReducer.currentUser.id}
                    />
                  );
                })}
              </PerfectScrollbar>
            )}
          </Colxx>
        </Row>
      </div>
      <SaySomething
        placeholder={'Escribir mensaje...'}
        messageInput={messageInput}
        handleChatInputPress={handleChatInputPress}
        handleChatInputChange={(e: any) => {
          setMessageInput(e.target.value);
        }}
        handleSendButtonClick={handleSendButtonClick}
      />
      <ChatApplicationMenu activeTab={activeTab} toggleAppMenu={setActiveTab} />
    </>
  ) : (
    <div className="loading" />
  );
};

const mapDispatchToProps = { ...chatActions };

const mapStateToProps = ({ chatReducer }: any) => {
  return { chatReducer };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatApp);
