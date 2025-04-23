import React from 'react';
import { Puff } from 'react-loader-spinner';
import { loaderColor } from '../../constants/defaultValues';

const Loader = (props: any) => {
  return (
    <>
      <Puff color={loaderColor} height={props?.size ? props?.size : 100} width={props?.size ? props?.size : 100} />
    </>
  )
};

export { Loader };

