import React from 'react';
import { Col } from 'reactstrap';

const Colxx = (props: any ) => {return (
  <Col {...props} widths={['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl']} />
)};
const Separator = ({ className }: any) => {return (
  <div className={`separator ${className}`} />
)};
export { Colxx, Separator };
