import classnames from 'classnames';
import React, { useState, useEffect} from 'react'
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Notification from './Notification';

const Notifications = (props:any) => {

  const handleRequestHide = (notification:any) => {return () => {
    const { onRequestHide } = props;
    if (onRequestHide) {
      onRequestHide(notification);
    }
  }};

  const [notificationsItems, setNotificationsItems] = useState([]);
  
  useEffect(()=>{
    setNotificationsItems(props?.notifications)
  },[props])

  const { enterTimeout, leaveTimeout } = props;
  const className = classnames('notification-container', {
    'notification-container-empty': notificationsItems.length === 0,
  });

  return (
    <>
      <div className={className}>
        <TransitionGroup>
          {notificationsItems.map((notification:any) => {
            const key = notification.id || new Date().getTime();
            return (
              <CSSTransition
                classNames="notification"
                key={key}
                timeout={{ exit: leaveTimeout, enter: enterTimeout }}
              >
                <Notification
                  key={key}
                  type={notification.type}
                  title={notification.title}
                  message={notification.message}
                  timeOut={notification.timeOut}
                  onClick={notification.onClick}
                  onRequestHide={handleRequestHide(notification)}
                  customClassName={notification.customClassName}
                />
              </CSSTransition>
            );
          })}
        </TransitionGroup>
      </div>
    </>
  )
}

export default Notifications
