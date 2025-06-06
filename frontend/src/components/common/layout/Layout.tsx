// Componente principal de diseño que controla la estructura de la interfaz de
//  usuario basada en el estado de autenticación del usuario.

import jwt_decode from 'jwt-decode';
import React, { useCallback, useEffect } from 'react';
import { useClearCache } from 'react-clear-cache';
import { useIdleTimer } from 'react-idle-timer';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router';
import * as LoginActions from '../../../stores/actions/LoginActions';

import Basic from './basic/Basic';
import Main from './main/Main';

// Extracción de datos de autenticación desde Redux y localStorage.

const Layout = (props: any) => {
  const { userId } = props.loginReducer;
  const token = localStorage.getItem('token');
  const classNameMenu = {
    containerClassnames: props.menuReducer.containerClassnames,
  };

// Hook para gestionar actualizaciones de la aplicación y limpieza de caché.

  const { isLatestVersion, emptyCacheStorage, latestVersion } = useClearCache();

  let navigate = useNavigate();

// Función que verifica si la versión de la aplicación es la más reciente y limpia el caché
//  si es necesario para asegurar actualizaciones correctas.

  const initData = useCallback(async () => {
    if (!isLatestVersion) {
      // console.log('borrando cache');
      await emptyCacheStorage();
    }
  }, [isLatestVersion]);

// Ejecuta la verificación de versión al montar el componente.

  useEffect(() => {
    initData();
  }, [initData]);

// Verifica la validez del token JWT cada vez que cambia el estado de login.
// Si el token ha expirado cierra la sesión automáticamente.

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

// Cierra la sesión y redirecciona al login.
// Esta función se llama cuando expira el token o por inactividad

  const handleLogout = async () => {
    await props.logout({}).then(navigate('/login'));
  };

// Manejador que se activa cuando el usuario está inactivo.
// Verifica si el token ha expirado y cierra sesión si es necesario.

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

// Manejador que se activa cuando el usuario vuelve a estar activo.
// Verifica la validez del token por seguridad.

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

// Manejador que se activa con cualquier acción del usuario.
// Verifica la validez del token para mantener la seguridad.

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

// Configuración del temporizador de inactividad.
// Supervisa la actividad del usuario para gestionar la seguridad de la sesión.
// 5 segundos (5000ms) para verificar el estado del token.

  const { getRemainingTime, getLastActiveTime } = useIdleTimer({
    timeout: 5000,
    onIdle: handleOnIdle,
    onActive: handleOnActive,
    onAction: handleOnAction,
  });

// Renderizado condicional basado en el estado de autenticación:
// - Main: Layout completo con menú para usuarios autenticados.
// - Basic: Layout simplificado para usuarios no autenticados.

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

// Mapeo de acciones de Redux para dispatchear desde el componente que incluye principalmente acciones
// relacionadas con la autenticación.
const mapDispatchToProps = {
  ...LoginActions,
};

// Mapeo del estado de Redux para acceder desde el componente que conecta con los reducers de login 
// y menú.

const mapStateToProps = ({ loginReducer, menuReducer }: any) => {
  return { loginReducer, menuReducer };
};

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
