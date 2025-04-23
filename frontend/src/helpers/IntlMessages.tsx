import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';

const InjectMassage = (props:any) => {return <FormattedMessage {...props} />};

export default injectIntl(InjectMassage, {
  // withRef: false,
});
