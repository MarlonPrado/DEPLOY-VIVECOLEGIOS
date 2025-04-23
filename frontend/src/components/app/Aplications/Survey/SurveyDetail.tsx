import classnames from 'classnames';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import {
  Button,
  ButtonDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  NavItem,
  Row,
  TabContent,
  TabPane,
} from 'reactstrap';
import { Colxx } from '../../../../components/common/CustomBootstrap';
import IntlMessages from '../../../../helpers/IntlMessages';
import * as surveyDetailActions from '../../../../stores/actions/Survey/SurveyDetail/SurveyDetailActions';
// import Breadcrumb from '../../../containers/navs/Breadcrumb';
import QuestionBuilder from '../AplicationsComponents/QuestionBuilder';
// import SurveyCharts from 'containers/applications/SurveyCharts';
import SurveyDetailApplicationMenu from '../AplicationsComponents/SurveyDetailApplicationMenu';
import SurveyDetailCard from '../AplicationsComponents/SurveyDetailCard';
import SurveyQuotas from '../AplicationsComponents/SurveyQuotas';

// import {
//   getSurveyDetail,
//   deleteSurveyQuestion,
//   saveSurvey,
// } from 'redux/actions';

const SurveyDetailApp = (props: any) => {
  const [activeTab, setActiveTab] = useState('details');
  const [dropdownSplitOpen, setDropdownSplitOpen] = useState(false);

  useEffect(() => {
    document.body.classList.add('right-menu');
    props.getSurveyDetail();

    return () => {
      document.body.classList.remove('right-menu');
    };
  }, [props.getSurveyDetail]);

  const addQuestion = () => {
    let nextId = 0;
    if (props.surveyDetailReducer.survey.questions.length > 0) {
      const ordered = props.surveyDetailReducer.survey.questions.slice().sort((a: any, b: any) => {
        return a.id < b.id;
      });
      nextId = ordered[0].id + 1;
    }
    const newSurvey = { ...props.surveyDetailReducer.survey };
    newSurvey.questions.push({ id: nextId });
    props.saveSurvey(newSurvey);
  };

  return (
    <>
      <Row className="app-row survey-app">
        <Colxx xxs="12">
          <h1>
            <i className="simple-icon-refresh heading-icon" />{' '}
            <span className="align-middle d-inline-block pt-1">Developer Survey</span>
          </h1>
          <div className="text-zero top-right-button-container">
            <ButtonDropdown
              className="top-right-button top-right-button-single"
              isOpen={dropdownSplitOpen}
              toggle={() => setDropdownSplitOpen(!dropdownSplitOpen)}
            >
              <Button outline className="flex-grow-1" size="lg" color="primary">
                Guardar
              </Button>
              <DropdownToggle
                size="lg"
                className="dropdown-toggle-split btn-lg"
                caret
                outline
                color="primary"
              />
              <DropdownMenu right>
                <DropdownItem>
                  <IntlMessages id="survey.delete" />
                </DropdownItem>
                <DropdownItem disabled>
                  <IntlMessages id="survey.edit" />
                </DropdownItem>
              </DropdownMenu>
            </ButtonDropdown>
          </div>

          {/* <Breadcrumb match={match} /> */}
          {props.surveyDetailReducer.loading ? (
            <>
              <Nav tabs className="separator-tabs ml-0 mb-5">
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: activeTab === 'details',
                      'nav-link': true,
                    })}
                    to="#"
                    onClick={() => setActiveTab('details')}
                  >
                    Detalles
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    to="#"
                    className={classnames({
                      active: activeTab === 'results',
                      'nav-link': true,
                    })}
                    onClick={() => setActiveTab('results')}
                  >
                    RESULTADOS
                  </NavLink>
                </NavItem>
              </Nav>

              <TabContent activeTab={activeTab}>
                <TabPane tabId="details">
                  <Row>
                    <SurveyDetailCard survey={props.surveyDetailReducer.survey} />

                    <Colxx xxs="12" lg="8">
                      <ul className="list-unstyled mb-4">
                        {props.surveyDetailReducer.survey.questions.map((item: any, index: any) => {
                          return (
                            <li data-id={item.id} key={item.id}>
                              <QuestionBuilder
                                order={index}
                                {...item}
                                expanded={!item.title && true}
                                deleteClick={(id: any) =>
                                  props.deleteSurveyQuestion(
                                    id,
                                    props.surveyDetailReducer.survey,
                                  )
                                }
                              />
                            </li>
                          );
                        })}
                      </ul>

                      <div className="text-center">
                        <Button
                          outline
                          color="primary"
                          className="mt-3"
                          onClick={() => addQuestion()}
                        >
                          <i className="simple-icon-plus btn-group-icon" /> Nueva pregunta
                        </Button>
                      </div>
                    </Colxx>
                  </Row>
                </TabPane>
                <TabPane tabId="results">
                  <Row>
                    <SurveyQuotas />
                    {/* <SurveyCharts /> */}
                  </Row>
                </TabPane>
              </TabContent>
            </>
          ) : (
            <div className="loading" />
          )}
        </Colxx>
      </Row>
      <SurveyDetailApplicationMenu />
    </>
  );
};

const mapDispatchToProps = { ...surveyDetailActions };

const mapStateToProps = ({ surveyDetailReducer }: any) => {
  return { surveyDetailReducer };
};

export default connect(mapStateToProps, mapDispatchToProps)(SurveyDetailApp);
