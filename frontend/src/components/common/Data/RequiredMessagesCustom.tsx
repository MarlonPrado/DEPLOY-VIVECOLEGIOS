import React from 'react'

import IntlMessages from '../../../helpers/IntlMessages'

const RequiredMessagesCustom = ({ formState, register }: any) => {
  return (
    <>
      {formState?.errors[register] ?
        <div className="invalid-feedback d-block" >
          <IntlMessages id="forms.inputRequired" />
        </div >
        :
        <></>
      }
    </>
  )
}

export default RequiredMessagesCustom