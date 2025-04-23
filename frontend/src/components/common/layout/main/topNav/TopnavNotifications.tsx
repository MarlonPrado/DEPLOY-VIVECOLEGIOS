/* eslint-disable react/no-array-index-key */
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router';
import {
  DropdownMenu, DropdownToggle, NavLink, UncontrolledDropdown
} from 'reactstrap';
import * as notificationActions from '../../../../../stores/actions/NotificationAction';


const NotificationItem = ({ title, dateSend,dateRead, id, markAsRead }:any) => {
  return (
    <div onClick={() => {
      return markAsRead(id);
    }} className="d-flex flex-row mb-3 pb-3 border-bottom cursor-pointer">    
        <i className='iconsminds-mail-send icon-big text-primary'/>
      <div className="pl-3 pr-2">
          <p className={`font-weight-medium mb-0 ${dateRead ? '' : 'font-bold'}`}>{title}</p>
          <p className={`text-muted mb-0 text-small ${dateRead ? '' : 'font-bold'}`}>{moment(dateSend).format('YYYY-MM-DD h:mm a')}</p>
      </div>
    </div>
  );
};

const TopnavNotifications = (props: any) => {
  const [notifications, setNotifications] = useState([]);
  
  useEffect(() => {
    props.getListSomeNotification(props?.loginReducer?.userId).then((listData: any) => {
      setNotifications(listData.filter((x:any)=>(!x?.node?.dateRead)).map((c:any)=>{return c.node}));
    });
  }, []);

  const markAsRead = async (item: any) => {
    //console.log(item)
    props.updateNotification({ dateRead: new Date() }, item).then((listData: any) => {
      props.getListSomeNotification(props?.loginReducer?.userId).then((listData: any) => {
        setNotifications(listData.filter((x:any)=>(!x?.node?.dateRead)).map((c:any)=>{return c.node}));
      });
    });
  };


  return (
    <div className="position-relative d-inline-block">
      <UncontrolledDropdown className="dropdown-menu-right">
        <DropdownToggle
          className="header-icon notificationButton"
          color="empty"
        >
          <i className="simple-icon-bell" />
          <span className="count">{notifications.length}</span>          
        </DropdownToggle>
        <DropdownMenu
          className="position-absolute mt-3 scroll"
          end
          id="notificationDropdown"
        >
          <PerfectScrollbar
            options={{ suppressScrollX: true, wheelPropagation: false }}
          >
            {notifications.map((notification: any) => {
              return <NotificationItem markAsRead={markAsRead} key={notification?.id} {...notification } />;
            })}
          </PerfectScrollbar>
        </DropdownMenu>
      </UncontrolledDropdown>
    </div>
  );
};

const mapDispatchToProps = { ...notificationActions };

const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

export default connect(mapStateToProps, mapDispatchToProps)(TopnavNotifications);


