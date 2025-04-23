import React from 'react';
import { injectIntl } from 'react-intl';
import { Row } from 'reactstrap';
import { Colxx, Separator } from '../../common/CustomBootstrap';
import ProfileStatuses from './DashboardComponents/ProfileStatuses';
import SortableStaticticsRow from './DashboardComponents/SortableStaticticsRow';
import SmallLineCharts from './DashboardComponents/SmallLineCharts';
import ProductCategoriesDoughnut from './DashboardComponents/ProductCategoriesDoughnut';
import WebsiteVisitsChartCard from './DashboardComponents/WebsiteVisitsChartCard';
import ConversionRatesChartCard from './DashboardComponents/ConversionRatesChartCard';

const DashboardAnalytics = ({ intl, match }: any) => {
  const { messages } = intl;
  return (
    <>
      <Row>
        <Colxx xxs="12">
          <p className='lead font-bold mb-0'>Informe</p>
          <p>Informe de <strong>avance y desempeño</strong></p>
          <Separator className="mb-5" />
        </Colxx>
      </Row>
      <Row>
        <Colxx sm="12" md="6" className="mb-4">
          <WebsiteVisitsChartCard />
        </Colxx>
        <Colxx sm="12" md="6" className="mb-4">
          <ConversionRatesChartCard />
        </Colxx>
      </Row>
      <Row>
        <Colxx xl="4" lg="6" md="12" className="mb-4">
          <ProductCategoriesDoughnut />
        </Colxx>
        <Colxx xl="4" lg="6" md="12" className="mb-4">
          <ProfileStatuses cardClass="dashboard-progress" />
        </Colxx>
        <Colxx xl="4" lg="12" md="12">
          <SmallLineCharts itemClass="dashboard-small-chart-analytics" />
        </Colxx>
      </Row>
      <SortableStaticticsRow messages={messages} />
      {/* <Row>
        <Colxx xxs="12" lg="6" className="mb-4">
          <OrderStockRadarChart />
        </Colxx>
        <Colxx xxs="12" lg="6" className="mb-4">
          <ProductCategoriesPolarArea />
        </Colxx>
      </Row>
      <Row>
        <Colxx xxs="12" className="mb-4">
          <SalesChartCard />
        </Colxx>
      </Row> */}
    </>
  );
};
export default injectIntl(DashboardAnalytics);
