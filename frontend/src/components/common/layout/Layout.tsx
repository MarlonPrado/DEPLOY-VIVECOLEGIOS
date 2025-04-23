import jwt_decode from 'jwt-decode';
import React, { useCallback, useEffect } from 'react';
import { useClearCache } from 'react-clear-cache';
import { useIdleTimer } from 'react-idle-timer';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router';
import * as LoginActions from '../../../stores/actions/LoginActions';

import Basic from './basic/Basic';
import Main from './main/Main';

const Layout = (props: any) => {
  const { userId } = props.loginReducer;
  const token = localStorage.getItem('token');
  const classNameMenu = {
    containerClassnames: props.menuReducer.containerClassnames,
  };

  const { isLatestVersion, emptyCacheStorage, latestVersion } = useClearCache();

  let navigate = useNavigate();

  const initData = useCallback(async () => {
    if (!isLatestVersion) {
      // console.log('borrando cache');
      await emptyCacheStorage();
    }
  }, [isLatestVersion]);

  useEffect(() => {
    initData();
  }, [initData]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (props?.loginReducer?.userId?.length > 0 && token != null) {
      const now = Math.floor(Date.now() / 1000);
      const isExpired = jwt_decode(token) as any;
      if (isExpired?.exp <= now) {
        handleLogout();
      }
    }
  }, [props.loginReducer]);

  const handleLogout = async () => {
    await props.logout({}).then(navigate('/login'));
  };

  const handleOnIdle = () => {
    const token = localStorage.getItem('token');
    if (token != null && token !== undefined) {
      const now = Math.floor(Date.now() / 1000);
      const isExpired = jwt_decode(token) as any;
      if (isExpired?.exp <= now) {
        handleLogout();
      }
    }
  };

  const handleOnActive = () => {
    const token = localStorage.getItem('token');
    if (token != null && token !== undefined) {
      const now = Math.floor(Date.now() / 1000);
      const isExpired = jwt_decode(token) as any;
      if (isExpired?.exp <= now) {
        handleLogout();
      }
    }
  };

  const handleOnAction = () => {
    const token = localStorage.getItem('token');
    if (token != null && token !== undefined) {
      const now = Math.floor(Date.now() / 1000);
      const isExpired = jwt_decode(token) as any;
      if (isExpired?.exp <= now) {
        handleLogout();
      }
    }
  };

  const { getRemainingTime, getLastActiveTime } = useIdleTimer({
    timeout: 5000,
    onIdle: handleOnIdle,
    onActive: handleOnActive,
    onAction: handleOnAction,
  });

  return (
    <>
      {userId?.length > 0 && token?.length > 0 ? (
        <Main {...classNameMenu}>{props.children}</Main>
      ) : (
        <Basic>{props.children}</Basic>
      )}
    </>
  );
};

const mapDispatchToProps = {
  ...LoginActions,
};

const mapStateToProps = ({ loginReducer, menuReducer }: any) => {
  return { loginReducer, menuReducer };
};

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
