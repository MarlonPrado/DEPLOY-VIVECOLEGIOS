import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router';
import { NavLink } from 'react-router-dom';
import {
  Card,
  CardBody,
  CardTitle,
  Nav,
  NavItem,
  Row,
  TabContent,
  TabPane,
} from 'reactstrap';
import IntlMessages from '../../../../helpers/IntlMessages';
import { Colxx } from '../../../common/CustomBootstrap';
import UserCardBasic from '../AplicationsComponents/UserCardBasic';
// import DoughnutChart from '../../Charts/Doughnut';
import ProfileImg from '../../../../assets/img/profiles/l-1.jpg';
import ProfileImgEmpty from '../../../../assets/img/profiles/empty.png';
import { ThemeColors } from '../../../../helpers/ThemeColors';

const ElectionsApp = (props: any) => {
  const [activeTab, setActiveTab] = useState('people');
  const [itemSelected, setItemSelected] = useState(null);
  const colors = ThemeColors();

  let navigate = useNavigate();

  useEffect(() => { }, []);

  const setItemHandle = (key: any) => {
    setItemSelected(key);
  }

  const dataPeople = [
    {
      name: 'Voto en blanco',
      status: '--',
      thumb: ProfileImgEmpty,
      large: ProfileImgEmpty,
      key: 0,
    },
    {
      name: 'Maria Daniela Cárdenas Diaz',
      status: 'Once A',
      thumb: ProfileImg,
      large: ProfileImg,
      key: 1,
    },
    {
      name: 'Dany Sofia Rincón Florez',
      status: 'Once B',
      thumb: ProfileImg,
      large: ProfileImg,
      key: 2,
    },
    {
      name: 'Jose Daniel Pedraza',
      status: 'Once C',
      thumb: ProfileImg,
      large: ProfileImg,
      key: 3,
    },
    {
      name: 'Luis Alberto Botero Castaño',
      status: 'Once D',
      thumb: ProfileImg,
      large: ProfileImg,
      key: 4,
    },
  ];

  const doughnutChartData = {
    labels: ['Maria Cárdenas', 'Dany Rincón', 'Jose Pedraza', 'Luis Botero', 'Voto en blanco'],
    datasets: [
      {
        label: '',
        borderColor: [colors.themeColor3, colors.themeColor2, colors.themeColor1],
        backgroundColor: [
          colors.themeColor3_10,
          colors.themeColor2_10,
          colors.themeColor1_10,
        ],
        borderWidth: 2,
        data: [45, 25, 36, 48, 10],
      },
    ],
  };

  return (
    <>
      <Row>
        <Colxx xxs="12">
          <h1 className='font-bold'>Elecciones-personero 2022 </h1>


          <Nav tabs className="separator-tabs ml-0 mb-5">
            <NavItem>
              <NavLink
                className={classNames({
                  active: activeTab === 'people',
                  'nav-link': true,
                })}
                onClick={() => { return setActiveTab('people') }}
                to="#"
              >
                <IntlMessages id="pages.candidates" />
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classNames({
                  active: activeTab === 'results',
                  'nav-link': true,
                })}
                onClick={() => { return setActiveTab('results') }}
                to="#"
              >
                <IntlMessages id="pages.results" />
              </NavLink>
            </NavItem>
          </Nav>

          <TabContent activeTab={activeTab}>
            <TabPane tabId="people">
              <Row>
                {dataPeople.map((itemData: any) => {
                  return (
                    <Colxx
                      xxs="12"
                      md="6"
                      lg="4"
                      key={`people_${itemData.key}`}
                    >
                      <UserCardBasic itemSelected={itemSelected} data={itemData} setItem={setItemHandle} />
                    </Colxx>
                  );
                })}
              </Row>
            </TabPane>
            <TabPane tabId="results">
              <Row>
                <Card className="h-100 w-100">
                  <CardBody>
                    <CardTitle>
                      <IntlMessages id="pages.results" />
                    </CardTitle>
                    <div className="dashboard-donut-chart">
                      {/* <DoughnutChart shadow data={doughnutChartData} /> */}
                    </div>
                  </CardBody>
                </Card>
              </Row>
            </TabPane>
          </TabContent>
        </Colxx>
      </Row>
    </>
  );
};
const mapDispatchToProps = {};

const mapStateToProps = ({ }: any) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ElectionsApp);
