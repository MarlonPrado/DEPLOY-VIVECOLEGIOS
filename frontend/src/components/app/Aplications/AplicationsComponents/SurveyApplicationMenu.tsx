/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable react/no-array-index-key */
import React from 'react';
import { connect } from 'react-redux';
import { NavItem, Badge } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import classnames from 'classnames';

import IntlMessages from '../../../../helpers/IntlMessages';
import ApplicationMenu from '../AplicationsComponents/ApplicationMenu';

import * as surveyListActions  from '../../../../stores/actions/Survey/SurveyList/SurveyListActions';

const SurveyApplicationMenu = (props: any) => {
  const addFilter = (column: any, value: any) => {
    props.getSurveyListWithFilter(column, value);
  };

  return (
    <ApplicationMenu>
      <PerfectScrollbar
        options={{ suppressScrollX: true, wheelPropagation: false }}
      >
        <div className="p-4">
          <p className="text-muted text-small">
            Estado
          </p>
          <ul className="list-unstyled mb-5">
            <NavItem className={classnames({ active: !props.surveyListReducer.filter })}>
              <NavLink to="#" onClick={() => addFilter('', '')}>
                <i className="simple-icon-reload" />
                 Todas
                <span className="float-right">
                  {props.surveyListReducer.loading && props.surveyListReducer.allSurveyItems.length}
                </span>
              </NavLink>
            </NavItem>
            <NavItem
              className={classnames({
                active:
                  props.surveyListReducer.filter &&
                  props.surveyListReducer.filter.column === 'status' &&
                  props.surveyListReducer.filter.value === 'ACTIVE',
              })}
            >
              <NavLink
                to="#"
                onClick={() => addFilter('status', 'ACTIVE')}
              >
                <i className="simple-icon-refresh" />
                Activas
                <span className="float-right">
                  {props.surveyListReducer.loading &&
                    props.surveyListReducer.surveyItems.filter((x: any) => x.status === 'ACTIVE').length}
                </span>
              </NavLink>
            </NavItem>
            <NavItem
              className={classnames({
                active:
                  props.surveyListReducer.filter &&
                  props.surveyListReducer.filter.column === 'status' &&
                  props.surveyListReducer.filter.value === 'COMPLETED',
              })}
            >
              <NavLink
                to="#"
                onClick={() => addFilter('status', 'COMPLETED')}
              >
                <i className="simple-icon-check" />
                Completadas
                <span className="float-right">
                  {props.surveyListReducer.loading &&
                    props.surveyListReducer.surveyItems.filter((x: any) => x.status === 'COMPLETED').length}
                </span>
              </NavLink>
            </NavItem>
          </ul>
          <p className="text-muted text-small">
            Categorias
          </p>
          <ul className="list-unstyled mb-5">
            {props.surveyListReducer.categories.map((c: any, index: any) => {
              return (
                <NavItem key={index}>
                  <div onClick={() => addFilter('category', c)}>
                    <div className="custom-control custom-radio">
                      <input
                        type="radio"
                        className="custom-control-input"
                        defaultChecked={
                          props.surveyListReducer.filter &&
                          props.surveyListReducer.filter.column === 'category' &&
                          props.surveyListReducer.filter.value === c
                        }
                      />
                      <label className="custom-control-label">{c}</label>
                    </div>
                  </div>
                </NavItem>
              );
            })}
          </ul>
          <p className="text-muted text-small">
            Etiquetas
          </p>
          <div>
            {props.surveyListReducer.labels.map((l: any, index: any) => {
              return (
                <p className="d-sm-inline-block mb-1" key={index}>
                  <NavLink
                    to="#"
                    onClick={() => addFilter('label', l.label)}
                  >
                    <span
                      className={`${
                        props.surveyListReducer.filter &&
                        props.surveyListReducer.filter.column === 'label' &&
                        props.surveyListReducer.filter.value === l.label
                          ? `badge badge-${l.color} mb-1 rounded-pill`
                          : `badge badge-outline-${l.color} mb-1 rounded-pill`
                      }`}
                    >
                      {l.label}
                    </span>
                  </NavLink>
                </p>
              );
            })}
          </div>
        </div>
      </PerfectScrollbar>
    </ApplicationMenu>
  );
};

const mapDispatchToProps = { ...surveyListActions };

const mapStateToProps = ({ surveyListReducer }: any) => {
  return { surveyListReducer };
};

export default connect(mapStateToProps, mapDispatchToProps)(SurveyApplicationMenu);