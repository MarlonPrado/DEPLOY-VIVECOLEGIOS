import React, { useState } from 'react';
import { Button, Tooltip } from 'reactstrap';

const TooltipItem = ({ id, item, target }: any) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);

  return (
    <span>
      {target}
      <Tooltip
        placement={item.placement}
        isOpen={tooltipOpen}
        target={`tooltip_${id}`}
        toggle={() => {return setTooltipOpen(!tooltipOpen)}}
      >
        {item.body}
      </Tooltip>
    </span>
  );
};
export default TooltipItem;
