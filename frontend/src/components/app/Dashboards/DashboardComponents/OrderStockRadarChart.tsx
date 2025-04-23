import React from 'react';
import { Card, CardBody, CardTitle } from 'reactstrap';

import IntlMessages from '../../../../helpers/IntlMessages';
// import { RadarChart } from '../../Charts/index';

import { radarChartData } from '../../../../stores/data/charts';

const OrderStockRadarChart = () => {
  return (
    <Card className="h-100">
      <CardBody>
        <CardTitle>
          <IntlMessages id="dashboards.order-stock" />
        </CardTitle>
        <div className="chart-container">
          {/* <RadarChart shadow data={radarChartData} /> */}
        </div>
      </CardBody>
    </Card>
  );
};

export default OrderStockRadarChart;
