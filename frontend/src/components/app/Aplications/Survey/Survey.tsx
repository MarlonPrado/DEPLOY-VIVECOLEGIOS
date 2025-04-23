/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import {
  Row,
  Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
  Collapse,
  ButtonDropdown,
  Input,
} from 'reactstrap';

import IntlMessages from '../../../../helpers/IntlMessages';
import { Colxx, Separator } from '../../../../components/common/CustomBootstrap';
// import Breadcrumb from 'containers/navs/Breadcrumb';

// import {
//   getSurveyList,
//   getSurveyListWithOrder,
//   getSurveyListSearch,
//   selectedSurveyItemsChange,
// } from 'redux/actions';

import SurveyListItem from '../AplicationsComponents/SurveyListItem';
import AddNewSurveyModal from '../AplicationsComponents/AddNewSurveyModal';
import SurveyApplicationMenu from '../AplicationsComponents/SurveyApplicationMenu';
import * as surveyListActions from '../../../../stores/actions/Survey/SurveyList/SurveyListActions';

const getIndex = (value: any, arr: any, prop: any) => {
  for (let i = 0; i < arr.length; i += 1) {
    if (arr[i][prop] === value) {
      return i;
    }
  }
  return -1;
};

const SurveyApp = (props: any) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [dropdownSplitOpen, setDropdownSplitOpen] = useState(false);
  const [lastChecked, setLastChecked] = useState(null);
  const [displayOptionsIsOpen, setDisplayOptionsIsOpen] = useState(false);

  useEffect(() => {
    document.body.classList.add('right-menu');
    props.getSurveyList();

    return () => {
      document.body.classList.remove('right-menu');
    };
  }, [props.getSurveyList]);

  const handleCheckChange = (event: any, id: any) => {
    if (lastChecked == null) {
      setLastChecked(id);
    }

    let selectedList = Object.assign([], props.surveyListReducer.selectedItems);
    if (selectedList.includes(id)) {
      selectedList = selectedList.filter((x: any) => x !== id);
    } else {
      selectedList.push(id);
    }
    props.selectedSurveyItemsChange(selectedList);

    if (event.shiftKey) {
      let items = props.surveyListReducer.surveyItems;
      const start = getIndex(id, items, 'id');
      const end = getIndex(lastChecked, items, 'id');
      items = items.slice(Math.min(start, end), Math.max(start, end) + 1);
      selectedList.push(
        ...items.map((item: any) => {
          return item.id;
        })
      );
      selectedList = Array.from(new Set(selectedList));
      props.selectedSurveyItemsChange(selectedList);
    }
  };

  const handleChangeSelectAll = () => {
    if (props.surveyListReducer.loading) {
      if (props.surveyListReducer.selectedItems.length >= props.surveyListReducer.surveyItems.length) {
        props.selectedSurveyItemsChange([]);
      } else {
        props.selectedSurveyItemsChange(props.surveyListReducer.surveyItems.map((x: any) => x.id));
      }
    }
  };


  return (
    <>
      <Row className="app-row survey-app">
        <Colxx xxs="12">
          <div className="mb-2">
            <h1>
              <IntlMessages id="menu.survey" />
            </h1>

            {props.surveyListReducer.loading && (
              <div className="text-zero top-right-button-container">
                <Button
                  color="primary"
                  size="lg"
                  className="top-right-button mr-1"
                  onClick={() => setModalOpen(true)}
                >
                  Nueva encuesta
                </Button>
                {/* <ButtonDropdown
                  isOpen={dropdownSplitOpen}
                  toggle={() => setDropdownSplitOpen(!dropdownSplitOpen)}
                >
                  <div className="btn btn-primary btn-lg pl-4 pr-0 check-button check-all">
                    <Input
                      className="custom-checkbox mb-0 d-inline-block"
                      type="checkbox"
                      id="checkAll"
                      checked={props.surveyListReducer.selectedItems.length >= props.surveyListReducer.surveyItems.length}
                      onClick={() => handleChangeSelectAll()}
                      onChange={() => handleChangeSelectAll()}
                      label={
                        <span
                          className={`custom-control-label ${
                            props.surveyListReducer.selectedItems.length > 0 &&
                            props.surveyListReducer.selectedItems.length < props.surveyListReducer.surveyItems.length
                              ? 'indeterminate'
                              : ''
                          }`}
                        />
                      }
                    />
                  </div>
                  <DropdownToggle
                    caret
                    color="primary"
                    className="dropdown-toggle-split btn-lg"
                  />
                  <DropdownMenu right>
                    <DropdownItem>
                      <IntlMessages id="survey.delete" />
                    </DropdownItem>
                    <DropdownItem>
                      <IntlMessages id="survey.another-action" />
                    </DropdownItem>
                  </DropdownMenu>
                </ButtonDropdown> */}
              </div>
            )}

            {/* <Breadcrumb match={match} /> */}
          </div>

          <div className="mb-2">
            <Button
              color="empty"
              className="pt-0 pl-0 d-inline-block d-md-none"
              onClick={() => {
                setDisplayOptionsIsOpen(!displayOptionsIsOpen);
              }}
            >
              <IntlMessages id="survey.display-options" />{' '}
              <i className="simple-icon-arrow-down align-middle" />
            </Button>

            <Collapse
              id="displayOptions"
              className="d-md-block mb-2"
              isOpen={displayOptionsIsOpen}
            >
              <div className="d-block d-md-inline-block">
                {/* <UncontrolledDropdown className="mr-1 float-md-left btn-group mb-1">
                  <DropdownToggle caret color="outline-dark" size="xs">
                    <IntlMessages id="survey.orderby" />
                    {props.surveyListReducer.orderColumn ? props.surveyListReducer.orderColumn.label : ''}
                  </DropdownToggle>
                  <DropdownMenu>
                    {props.surveyListReducer.orderColumns.map((o: any, index: any) => {
                      return (
                        <DropdownItem
                          key={index}
                          onClick={() => props.getSurveyListWithOrder(o.column)}
                        >
                          {o.label}
                        </DropdownItem>
                      );
                    })}
                  </DropdownMenu>
                </UncontrolledDropdown> */}
                <div className="search-sm d-inline-block float-md-left mr-1 mb-1 align-top">
                  <input
                    type="text"
                    name="keyword"
                    id="search"
                    placeholder={'Buscar'}
                    defaultValue={props.surveyListReducer.searchKeyword}
                    onKeyPress={(e: any) => {
                      if (e.key === 'Enter') {
                        props.getSurveyListSearch(e.target.value);
                      }
                    }}
                  />
                </div>
              </div>
            </Collapse>
          </div>
          <Separator className="mb-5" />
          <Row>
            {props.surveyListReducer.loading ? (
              props.surveyListReducer.surveyItems.map((item: any, index: any) => {
                return (
                  <SurveyListItem
                    key={`todo_item_${index}`}
                    item={item}
                    handleCheckChange={handleCheckChange}
                    isSelected={
                      props.surveyListReducer.loading ? props.surveyListReducer.selectedItems.includes(item.id) : false
                    }
                  />
                );
              })
            ) : (
              <div className="loading" />
            )}
          </Row>
        </Colxx>
      </Row>

      {props.surveyListReducer.loading && <SurveyApplicationMenu />}
      <AddNewSurveyModal
        toggleModal={() => setModalOpen(!modalOpen)}
        modalOpen={modalOpen}
      />
    </>
  );
};

const mapDispatchToProps = { ...surveyListActions };

const mapStateToProps = ({ surveyListReducer }: any) => {
  return { surveyListReducer };
};

export default connect(mapStateToProps, mapDispatchToProps)(SurveyApp);