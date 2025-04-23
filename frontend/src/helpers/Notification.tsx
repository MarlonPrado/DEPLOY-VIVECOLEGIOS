import React from 'react';
import { NotificationManager } from '../components/common/Notifications';
import IntlMessages from './IntlMessages';

export const createNotification = (type: any, message: any, className: any) => {
  const cName = className || '';
  switch (type) {
    case 'info':
      NotificationManager.info(<IntlMessages id={`message.${message}`} />, <IntlMessages id="info.info" />, 3000, null, null, cName);
      break;
    case 'success':
      NotificationManager.success(<IntlMessages id={`message.${message}`} />, <IntlMessages id="info.success" />, 3000, null, null, cName);
      break;
    case 'warning':
      NotificationManager.warning(<IntlMessages id={`message.${message}`} />, <IntlMessages id="info.warning" />, 3000, null, null, cName);
      break;
    case 'error':
      NotificationManager.error(        
        <IntlMessages id={`message.${message}`} />,
        <IntlMessages id="info.error" />,
        5000,
        null,
        null,
        cName,
      );
      break;
    default:
      NotificationManager.info('Info message', null, null, null, null, null);
      break;
  }
};
