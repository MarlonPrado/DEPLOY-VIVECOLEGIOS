import moment from 'moment';
import React, { useEffect, useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import { FormProvider, useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import Select from 'react-select';
import { Button, Card, CardBody, Collapse, Input, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';

import * as academicAsignatureCourseActions from '../../../stores/actions/AcademicAsignatureCourseActions';
import * as academicPeriodActions from '../../../stores/actions/AcademicPeriodActions';
import * as classroomPlanActions from '../../../stores/actions/ClassroomPlanActions';
import * as courseActions from '../../../stores/actions/CourseActions';
import { Colxx } from '../../common/CustomBootstrap';
import HeaderInfoAcademic from '../../common/Data/HeaderInfoAcademic';
import EditorHTML from '../../common/EditorHTML';

const ClassroomPlanDetail = (props: any) => {
  const [academicPeriods, setAcademicPeriods] = useState(null);
  const [currentAcademicPeriod, setCurrentAcademicPeriod] = useState(null);
  const [cantStudents, setCantStudents] = useState(null);
  const [academicAsignatureCourse, setAcademicAsignatureCourse] = useState(null);
  const [classroomPlan, setClassroomPlan] = useState(null);
  const [evaluativeComponents, setEvaluativeComponents] = useState(null);
  const [learningsList, setLearningsList] = useState(null);
  const [learnings, setLearnings] = useState([]);
  const [evidencesLearning, setEvidencesLearning] = useState([]);
  const [evidencesLearningList, setEvidencesLearningList] = useState([]);
  const [dbasList, setDbasList] = useState(null);
  const [dbas, setDbas] = useState([]);
  const [standardsList, setStandardsList] = useState(null);
  const [standards, setStandards] = useState([]);
  const [classroomPlanMethodologicalRoutes, setClassroomPlanMethodologicalRoutes] = useState([]);
  const [classroomPlanPerformanceAppraisalStrategies, setClassroomPlanPerformanceAppraisalStrategies] = useState([]);
  const [classroomPlanExpectedPerformance, setClassroomPlanExpectedPerformance] = useState([]);
  const [showingIndex, setShowIndex] = useState(0);
  const [showInputDates, setShowInputDates] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [modalSelect, setModalSelect] = useState(false);
  const [modalEvidences, setModalEvidences] = useState(false);
  const [currentEvaluativeComponent, setCurrentEvaluativeComponent] = useState(false);

  let navigate = useNavigate();

  const methods = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });
  const { handleSubmit, control, register, reset, setValue, getValues } = methods;

  let [params] = useSearchParams();
  const academicAsignatureCourseId = params.get('academicAsignatureCourseId');
  const courseId = params.get('courseId');
  const id = params.get('id');

  const [data, setData] = useState(null);
  useEffect(() => {
    if (id) {
      getData(id);
    } else {
      props.saveNewClassroomPlan({ academicAsignatureCourseId: academicAsignatureCourseId, campusId: props?.loginReducer?.campusId }).then(async (ncp: any) => {
        await getData(ncp);
        goToChildren(
          `/classroomPlanDetail?id=${ncp}&academicAsignatureCourseId=${academicAsignatureCourseId}&courseId=${courseId}`,
        );
      });
    }
    props.dataCurrentAcademicPeriod(props?.loginReducer?.schoolId).then(async (period: any) => {
      await setCurrentAcademicPeriod(period);
    });
    props.dataCourse(courseId).then((course: any) => {
      setCantStudents(course?.data?.students?.length)
    });
  }, []);

  const getData = async (idCp: string) => {
    props.dataClassroomPlan(idCp).then(async (cp: any) => {
      await setClassroomPlan(cp?.data);
      await setLearnings(cp?.data?.learnigs.map((c: any) => {
        return { label: c?.statement, value: c?.id, key: c?.id };
      }));
      await setDbas(cp?.data?.generalBasicLearningRights.map((c: any) => {
        return { label: c?.dba, value: c?.id, key: c?.id };
      }));
      await setStandards(cp?.data?.academicStandards.map((c: any) => {
        return { label: c?.standard, value: c?.id, key: c?.id };
      }));
      await setClassroomPlanMethodologicalRoutes(cp?.data?.classroomPlanMethodologicalRoutes || []);
      await setClassroomPlanPerformanceAppraisalStrategies(cp?.data?.classroomPlanPerformanceAppraisalStrategies || []);
      await setClassroomPlanExpectedPerformance(cp?.data?.classroomPlanExpectedPerformances || []);
      await props.dataAcademicAsignatureCourse(academicAsignatureCourseId).then((resp: any) => {
        setAcademicAsignatureCourse(resp?.data);
        props.getDropdownsClassroomPlan(
          props?.loginReducer?.schoolId,
          resp?.data?.academicAsignatureId,
          resp?.data?.course?.academicGradeId,
          "",
          resp?.data?.academicAsignature?.generalAcademicAsignatureId,
          resp?.data?.course?.academicGrade?.generalAcademicGradeId,
          cp?.data?.learningsId
        )
          .then((response: any) => {
            setLearningsList(response.dataLearnings.edges.map((c: any) => {
              return { label: c?.node?.statement, value: c?.node?.id, key: c?.node?.id };
            }));
            setDbasList(response.dataDBAS.edges.map((c: any) => {
              return { label: c?.node?.dba, value: c?.node?.id, key: c?.node?.id };
            }));
            setStandardsList(response.dataStandards.edges.map((c: any) => {
              return { label: c?.node?.standard, value: c?.node?.id, key: c?.node?.id };
            }));
            setEvidencesLearningList(response.dataEvidencesLearning.edges.map((c: any) => {
              return { label: c?.node?.statement, value: c?.node?.id, key: c?.node?.id };
            }));
            setEvaluativeComponents(response.dataEvaluativeComponent.edges);
            setAcademicPeriods(response.dataAcademicPeriods.edges);
          });
      });
    });
  };

  const updateClassroomPlan = async (data: any) => {
    props.updateClassroomPlan(data, classroomPlan?.id).then((resp: any) => {
      setShowInputDates(false);
      getData(classroomPlan?.id);
    });
  };

  const addNewMoment = async () => {
    classroomPlanMethodologicalRoutes.push({ name: '', description: '' });
    setClassroomPlanMethodologicalRoutes(classroomPlanMethodologicalRoutes);
  };

  const deleteMoment = async (index: number) => {
    classroomPlanMethodologicalRoutes.splice(index, 1);
    setClassroomPlanMethodologicalRoutes(classroomPlanMethodologicalRoutes);
    let obj = {
      classroomPlanMethodologicalRoutes: classroomPlanMethodologicalRoutes
    }
    updateClassroomPlan(obj);
  };

  const goToChildren = async (url: string) => {
    navigate(url);
  };

  return (
    <>
      <FormProvider {...methods}>
        <div className="d-flex justify-content-between align-items-center">
          <h1 className="font-bold mb-0 pb-0 d-flex align-items-center text-muted">
            <i className='simple-icon-book-open mr-2 '></i>
            <span>Plan de aula</span>
          </h1>
          <div>
            {academicPeriods
              ? academicPeriods.map((item: any) => {
                return (
                  <>
                    <button
                      onClick={() => {
                        let obj: any = {
                          academicPeriodId: item?.node?.id,
                          startDate: null,
                          endDate: null
                        }
                        return updateClassroomPlan(obj);
                      }}
                      key={item?.node?.id}
                      className={`btn ${classroomPlan?.academicPeriodId === item?.node?.id
                        ? 'btn-info'
                        : 'btn-outline-info'
                        }`}
                      type="button"
                    >
                      <i className="iconsminds-pen-2"></i> {item?.node?.name}
                    </button>{'  '}
                  </>
                );
              })
              : ''}
          </div>
        </div>

        <hr />
        <HeaderInfoAcademic asignature grade course modality goTitle="Regresar" academicAsignatureCourseId={academicAsignatureCourseId} />

        <hr />
        <Row className="align-items-center">
          <Colxx lg="4" xl="4" className="mb-4 rounded">
            <Card>
              <CardBody className="text-center p-3 d-flex align-items-center justify-content-around">
                <i className={'iconsminds-business-man-woman lead'} />
                <div>
                  <h3 className="card-text text-info font-weight-bold mb-0 mt-2">
                    {academicAsignatureCourse?.teacher?.user?.name}  {academicAsignatureCourse?.teacher?.user?.lastName}
                  </h3>
                  <p className="font-weight-semibold text-center mb-0">Docente</p>
                </div>
              </CardBody>
            </Card>
          </Colxx>
          <Colxx lg="3" xl="3" className="mb-4 rounded">
            <Card>
              <CardBody className="text-center p-3 d-flex align-items-center justify-content-around">
                <i className={'iconsminds-student-male-female lead'} />
                <div>
                  <h3 className="card-text text-info font-weight-bold mb-0 mt-2">
                    {cantStudents}
                  </h3>
                  <p className="font-weight-semibold text-center mb-0">Estudiantes</p>
                </div>
              </CardBody>
            </Card>
          </Colxx>
          <Colxx lg="5" xl="5" className="mb-4 rounded">
            <Card>
              <CardBody className="text-center p-3 d-flex align-items-center justify-content-around">
                <i className={'iconsminds-calendar-4 lead'} />
                <i onClick={() => {
                  if (classroomPlan?.academicPeriodId) {
                    setShowInputDates(!showInputDates)
                  }
                }} className={'simple-icon-pencil text-green ml-2'} />
                <div className='p-3'>
                  {!showInputDates && (classroomPlan?.startDate && classroomPlan?.endDate) ?
                    <>
                      <h3 className="card-text text-info font-weight-bold mb-0 mt-2">
                        {moment(classroomPlan?.startDate).format('YYYY-MM-DD')} - {moment(classroomPlan?.endDate).format('YYYY-MM-DD')}
                      </h3>
                      <p className="text-center font-weight-semibold mb-0">Fecha de inicio y fin</p>
                    </>
                    : <>
                      <div className=''>
                        <ReactDatePicker
                          minDate={new Date(classroomPlan?.academicPeriod?.startDate)}
                          maxDate={new Date(classroomPlan?.academicPeriod?.endDate)}
                          selected={startDate}
                          selectsRange
                          startDate={startDate}
                          endDate={endDate}
                          onChange={(dates) => {
                            const [start, end] = dates;
                            setStartDate(start);
                            setEndDate(end);
                          }}
                        />
                        <Button color="green" disabled={!classroomPlan?.academicPeriodId} onClick={(dates) => {
                          let obj = {
                            startDate: startDate,
                            endDate: endDate
                          };
                          updateClassroomPlan(obj);
                        }} className='btn-xs ml-2 mt-2'>
                          Guardar
                        </Button>
                      </div>
                    </>
                  }
                </div>
              </CardBody>
            </Card>
          </Colxx>
          <Colxx lg="12" xl="12" className="mb-4 rounded">
            <Card>
              <CardBody className="p-2 pl-4">
                <p className="font-weight-semibold mb-1 mt-1">Enfoque y/o modelo pedagógico institucional: {classroomPlan?.campus?.school?.pedagogicalModel}</p>
                <p className="font-weight-semibold mb-1">Modelo educativo: {classroomPlan?.campus?.school?.educationalModel}</p>
                <p className="font-weight-semibold mb-1">Componente curricular: {classroomPlan?.campus?.school?.curricularComponent}</p>
              </CardBody>
            </Card>
          </Colxx>
          <Colxx lg="12" xl="12" className="mb-4 rounded">
            <Card>
              <CardBody className="p-3 pl-4">
                <table className='w-100'>
                  <tr>
                    <td>
                      <div className='d-flex flex-column align-items-center justify-content-center'>
                        <i className={'iconsminds-books lead'} />
                        <Button color="green"
                          onClick={() => {
                            setModalSelect(true);
                          }}
                          className='btn-xs ml-2 mt-2'>
                          Asociar
                        </Button>
                      </div>
                    </td>
                    <td className='text-center border-l-blue'>
                      <p className="font-weight-semibold mb-3">Aprendizajes</p>
                      <h3 className="card-text text-orange font-weight-bold mb-0 mt-2">
                        {learnings?.length}
                      </h3>
                    </td>
                    <td className='text-center border-l-blue'><p className="font-weight-semibold mb-3">Competencias</p></td>
                    <td className='text-center border-l-blue'>
                      <p className="font-weight-semibold mb-3">
                        DBA asociado
                        <h3 className="card-text text-orange font-weight-bold mb-0 mt-2">
                          {dbas?.length}
                        </h3>
                      </p>
                    </td>
                    <td className='text-center border-l-blue'>
                      <p className="font-weight-semibold mb-3">
                        Estándar y/o orientación curricular asociado
                      </p>
                      <h3 className="card-text text-orange font-weight-bold mb-0 mt-2">
                        {standards?.length}
                      </h3>
                    </td>
                  </tr>
                </table>
              </CardBody>
            </Card>
          </Colxx>
        </Row>
        <Colxx lg="12" xl="12" className="rounded p-0">
          <Card className="d-flex mb-3" key={`faqItem_${1}`}>
            <div className="d-flex flex-grow-1 min-width-zero">
              <Button
                color="link"
                className="card-body d-flex justify-content-between btn-empty btn-link list-item-heading text-left text-one"
                onClick={() => setShowIndex(1)}
                aria-expanded={showingIndex === 1}
              >
                Desempeños esperados
              </Button>
            </div>
            <Collapse isOpen={showingIndex === 1}>
              <div className="card-body accordion-content pt-0">
                <table className='table table-bordered'>
                  <tr>
                    {
                      evaluativeComponents?.map((c: any) => {
                        return <>
                          <td className='table-cell-info' colSpan={3}>
                            <div className='d-flex justify-content-between align-items-center'>
                              <span>{c?.node?.name}</span>
                              <Button color="green" onClick={() => {
                                setModalEvidences(true);
                                setCurrentEvaluativeComponent(c?.node?.id)
                              }} className='btn-xs ml-2'>
                                <i className='simple-icon-check'></i>
                              </Button>
                            </div>
                          </td>
                        </>
                      })
                    }
                  </tr>
                  <tr>
                    {
                      evaluativeComponents?.map((c: any) => {
                        return <>
                          <td colSpan={3}>
                            <ul>
                              {classroomPlanExpectedPerformance.map((d: any) => {
                                return <>
                                  <li>{d?.evidenceLearnings?.statement}</li>
                                </>
                              })}
                            </ul>
                          </td>
                        </>
                      })
                    }
                  </tr>
                </table>
              </div>
            </Collapse>
          </Card>

          <Card className="d-flex mb-3" key={`faqItem_${0}`}>
            <div className="d-flex flex-grow-1 min-width-zero">
              <Button
                color="link"
                className="card-body d-flex justify-content-between btn-empty btn-link list-item-heading text-left text-one"
                onClick={() => setShowIndex(0)}
                aria-expanded={showingIndex === 0}
              >
                Recursos educativos disponibles para el aprendizaje
              </Button>
            </div>
            <Collapse isOpen={showingIndex === 0}>
              <div className="card-body accordion-content pt-0">
              </div>
            </Collapse>
          </Card>

          <Card className="d-flex mb-3" key={`faqItem_${2}`}>
            <div className="d-flex flex-grow-1 min-width-zero">
              <Button
                color="link"
                className="card-body d-flex justify-content-between btn-empty btn-link list-item-heading text-left text-one"
                onClick={() => setShowIndex(2)}
                aria-expanded={showingIndex === 2}
              >
                Ruta Metodológica para el aprendizaje
                <Button color="green" onClick={() => {
                  addNewMoment();
                }} className='btn-xs ml-2'>
                  Nuevo momento
                </Button>
              </Button>
            </div>
            <Collapse isOpen={showingIndex === 2}>
              <div className="card-body accordion-content pt-0">
                <table className='table table-bordered'>
                  <tr>
                    {
                      classroomPlanMethodologicalRoutes?.map((c: any, index: number) => {
                        return <>
                          <td className='table-cell-info' colSpan={3}>
                            <div className='d-flex justify-content-between align-items-center'>
                              <span>
                                <Input
                                  {...c?.name}
                                  onInput={(e: any) => {
                                    c.name = e.target.value;
                                  }}
                                  defaultValue={c?.name}
                                  className="form-control"
                                />
                              </span>
                              <div className='d-flex'>
                                <Button color="danger" onClick={() => {
                                  deleteMoment(index);
                                }} className='btn-xs ml-2 d-flex align-items-center'>
                                  <i className='simple-icon-trash'></i>
                                </Button>
                                <Button color="green" onClick={() => {
                                  let obj = {
                                    classroomPlanMethodologicalRoutes: classroomPlanMethodologicalRoutes
                                  }
                                  updateClassroomPlan(obj);
                                }} className='btn-xs ml-2 d-flex align-items-center'>
                                  <i className='simple-icon-check'></i>
                                </Button>
                              </div>
                            </div>
                          </td>
                        </>
                      })
                    }
                  </tr>
                  <tr>
                    {
                      classroomPlanMethodologicalRoutes?.map((c: any) => {
                        return <>
                          <td colSpan={3}>
                            <EditorHTML setValueText={(text: string) => {
                              c.description = text;
                            }} value={c.description}></EditorHTML>
                          </td>
                        </>
                      })
                    }
                  </tr>
                </table>
              </div>
            </Collapse>
          </Card>

          <Card className="d-flex mb-3" key={`faqItem_${3}`}>
            <div className="d-flex flex-grow-1 min-width-zero">
              <Button
                color="link"
                className="card-body d-flex justify-content-between btn-empty btn-link list-item-heading text-left text-one"
                onClick={() => setShowIndex(3)}
                aria-expanded={showingIndex === 3}
              >
                Estrategias de valoración de los Desempeños
              </Button>
            </div>
            <Collapse isOpen={showingIndex === 3}>
              <div className="card-body accordion-content pt-0">
                <table className='table table-bordered'>
                  <tr>
                    {
                      evaluativeComponents?.map((c: any) => {
                        return <>
                          <td className='table-cell-info' colSpan={3}>
                            <div className='d-flex justify-content-between align-items-center'>
                              <span>{c?.node?.name}</span>
                              <Button color="green" onClick={() => {
                                let obj = {
                                  classroomPlanPerformanceAppraisalStrategies: classroomPlanPerformanceAppraisalStrategies
                                }
                                updateClassroomPlan(obj);
                              }} className='btn-xs ml-2 d-flex align-items-center'>
                                <i className='simple-icon-check'></i>
                              </Button>
                            </div>
                          </td>
                        </>
                      })
                    }
                  </tr>
                  <tr>
                    {
                      evaluativeComponents?.map((c: any) => {
                        return <>
                          <td colSpan={3}>
                            <EditorHTML setValueText={(text: string) => {
                              if (classroomPlanPerformanceAppraisalStrategies.find((x: any) => (x?.evaluativeComponentId === c?.node?.id))) {
                              } else {
                                classroomPlanPerformanceAppraisalStrategies.push(
                                  {
                                    evaluativeComponentId: c?.node?.id,
                                    description: text
                                  }
                                )
                              }
                              setClassroomPlanPerformanceAppraisalStrategies(classroomPlanPerformanceAppraisalStrategies);
                            }} value={
                              classroomPlanPerformanceAppraisalStrategies.find((e: any) => {
                                e?.evaluativeComponentId === c?.node?.id;
                                return e;
                              })?.description || ''
                            }></EditorHTML>
                          </td>
                        </>
                      })
                    }
                  </tr>
                </table>
                <table className='table table-bordered'>
                  <tr>
                    <td className='table-cell-info' colSpan={3}>Actividades pedagógicas Transversales</td>
                    <td colSpan={7}></td>
                  </tr>
                </table>
              </div>
            </Collapse>
          </Card>

          <Card className="d-flex mb-3" key={`faqItem_${4}`}>
            <div className="d-flex flex-grow-1 min-width-zero">
              <Button
                color="link"
                className="card-body d-flex justify-content-between btn-empty btn-link list-item-heading text-left text-one"
                onClick={() => setShowIndex(4)}
                aria-expanded={showingIndex === 4}
              >
                Actividades de valoración de los Desempeños
                <Button color="green" className='btn-xs ml-2'>
                  Agregar actividad
                </Button>
              </Button>
            </div>
            <Collapse isOpen={showingIndex === 4}>
              <div className="card-body accordion-content pt-0">
                <table className='table table-bordered'>
                  <tr>
                    {
                      evaluativeComponents?.map((c: any) => {
                        return <>
                          <td className='table-cell-info' colSpan={3}>{c?.node?.name}</td>
                        </>
                      })
                    }
                  </tr>
                  <tr>
                    {
                      evaluativeComponents?.map((c: any) => {
                        return <>
                          <td colSpan={3}></td>
                        </>
                      })
                    }
                  </tr>
                </table>
              </div>
            </Collapse>
          </Card>
        </Colxx>

        <Modal
          isOpen={modalEvidences}
          toggle={() => setModalEvidences(!modalEvidences)}
        >
          <ModalHeader>Seleccionar</ModalHeader>
          <ModalBody>
            <div className="form-group">
              <p className="font-weight-semibold mb-3">Evidencias de aprendizaje</p>
              <Select
                isClearable
                placeholder="Seleccionar"
                isMulti
                className="react-select"
                classNamePrefix="react-select"
                options={evidencesLearningList}
                value={evidencesLearning}
                onChange={(selectedOption: any) => {
                  setEvidencesLearning(selectedOption);
                }}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="secondary"
              onClick={() => setModalEvidences(false)}>
              Cancelar
            </Button>{' '}
            <Button
              color="green"
              onClick={() => {
                let evidences = evidencesLearning.map((c: any) => { return c.key });
                if (classroomPlanExpectedPerformance.find((x: any) => (x.evaluativeComponentId === currentEvaluativeComponent))) {

                } else {
                  classroomPlanExpectedPerformance.push(
                    {
                      evaluativeComponentId: currentEvaluativeComponent,
                      evidenceLearningsId: evidences
                    }
                  )
                  setClassroomPlanExpectedPerformance(classroomPlanExpectedPerformance)
                }
                let obj = {
                  classroomPlanExpectedPerformances: classroomPlanExpectedPerformance
                }
                updateClassroomPlan(obj);
                setModalEvidences(false);
                getData(classroomPlan?.id);
                reset();
              }}>
              Guardar
            </Button>
          </ModalFooter>
        </Modal>
        <Modal
          isOpen={modalSelect}
          toggle={() => setModalSelect(!modalSelect)}
        >
          <ModalHeader>Seleccionar</ModalHeader>
          <ModalBody>
            <div className="form-group">
              <p className="font-weight-semibold mb-3">Aprendizajes</p>
              <Select
                isClearable
                placeholder="Seleccionar"
                isMulti
                className="react-select"
                classNamePrefix="react-select"
                options={learningsList}
                value={learnings}
                onChange={(selectedOption: any) => {
                  setValue('learningsId', selectedOption.map((c: any) => { return c.key }));
                  setLearnings(selectedOption);
                }}
              />
            </div>
            <div className="form-group">
              <p className="font-weight-semibold mb-3">DBA's</p>
              <Select
                isClearable
                placeholder="Seleccionar"
                isMulti
                className="react-select"
                classNamePrefix="react-select"
                options={dbasList}
                value={dbas}
                onChange={(selectedOption: any) => {
                  setValue('generalBasicLearningRightsId', selectedOption.map((c: any) => { return c.key }));
                  setDbas(selectedOption);
                }}
              />
            </div>
            <div className="form-group">
              <p className="font-weight-semibold mb-3">Estándares</p>
              <Select
                isClearable
                placeholder="Seleccionar"
                isMulti
                className="react-select"
                classNamePrefix="react-select"
                options={standardsList}
                value={standards}
                onChange={(selectedOption: any) => {
                  setValue('academicStandardsId', selectedOption.map((c: any) => { return c.key }));
                  setStandards(selectedOption);
                }}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="secondary"
              onClick={() => setModalSelect(false)}>
              Cancelar
            </Button>{' '}
            <Button
              color="green"
              onClick={() => {
                let obj = getValues();
                updateClassroomPlan(obj);
                setModalSelect(false);
                getData(classroomPlan?.id);
                reset();
              }}>
              Guardar
            </Button>
          </ModalFooter>
        </Modal>
      </FormProvider>
    </>
  );
};
const mapDispatchToProps = { ...classroomPlanActions, ...courseActions, ...academicAsignatureCourseActions, ...academicPeriodActions };

const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

export default connect(mapStateToProps, mapDispatchToProps)(ClassroomPlanDetail);
