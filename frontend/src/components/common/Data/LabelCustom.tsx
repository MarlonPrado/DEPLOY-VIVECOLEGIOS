import React from 'react'
import { Label } from 'reactstrap'

import IntlMessages from '../../../helpers/IntlMessages'

const LabelCustom = ({ id, required }: any) => {
  return (
    <Label>
      <IntlMessages id={id} /> {required ? <Label className='color-theme-1 mb-0' > * </Label> : ""}
    </Label>
  )
}

export default LabelCustom