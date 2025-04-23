import React from 'react';
import {
  Card,
  CardBody,
  UncontrolledDropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
} from 'reactstrap';

import IntlMessages from '../../../../helpers/IntlMessages';
// import { AreaChart } from '../../Charts/index';

import { conversionChartData } from '../../../../stores/data/charts';

const ConversionRatesChartCard = () => {
  return (
    <Card className="dashboard-filled-line-chart rounded-card">
      <CardBody>
        <div className="float-left float-none-xs">
          <div className="d-inline-block">
            <h5 className="d-inline">
              Rendimiento académico grupal
            </h5>
            <span className="text-muted text-small d-block">
              Detalle de rendimiento académico por grupo
            </span>
          </div>
        </div>

        <div className="btn-group float-right float-none-xs mt-2">
          <UncontrolledDropdown>
            <DropdownToggle caret color="primary" className="btn-xs" outline>
              Opciones
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem>
                Opcion 1
              </DropdownItem>
              <DropdownItem>
                Opcion 1
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      </CardBody>

      <div className="chart card-body pt-0">
        {/* <AreaChart shadow data={conversionChartData} /> */}
      </div>
    </Card>
  );
};

export default ConversionRatesChartCard;
