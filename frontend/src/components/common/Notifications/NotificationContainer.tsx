import PropTypes from 'prop-types';
import React from 'react';

import NotificationManager from './NotificationManager';
import Notifications from './Notifications';

class NotificationContainer extends React.Component {
  constructor(props: any) {
    super(props);
    NotificationManager.addChangeListener(this.handleStoreChange);
    this.state = {
      notifications: [],
    };
  }

  componentWillUnmount = () => {
    NotificationManager.removeChangeListener(this.handleStoreChange);
  };

  handleStoreChange = (notifications:any) => {
    this.setState({
      notifications,
    });
  };

  handleRequestHide = (notification:any) => {
    NotificationManager.remove(notification);
  };

  render() {
    const { notifications } = this.state as any;
    const { enterTimeout, leaveTimeout } = this.props as any;
    return (
      <Notifications
        enterTimeout={enterTimeout}
        leaveTimeout={leaveTimeout}
        notifications={notifications}
        onRequestHide={this.handleRequestHide}
      />
    );
  }
}

// NotificationContainer.propTypes = {
//   enterTimeout: PropTypes.number,
//   leaveTimeout: PropTypes.number,
// };

// NotificationContainer.defaultProps = {
//   enterTimeout: 400,
//   leaveTimeout: 400,
// };

export default NotificationContainer;
