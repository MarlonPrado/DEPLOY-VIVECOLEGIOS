/* eslint-disable arrow-body-style */
import { DevTool } from '@hookform/devtools';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import Select from 'react-select';
import { Input, Label, ModalBody, ModalFooter } from 'reactstrap';
import { comparePerformanceLevelsTopScoreCriteriaRubric } from '../../../helpers/DataTransformations';
import IntlMessages from '../../../helpers/IntlMessages';
import * as experienceLearningRubricCriteriaActions from '../../../stores/actions/ExperienceLearningRubricCriteriaActions';
import { Colxx } from '../../common/CustomBootstrap';
import AddNewModal from '../../common/Data/AddNewModal';
import CreateEditAuditInformation from '../../common/Data/CreateEditAuditInformation';
import { Loader } from '../../common/Loader';

const ExperienceLearningRubricCriteriaCreateEdit = (props: any) => {
  const [loading, setLoading] = useState(true);
  const [experienceLearning, setExperienceLearning] = useState(null);
  const [criteriaPerformances, setCriteriaPerformances] = useState([]);
  const [evidencesLearning, setEvidencesLearning] = useState(null);
  const [evidenceLearning, setEvidenceLearning] = useState(null);
  const [performanceLevels, setPerformanceLevels] = useState(null);

  let [params] = useSearchParams();
  const learningId = params.get('learningId');

  const methods = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const { handleSubmit, control, register, reset, setValue, getValues } = methods;

  useEffect(() => {
    cleanForm();
    getDropdowns(learningId);
    if (props?.data?.id) {
      if (props?.data?.experienceLearningRubricCriteriaPerformanceLevel !== undefined && props?.data?.experienceLearningRubricCriteriaPerformanceLevel != null) {
        let data = [...props?.data?.experienceLearningRubricCriteriaPerformanceLevel.sort(comparePerformanceLevelsTopScoreCriteriaRubric)]
        setCriteriaPerformances(data.map((c: any) => {
          return {
            performanceLevelId: c.performanceLevelId,
            criteria: c.criteria,
          }
        }));
      }
      if (props?.data?.evidenceLearnig !== undefined && props?.data?.evidenceLearnig != null) {
        setEvidenceLearning({
          key: props?.data?.evidenceLearnig?.id,
          label: props?.data?.evidenceLearnig?.statement,
          value: props?.data?.evidenceLearnig?.id,
        });
      }
    }
    setLoading(false);
  }, [props?.data]);

  const cleanForm = async () => {
    reset();
    if (learningId && !props?.data?.id) {
      // set value when register is new and sesion contains value
      register('experienceLearningId', {
        required: true,
        value: learningId,
      });
    } else {
      setCriteriaPerformances([])
      setEvidenceLearning(null)
      setEvidencesLearning(null)
    }
  };

  const getDropdowns = async (id: string) => {
    props
      .getDropdownsExperienceLearningRubricCriteria(id, props?.loginReducer?.schoolId)
      .then((data: any) => {
        setExperienceLearning(data?.dataExperienceLearning);
        setEvidencesLearning(
          data?.dataExperienceLearning?.evidenceLearnings.map((c: any) => {
            return { label: c?.statement, value: c?.id, key: c?.id };
          }),
        );
        setPerformanceLevels(
          data?.dataPerformanceLevels?.edges.map((c: any) => {
            return {
              label: `${c?.node?.name}: ${c?.node?.minimumScore} - ${c?.node?.topScore}`,
              name: c?.node?.name,
              value: c?.node?.id,
              key: c?.node?.id,
            };
          }),
        );
        let criteriasPerfomances: any = [];
        data?.dataPerformanceLevels?.edges.map((c: any) => {
          criteriasPerfomances.push({
            criteria: "",
            performanceLevelId: c?.node.id,
          });
        });
        //setCriteriaPerformances(criteriasPerfomances);
        setValue('experienceLearningRubricCriteriaPerformanceLevel',
          criteriasPerfomances,
        );
      })
  };

  const setCriteriaPerformance = async (e: any, id: any) => {
    let ind = criteriaPerformances.findIndex((c: any) => (c.performanceLevelId === id));
    if (ind !== -1) {
      criteriaPerformances.splice(ind, 1);
    }
    criteriaPerformances.push({
      criteria: e?.target?.value,
      performanceLevelId: id,
    });
    if (criteriaPerformances.length !== performanceLevels.length) {
      for (let performanceLevel of performanceLevels) {
        let add = true;
        for (let criteriaPerformance of criteriaPerformances) {
          if (performanceLevel?.key === criteriaPerformance?.performanceLevelId) {
            add = false;
          }
        }
        if (add) {
          criteriaPerformances.push({
            criteria: "",
            performanceLevelId: performanceLevel?.key,
          });
        }
      }
    }
    setCriteriaPerformances(criteriaPerformances);
    setValue('experienceLearningRubricCriteriaPerformanceLevel',
      criteriaPerformances,
    );
  };

  const { ref: weightRef, ...weightRest } = register('weight', {
    required: true,
    value: props?.data?.id ? props?.data?.weight : '',
  });
  const { ref: criteriaRef, ...criteriaRest } = register('criteria', {
    required: true,
    value: props?.data?.id ? props?.data?.criteria : '',
  });
  register('experienceLearningId', {
    required: true,
    value: props?.data?.id ? props?.data?.experienceLearningId : '',
  });
  register('evidenceLearningId', {
    required: true,
    value: props?.data?.id ? props?.data?.evidenceLearningId : '',
  });
  register('experienceLearningRubricCriteriaPerformanceLevel', {
    required: true,
    value: criteriaPerformances,
  });

  const auditInfo = {
    createdAt: props?.data?.id ? props?.data?.createdAt : null,
    updatedAt: props?.data?.id ? props?.data?.createdAt : null,
    createdByUser: props?.data?.id ? props?.data?.createdByUser : null,
    updatedByUser: props?.data?.id ? props?.data?.updatedByUser : null,
    version: props?.data?.id ? props?.data?.version : null,
  };

  return (
    <>
      {/* <DevTool control={methods.control} placement="top-left" /> */}
      {loading ? (
        <>
          <Colxx sm={12} className="d-flex justify-content-center">
            <Loader />
          </Colxx>
        </>
      ) : (
        <>
          <DevTool control={control} /> {/* set up the dev tool */}

          <AddNewModal
            modalOpen={props.modalOpen}
            toggleModal={() => {
              cleanForm();
              props.toggleModal();
            }}
            onSubmit={props.onSubmit}
            data={props.data}
            methods={methods}
            control={control}
            handleSubmit={handleSubmit}
          >
            <ModalBody>
              <div className="form-group">
                <Label>
                  <IntlMessages id="forms.weight" />
                </Label>
                <Input {...weightRest} innerRef={weightRef} className="form-control" />
              </div>
              <div className="form-group">
                <Label>
                  <IntlMessages id="forms.criteria" />
                </Label>
                <Input
                  type="textarea"
                  rows="2"
                  {...criteriaRest}
                  innerRef={criteriaRef}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <Label>
                  <IntlMessages id="menu.evidenceLearning" />
                </Label>
                <Select
                  isClearable
                  placeholder={<IntlMessages id="forms.select" />}
                  {...register('evidenceLearningId', { required: true })}
                  className="react-select"
                  classNamePrefix="react-select"
                  options={evidencesLearning}
                  value={evidenceLearning}
                  onChange={(selectedOption) => {
                    setValue('evidenceLearningId', selectedOption?.key);
                    setEvidenceLearning(selectedOption);
                  }}
                />
              </div>
              <p className="mt-5 font-bold">Criterios por nivel de desempeño</p>
              <hr />
              {performanceLevels
                ? props?.data?.id ?
                  criteriaPerformances.map((item: any, index: any) => {
                    return (
                      <div key={index} className="form-group">
                        <span>{performanceLevels.find((p: any) => (p.key === item?.performanceLevelId))?.label}</span>
                        <Input
                          defaultValue={item?.criteria}
                          onInput={(e) => {
                            return setCriteriaPerformance(e, item?.performanceLevelId);
                          }}
                          className="form-control"
                        />
                      </div>
                    );
                  })
                  :
                  performanceLevels.map((item: any, index: any) => {
                    return (
                      <div key={index} className="form-group">
                        <span>{item.label}</span>
                        <Input
                          onInput={(e) => {
                            return setCriteriaPerformance(e, item?.key);
                          }}
                          className="form-control"
                        />
                      </div>
                    );
                  })
                : ''}
            </ModalBody>
            {props?.data?.id ? (
              <ModalFooter className="p-3">
                <CreateEditAuditInformation loading={loading} auditInfo={auditInfo} />
              </ModalFooter>
            ) : (
              <></>
            )}
          </AddNewModal>
        </>
      )}
    </>
  );
};

const mapDispatchToProps = { ...experienceLearningRubricCriteriaActions };

const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ExperienceLearningRubricCriteriaCreateEdit);
