import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import * as am5xy from '@amcharts/amcharts5/xy';
import classnames from 'classnames';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Card, CardBody, CardHeader, Nav, NavItem, Row, TabContent, TabPane } from 'reactstrap';
import * as graphicsStudentAcademicGradeActions from '../../../stores/actions/GraphicsStudentAcademicGradeActions';
import { Colxx } from '../../common/CustomBootstrap';

const GraphicsGrade = (props: any) => {
  const [dataChart, setDataChart] = useState(null);
  const [activeSecondTab, setActiveSecondTab] = useState('1');

  useEffect(() => {
    getDataChart(props?.loginReducer?.schoolId, props?.loginReducer?.schoolYear);
  }, []);

  useEffect(() => {
    if (dataChart) {
      let root = am5.Root.new('chartdivBar');

      root.setThemes([am5themes_Animated.new(root)]);

      let chart = root.container.children.push(
        am5xy.XYChart.new(root, {
          panX: true,
          panY: true,
          wheelX: 'panX',
          wheelY: 'zoomX',
          pinchZoomX: true,
        }),
      );

      let cursor = chart.set('cursor', am5xy.XYCursor.new(root, {}));
      cursor.lineY.set('visible', false);

      let xRenderer = am5xy.AxisRendererX.new(root, { minGridDistance: 30 });
      xRenderer.labels.template.setAll({
        rotation: -90,
        centerY: am5.p50,
        centerX: am5.p100,
        paddingRight: 15,
      });

      let xAxis = chart.xAxes.push(
        am5xy.CategoryAxis.new(root, {
          maxDeviation: 0.3,
          categoryField: 'category',
          renderer: xRenderer,
          tooltip: am5.Tooltip.new(root, {}),
        }),
      );

      let yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(root, {
          maxDeviation: 0.3,
          renderer: am5xy.AxisRendererY.new(root, {}),
        }),
      );

      // Create series
      // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
      let series = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          name: 'Series 1',
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: 'value',
          sequencedInterpolation: true,
          categoryXField: 'category',
          tooltip: am5.Tooltip.new(root, {
            labelText: '{valueY}',
          }),
        }),
      );

      series.columns.template.setAll({ cornerRadiusTL: 5, cornerRadiusTR: 5 });
      series.columns.template.adapters.add('fill', function (fill, target) {
        return chart.get('colors').getIndex(series.columns.indexOf(target));
      });

      series.columns.template.adapters.add('stroke', function (stroke, target) {
        return chart.get('colors').getIndex(series.columns.indexOf(target));
      });

      xAxis.data.setAll(dataChart);
      series.data.setAll(dataChart);

      // Make stuff animate on load
      // https://www.amcharts.com/docs/v5/concepts/animations/

      series.data.setAll(dataChart);
      series.appear(1000);
      chart.appear(1000, 100);
    }
  }, [dataChart]);

  useEffect(() => {
    if (dataChart) {
      let root = am5.Root.new('chartdiv');
      root.setThemes([am5themes_Animated.new(root)]);
      let chart = root.container.children.push(
        am5percent.PieChart.new(root, {
          layout: root.verticalLayout,
        }),
      );
      let series = chart.series.push(
        am5percent.PieSeries.new(root, {
          valueField: 'value',
          categoryField: 'category',
        }),
      );
      series.labels.template.set(
        'text',
        "{category}: [bold]{valuePercentTotal.formatNumber('0.00')}%[/] ({value})",
      );
      series.data.setAll(dataChart);
      series.appear(1000, 100);
    }
  }, [dataChart]);

  const getDataChart = async (schoolId: any, schoolYearId: any) => {
    props.dataGraphicsStudentAcademicGrade(schoolId, schoolYearId).then((listData: any) => {
      setDataChart(
        listData.map((c: any) => {
          return { category: c.node.name, value: c.node.countStudent };
        }),
      );
    });
  };

  return (
    <>
      <Colxx xxs="12" xs="12" lg="12">
        <Card className="mb-4">
          <CardHeader className="pl-0 pr-0">
            <Nav tabs className=" card-header-tabs  ml-0 mr-0">
              <NavItem className="w-50 text-center">
                <NavLink
                  to="#"
                  className={classnames({
                    active: activeSecondTab === '1',
                    'nav-link': true,
                  })}
                  onClick={() => {
                    setActiveSecondTab('1');
                  }}
                >
                  <div className="glyph-icon iconsminds-pie-chart-3"></div>
                </NavLink>
              </NavItem>
              <NavItem className="w-50 text-center">
                <NavLink
                  to="#"
                  className={classnames({
                    active: activeSecondTab === '2',
                    'nav-link': true,
                  })}
                  onClick={() => {
                    setActiveSecondTab('2');
                  }}
                >
                  <div className="glyph-icon iconsminds-bar-chart-4"></div>
                </NavLink>
              </NavItem>
            </Nav>
          </CardHeader>

          <TabContent activeTab={activeSecondTab}>
            <TabPane tabId="1">
              <Row>
                <Colxx sm="12">
                  <CardBody>
                    <Row>
                      <Colxx xxs="12">
                        <Row className="icon-cards-row mb-2">
                          <div id="chartdiv" style={{ width: '100%', height: '500px' }}></div>
                        </Row>
                      </Colxx>
                    </Row>
                  </CardBody>
                </Colxx>
              </Row>
            </TabPane>
            <TabPane tabId="2">
              <Row>
                <Colxx sm="12">
                  <CardBody>
                    <Row>
                      <Colxx xxs="12">
                        <Row className="icon-cards-row mb-2">
                          <div id="chartdivBar" style={{ width: '100%', height: '500px' }}></div>
                        </Row>
                      </Colxx>
                    </Row>
                  </CardBody>
                </Colxx>
              </Row>
            </TabPane>
          </TabContent>
        </Card>
      </Colxx>
    </>
  );
};
const mapDispatchToProps = { ...graphicsStudentAcademicGradeActions };

const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

export default connect(mapStateToProps, mapDispatchToProps)(GraphicsGrade);
