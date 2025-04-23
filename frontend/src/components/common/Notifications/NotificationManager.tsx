import { EventEmitter } from 'events';

const createUUID = () => {
  const pattern = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
  return pattern.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) || 0;
    const v = c === 'x' ? r : (r && 0x3) || 0x8;
    return v.toString(16);
  });
};

const Constants = {
  CHANGE: 'change',
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
};

class NotificationManager extends EventEmitter {
  listNotify: any[];

  constructor() {
    super();
    this.listNotify = [];
  }

  create(notify: any) {
    const defaultNotify = {
      id: createUUID(),
      type: 'info',
      title: null as any,
      message: null as any,
      timeOut: 5000,
      customClassName: '',
    };
    if (notify.priority) {
      this.listNotify.unshift(Object.assign(defaultNotify, notify));
    } else {
      this.listNotify.push(Object.assign(defaultNotify, notify));
    }
    this.emitChange();
  }

  primary(
    message: any,
    title: any,
    timeOut: any,
    onClick: any,
    priority: any,
    customClassName: any,
  ) {
    this.create({
      type: Constants.PRIMARY,
      message,
      title,
      timeOut,
      onClick,
      priority,
      customClassName,
    });
  }

  secondary(
    message: any,
    title: any,
    timeOut: any,
    onClick: any,
    priority: any,
    customClassName: any,
  ) {
    this.create({
      type: Constants.SECONDARY,
      message,
      title,
      timeOut,
      onClick,
      priority,
      customClassName,
    });
  }

  info(message: any, title: any, timeOut: any, onClick: any, priority: any, customClassName: any) {
    this.create({
      type: Constants.INFO,
      message,
      title,
      timeOut,
      onClick,
      priority,
      customClassName,
    });
  }

  success(
    message: any,
    title: any,
    timeOut: any,
    onClick: any,
    priority: any,
    customClassName: any,
  ) {
    this.create({
      type: Constants.SUCCESS,
      message,
      title,
      timeOut,
      onClick,
      priority,
      customClassName,
    });
  }

  warning(
    message: any,
    title: any,
    timeOut: any,
    onClick: any,
    priority: any,
    customClassName: any,
  ) {
    this.create({
      type: Constants.WARNING,
      message,
      title,
      timeOut,
      onClick,
      priority,
      customClassName,
    });
  }

  error(message: any, title: any, timeOut: any, onClick: any, priority: any, customClassName: any) {
    this.create({
      type: Constants.ERROR,
      message,
      title,
      timeOut,
      onClick,
      priority,
      customClassName,
    });
  }

  remove(notification: any) {
    this.listNotify = this.listNotify.filter((n) => {
      return notification.id !== n.id;
    });
    this.emitChange();
  }

  emitChange() {
    this.emit(Constants.CHANGE, this.listNotify);
  }

  addChangeListener(callback: any) {
    this.addListener(Constants.CHANGE, callback);
  }

  removeChangeListener(callback: any) {
    this.removeListener(Constants.CHANGE, callback);
  }
}

export default new NotificationManager();
