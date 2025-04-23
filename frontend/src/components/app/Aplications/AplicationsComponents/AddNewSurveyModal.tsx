import React, { useState } from 'react';
import { connect } from 'react-redux';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Label,
} from 'reactstrap';
import Select from 'react-select';
import CustomSelectInput from '../../../../components/common/CustomSelectInput';
import IntlMessages from '../../../../helpers/IntlMessages';

import * as surveyListActions from '../../../../stores/actions/Survey/SurveyList/SurveyListActions';

const initialState = {
  title: '',
  label: {},
  category: {},
  status: 'ACTIVE',
};

const AddNewSurveyModal = (props: any) => {
  const [state, setState] = useState(initialState);

  const addNetItem = () => {
    const newItem = {
      // OJJOOOOO
      // title: state.title,
      // label: state.label.value,
      // labelColor: state.label.color,
      // category: state.category.value,
      // status: state.status,
    };
    props.addSurveyItemAction(newItem);
    props.toggleModal();
    setState(initialState);
  };

  return (
    <Modal
      isOpen={props.surveyListReducer.modalOpen}
      toggle={props.surveyListReducer.toggleModal}
      wrapClassName="modal-right"
      backdrop="static"
    >
      <ModalHeader toggle={props.surveyListReducer.toggleModal}>
        Nueva encuesta
      </ModalHeader>
      <ModalBody>
        <Label className="mt-4">
          <IntlMessages id="survey.title" />
        </Label>
        <Input
          type="text"
          defaultValue={state.title}
          onChange={(event) =>
            setState({ ...state, title: event.target.value })
          }
        />

        <Label className="mt-4">
          <IntlMessages id="survey.category" />
        </Label>
        <Select
          isClearable
          components={{ Input: CustomSelectInput }}
          className="react-select"
          classNamePrefix="react-select"
          name="form-field-name"
          options={props.surveyListReducer.categories.map((x: any, i: any) => {
            return { label: x, value: x, key: i };
          })}
          value={state.category}
          onChange={(val) => setState({ ...state, category: val })}
        />
        <Label className="mt-4">
          <IntlMessages id="survey.label" />
        </Label>
        <Select
          isClearable
          components={{ Input: CustomSelectInput }}
          className="react-select"
          classNamePrefix="react-select"
          name="form-field-name"
          options={props.surveyListReducer.labels.map((x: { label: any; color: any; }, i: any) => {
            return {
              label: x.label,
              value: x.label,
              key: i,
              color: x.color,
            };
          })}
          value={state.label}
          onChange={(val) => setState({ ...state, label: val })}
        />

        <Label className="mt-4">
          <IntlMessages id="survey.status" />
        </Label>
        <Input
          type="radio"
          id="exCustomRadio"
          name="customRadio"
          label="COMPLETED"
          checked={state.status === 'COMPLETED'}
          onChange={(event: { target: { value: string; }; }) =>
            setState({
              ...state,
              status: event.target.value === 'on' ? 'COMPLETED' : 'ACTIVE',
            })
          }
        />
        <Input
          type="radio"
          id="exCustomRadio2"
          name="customRadio2"
          label="ACTIVE"
          checked={state.status === 'ACTIVE'}
          onChange={(event: { target: { value: string; }; }) =>
            setState({
              ...state,
              status: event.target.value !== 'on' ? 'COMPLETED' : 'ACTIVE',
            })
          }
        />
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" outline onClick={props.surveyListReducer.toggleModal}>
          <IntlMessages id="survey.cancel" />
        </Button>
        <Button color="primary" onClick={() => addNetItem()}>
          <IntlMessages id="survey.submit" />
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const mapDispatchToProps = { ...surveyListActions };

const mapStateToProps = ({ surveyListReducer }: any) => {
  return { surveyListReducer };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddNewSurveyModal);