import React from 'react'
import { FormGroup } from 'reactstrap'

const FormGroupCustom = ({ children }: any) => {
  return (
    <FormGroup className="form-group error-l-100 tooltip-label-right">
      {children}
    </FormGroup>
  )
}

export default FormGroupCustom