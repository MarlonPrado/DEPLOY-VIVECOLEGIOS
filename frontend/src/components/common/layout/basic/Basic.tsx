import React from 'react';
import { connect } from 'react-redux';
import { Card, Row } from 'reactstrap';
import { injectIntl } from 'react-intl';
import * as LoginActions from '../../../../stores/actions/LoginActions';
import { Colxx } from '../../CustomBootstrap';

const Basic = (props: any) => {
  document.body.classList.add('background');

  return (
    <>
      {props.children}
    </>
  );
};

// const mapDispatchToProps = {
//   ...LoginActions,
// };

// const mapStateToProps = ({ loginReducer }: any) => { return loginReducer };

export default injectIntl(Basic);
