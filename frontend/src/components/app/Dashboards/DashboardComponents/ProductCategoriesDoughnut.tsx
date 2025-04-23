import React from 'react';
import { Card, CardBody, CardTitle } from 'reactstrap';

import IntlMessages from '../../../../helpers/IntlMessages';
// import { DoughnutChart } from '../../Charts/index';

import { doughnutChartData } from '../../../../stores/data/charts';

const ProductCategoriesDoughnut = () => {
  return (
    <Card className="h-100 rounded-card">
      <CardBody>
        <CardTitle>
          Distribucion de experiencias de aprendizaje por asignatura
        </CardTitle>
        <div className="dashboard-donut-chart">
          {/* <DoughnutChart shadow data={doughnutChartData} /> */}
        </div>
      </CardBody>
    </Card>
  );
};

export default ProductCategoriesDoughnut;
