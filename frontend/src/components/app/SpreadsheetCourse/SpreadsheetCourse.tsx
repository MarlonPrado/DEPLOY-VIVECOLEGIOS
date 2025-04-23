import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react'
import { downloadExcel, DownloadTableExcel, useDownloadExcel } from 'react-export-table-to-excel';
import { connect } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { Badge, Progress } from 'reactstrap';

import { calculateDaysTwoDate, compare, compareOrderAcademicArea } from '../../../helpers/DataTransformations';
import { createNotification } from '../../../helpers/Notification';
import { getInitialsName } from '../../../helpers/Utils';
import * as performanceLevelActions from '../../../stores/actions/Academic/PerformanceLevelActions';
import * as academicAsignatureCouseActions from '../../../stores/actions/AcademicAsignatureCourseActions';
import * as academicPeriodActions from '../../../stores/actions/AcademicPeriodActions';
import * as componentEvaluativeActions from '../../../stores/actions/ComponentEvaluativeActions';
import * as courseActions from '../../../stores/actions/CourseActions';
import * as experienceLearningActions from '../../../stores/actions/ExperienceLearningActions';
import * as experienceLearningCoEvaluationActions from '../../../stores/actions/ExperienceLearningCoEvaluationValuationActions';
import * as experienceLearningSelfActions from '../../../stores/actions/ExperienceLearningSelfAssessmentValuationActions';
import * as experienceLearningTraditionalActions from '../../../stores/actions/ExperienceLearningTraditionalValuationActions';
import * as schoolConfiguarionActions from '../../../stores/actions/SchoolConfigurationActions';
import * as valuationsActions from '../../../stores/actions/ValuationsActions';
import { Colxx } from '../../common/CustomBootstrap';
import HeaderInfoAcademic from '../../common/Data/HeaderInfoAcademic';
import { Loader } from '../../common/Loader';
import { StyledBadge } from '../../styled/BadgeCustom';
import AreaList from '../Academic/Area/AreaList';
import ThumbnailImage from '../Aplications/AplicationsComponents/ThumbnailImage';

const SpreadsheetCourse = (props: any) => {

  const [students, setStudents] = useState(null);
  const [performanceLevels, setPerformanceLevels] = useState(null);
  const [performanceLevelType, setPerformanceLevelType] = useState(null);
  const [academicPeriods, setAcademicPeriods] = useState(null);
  const [currentAcademicPeriod, setCurrentAcademicPeriod] = useState(null);
  const [asignatures, setAsignatures] = useState(null);
  const [areas, setAreas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFormEnabled, setIsFormEnabled] = useState(true);
  const [currentMenu, setCurrentMenu] = useState({
    createAction: false,
    deleteAction: false,
    updateAction: false,
    readAction: false,
    fullAccess: false,
    activateAction: false,
    inactiveAction: false,
  });
  let [valuations, setValuations] = useState(null);
  let [valuationsArea, setValuationsArea] = useState(null);
  let [notes, setNotes] = useState([]);
  let [averages, setAverages] = useState([]);
  let [averagesFinal, setAveragesFinal] = useState([]);
  let [countDownload, setcountDownload] = useState(0);
  const [dateProgress, setDateProgress] = useState({ startDate: null, endDate: null, totalDays: 0, countDays: 0 })
  let [countDigits, setCountDigits] = useState(2);
  const tableRef = useRef();

  let navigate = useNavigate();
  const location = useLocation();
  const history = useNavigate();
  const currentUrl = location.pathname;

  let [params] = useSearchParams();
  const courseId = params.get('courseId');

  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggle = () => setTooltipOpen(!tooltipOpen);

  const [data, setData] = useState(null);
  useEffect(() => {
    let { roleMenus } = props.loginReducer;
    let submenus: any = [];
    roleMenus.map((c: any) => {
      return (submenus = submenus.concat(c.menuItemsLogin));
    });
    let cm = submenus.find((c: any) => {
      return currentUrl.includes(c?.module?.url);
    });
    if (cm && cm.readAction) {
      setCurrentMenu(cm);
    } else {
      history(`/home`);
      createNotification('warning', 'notPermissions', '');
    }
    props.dataCurrentAcademicPeriod(props?.loginReducer?.schoolId).then(async (period: any) => {
      await props.getListAllSchoolConfiguration(props?.loginReducer?.schoolId).then(async (schoolConfigurations: any) => {
        for (let schoolConfiguration of schoolConfigurations) {
          if (schoolConfiguration?.node?.code == "COUNT_DIGITS_PERFORMANCE_LEVEL") {
            setCountDigits(schoolConfiguration?.node?.valueNumber);
          }
        }
      });
      await setCurrentAcademicPeriod(period);
      if (period) {
        const today = new Date();
        const startDate = new Date(period.startDate);
        const endDate = new Date(period?.endDate);
        const totalDays = calculateDaysTwoDate(startDate, endDate);
        let countDays = totalDays;
        if (today < endDate && today > startDate) {
          countDays = calculateDaysTwoDate(startDate, new Date());
        }
        setDateProgress({ startDate, endDate, totalDays, countDays })
      }
      getSpreadsheet(period?.id);
    });
  }, []);

  const getSpreadsheet = async (periodId: any) => {
    setLoading(true);
    await props.dataCourse(courseId).then(async (course: any) => {
      setStudents(course?.data?.students.sort(compare));
      let obj: any = [];
      let nts: any = [];
      let ntsArea: any = [];
      let avrgs: any = [];
      let avrgsFinal: any = [];
      let levels: any = [];
      await props
        .getListAllPerformanceLevelCourse(courseId)
        .then((dataLevels: any) => {
          setPerformanceLevels(dataLevels);
          levels = dataLevels;
          setPerformanceLevelType(dataLevels[0]?.node?.type);
        });
      await props.getAcademicPeriodsExperienceLearning(props?.loginReducer?.schoolId,
        props?.loginReducer?.schoolYear).then(async (listData: any) => {
          setAcademicPeriods(listData);
          let promisesListAsignatures: any[] = [];
          let promisesListAreas: any[] = [];
          if (periodId) {
            await props
              .getListAllAcademicAsignatureCourseByCourse(null, courseId)
              .then(async (asignaturesList: any) => {
                setAsignatures(asignaturesList)
                let areasAux: any[] = []
                for (let asignature of asignaturesList) {
                  if (asignature?.node?.academicAsignature?.academicArea) {
                    areasAux.push(asignature?.node?.academicAsignature?.academicArea);
                  }
                  promisesListAsignatures.push(
                    props
                      .getAllAcademicAsignatureCoursePeriodValuation(periodId, asignature?.node?.id)
                      .then(async (notesFinal: any) => {
                        nts[asignature?.node?.id] = notesFinal.data.edges;
                      })
                  );
                }
                const ids = areasAux.map(o => o?.id)
                const count: any = {};
                ids.forEach(element => {
                  count[element] = (count[element] || 0) + 1;
                });
                let filtered = areasAux.filter(({ id }, index) => !ids.includes(id, index + 1))
                for (let filter of filtered) {
                  filter.count = count[filter?.id];
                }
                filtered = filtered.sort(compareOrderAcademicArea);
                setAreas(filtered);
                for (let area of filtered) {
                  promisesListAreas.push(
                    props
                      .getAllAcademicAreaCoursePeriodValuation(periodId, area?.id)
                      .then(async (notesFinal: any) => {
                        ntsArea[area?.id] = notesFinal.data.edges;
                      })
                  );
                }
              });
            await Promise.all(promisesListAreas).then(() => {
              setValuationsArea(ntsArea);
            });
            await Promise.all(promisesListAsignatures).then(() => {
              setValuations(nts);
              setLoading(false);
            });

            //       await props
            //         .getAllAcademicAsignatureCoursePeriodValuation(periodId, academicAsignatureCourseId)
            //         .then(async (notesFinal: any) => {
            //           avrgsFinal = avrgsFinal.concat(notesFinal.data.edges);
            //           setAveragesFinal(avrgsFinal);
            //         });
            //       await props
            //         .getListAllComponentEvaluativeAcademicAsignatureCourse(academicAsignatureCourseId)
            //         .then(async (dataComponents: any) => {
            //           for (let c of dataComponents) {
            //             // get averages for each evaluative component
            //             await props
            //               .getAllExperienceLearningAverageValuation(
            //                 c?.node?.id,
            //                 periodId,
            //                 academicAsignatureCourseId,
            //               )
            //               .then((resp: any) => {
            //                 avrgs = avrgs.concat(resp.data.edges);
            //                 setAverages(avrgs);
            //               });
            //             await props
            //               .getAllExperienceLearningAcademicAsignatureCourse(
            //                 academicAsignatureCourseId,
            //                 periodId,
            //                 c?.node?.id,
            //               )
            //               .then(async (response: any) => {
            //                 await response.data.map(async (exp: any) => {
            //                   promisesList.push(
            //                     props.getValuationStudents(exp?.id).then((resp: any) => {
            //                       nts = nts.concat(resp.data);
            //                     }));
            //                 });
            //                 obj.push({
            //                   experiences: response.data,
            //                   name: `${c?.node?.name} (${c?.node?.weight}%)`,
            //                   evaluativeComponentId: c?.node?.id,
            //                 });
            //               });
            //           };
            //           await Promise.all(promisesList).then(() => {
            //             setValuations(obj);
            //             setNotes(nts);
            //             setLoading(false);
            //           });
            //         });

          } else {
            setLoading(false);
          }
        });
    });
  };

  const goTo = async () => {
    navigate(-1);
  };

  const download = async () => {
    if (countDownload != 0) {
      onDownload();
    }
    setcountDownload(countDownload + 1)
  };

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: 'Planilla General',
    sheet: 'Planilla General'
  })

  const recalculatePeriod = async () => {
    setLoading(true);
    await props.updateAllStudentCoursePeriodValuation(courseId, currentAcademicPeriod?.id, "NORMAL").then(async (data: any) => {
      getSpreadsheet(currentAcademicPeriod?.id)
    })
  }

  return (
    <>
      <div className="mt-4 d-flex justify-content-center align-items-center">
        <h1 className="font-bold">Planilla General</h1>
      </div>
      <hr />
      <div className="d-flex justify-content-between align-items-center">
        <HeaderInfoAcademic grade course modality goTitle="Regresar a cursos" courseId={courseId} />
        <div>
          <div className="d-flex justify-content-start align-items-center" >
            {academicPeriods
              ? academicPeriods.map((item: any) => {
                return (
                  <>
                    <button
                      onClick={() => {
                        setCurrentAcademicPeriod(item?.node);
                        const today = new Date();
                        const startDate = new Date(item?.node?.startDate);
                        const endDate = new Date(item?.node?.endDate);
                        const totalDays = calculateDaysTwoDate(startDate, endDate);
                        let countDays = totalDays;
                        if (today < endDate && today > startDate) {
                          countDays = calculateDaysTwoDate(startDate, new Date());
                        }
                        setDateProgress({ startDate, endDate, totalDays, countDays })
                        return getSpreadsheet(item?.node?.id);
                      }}
                      key={item?.node?.id}
                      className={`ml-1 btn ${currentAcademicPeriod?.id === item?.node?.id
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
          {dateProgress.startDate != null ?
            <>
              <div className="d-flex justify-content-start align-items-center mt-2 w-100">
                <div className="text-center">
                  Progreso: {' '}
                </div>
                <Progress
                  className="ml-2"
                  bar
                  color="primary"
                  value={dateProgress.countDays > 0 ? ((dateProgress.countDays / dateProgress.totalDays) * 100) : 0}
                > ({dateProgress.countDays}/{dateProgress.totalDays}) {dateProgress.countDays > 0 ? ((dateProgress.countDays / dateProgress.totalDays) * 100).toFixed(0) : 0}%</Progress>
              </div>
              <div className="d-flex justify-content-start align-items-center mt-2 w-100">
                <div className="text-center w-50">
                  Fecha Inicio: {' ' + moment(dateProgress.startDate).format("YYYY-MM-DD")}
                </div>
                <div className="text-center w-50">
                  Fecha Fin: {' ' + moment(dateProgress.endDate).format("YYYY-MM-DD")}
                </div>
              </div>
            </>
            : ""}

          {/* <div className='d-flex mt-3 justify-content-end'>
                <button
                  className="btn btn-green mr-2"
                  type="button"
                  onClick={() => {
                    return setIsFormEnabled(!isFormEnabled);
                  }}
                >
                  <i className="iconsminds-file-edit"></i> Habilitar edición
                </button>
                <button className="btn btn-orange" type="button">
                  <i className="iconsminds-delete-file"></i> Cerrar periodo
                </button>
              </div> */}
        </div>
        <div className="d-flex justify-content-start align-items-center flex-column" >
          <button
            onClick={download}
            key={"download"}
            className={`ml-1 btn btn-info mb-2`}
            type="button"
          >
            <i className="iconsminds-download"></i> {"Descargar XLS"}
          </button>
          <button
            onClick={recalculatePeriod}
            key={"download"}
            className={`ml-1 btn btn-danger`}
            type="button"
          >
            <i className="iconsminds-download"></i> {"Recalcular Periodo"}
          </button>
        </div>

        {/* <button onClick={download}> Export excel </button> */}
      </div>
      <div className='mb-2' style={{ textAlign: "right" }}>

      </div>
      {loading ? (
        <>
          <Colxx sm={12} className="d-flex justify-content-center">
            <Loader />
          </Colxx>
        </>
      ) : valuations != null ? (
        <>
          {students !== null ? (
            <div style={{ overflow: "scroll", height: "70vh" }}>
              <table className="table table-bordered" ref={tableRef}>
                <thead>
                  <tr>
                    <th rowSpan={2} className="text-center vertical-middle">
                      Código
                    </th>
                    <th rowSpan={2} className="text-center vertical-middle">
                      Estudiante
                    </th>
                    {areas?.map((item: any, index: any) => {
                      return (
                        <>
                          <th
                            colSpan={
                              item?.count + 1
                            }
                            className="text-center vertical-middle"
                          >
                            {/* {item?.abbreviation ? item?.abbreviation : item?.name} */}
                            {item?.name}
                          </th>
                        </>
                      );
                    })}
                    {/* <th rowSpan={2} className="text-center vertical-middle">
                      Valoración
                    </th>
                    <th rowSpan={2} className="text-center vertical-middle">
                      Nivel de desempeño
                    </th> */}
                  </tr>
                  <tr>
                    {areas?.map((item: any, index: any) => {
                      return (
                        <>
                          {
                            asignatures?.map((e: any, indexe: any) => {
                              return (
                                <>
                                  {e?.node?.academicAsignature?.academicAreaId === item?.id ?
                                    <th className="text-center vertical-middle">
                                      <a data-tip data-for={e?.node?.id}>
                                        <i
                                          className="iconsminds-idea-2 text-warning font-20"
                                        ></i>
                                      </a>
                                      <ReactTooltip id={e?.node?.id} variant='info'>
                                        <span>{e?.node?.academicAsignature?.name}</span>
                                        {/* {item?.abbreviation ? item?.abbreviation : item?.name} */}
                                      </ReactTooltip>
                                    </th>
                                    : <></>}
                                </>
                              );
                            })
                          }
                          <th className="text-center vertical-middle">Valoracion Final.</th>
                        </>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {students.map((itemStudent: any, index: any) => {
                    return (
                      <>
                        <tr key={index}>
                          <td className="text-center vertical-middle">
                            <span className="font-bold">{itemStudent?.code}</span>
                          </td>
                          <td className="text-center vertical-middle">
                            <div className="d-flex align-items-center justify-content-start">
                              {itemStudent?.user?.urlPhoto ? (
                                <ThumbnailImage
                                  rounded
                                  src={itemStudent?.user?.urlPhoto}
                                  alt="profile"
                                  className="xsmall mr-3"
                                />
                              ) : (
                                <span className="img-thumbnail md-avatar-initials border-0 span-initials rounded-circle mr-3 list-thumbnail align-self-center xsmall">
                                  {getInitialsName(
                                    itemStudent?.user
                                      ? itemStudent?.user?.lastName +
                                      ' ' +
                                      itemStudent?.user?.name
                                      : 'N N',
                                  )}
                                </span>
                              )}
                              <span>
                                {itemStudent?.user?.lastName} {itemStudent?.user?.name}
                              </span>
                            </div>
                          </td>
                          {areas?.map((itemArea: any, index: any) => {
                            let asignaturesArea = asignatures?.filter((itemV: any) => itemV?.node?.academicAsignature?.academicAreaId == itemArea?.id);
                            let valuationArea = valuationsArea[itemArea?.id]?.filter((itemA: any) => itemA?.node?.studentId == itemStudent?.id);
                            let valuationAreaCalculate: any;
                            let valuationAreaDefinitive: any;
                            for (let valuationAreaAux of valuationArea) {
                              switch (valuationAreaAux?.node?.valuationType) {
                                case "CALCULATE":
                                  valuationAreaCalculate = valuationAreaAux;
                                  break;
                                case "DEFINITIVE":
                                  valuationAreaDefinitive = valuationAreaAux;
                                  break;
                              }
                            }
                            let valuationType = valuationAreaDefinitive ? "DEFINITIVE" : valuationAreaCalculate ? "CALCULATE" : "";
                            return (
                              <>
                                {
                                  asignaturesArea?.map((itemAsignature: any, indexe: any) => {
                                    let valuationAsignature = valuations[itemAsignature?.node?.id]?.filter((itemA: any) => itemA?.node?.studentId == itemStudent?.id);
                                    let valuationAsignatureCalculate;
                                    let valuationAsignatureDefinitive;
                                    for (let valuationAsignatureAux of valuationAsignature) {
                                      switch (valuationAsignatureAux?.node?.valuationType) {
                                        case "CALCULATE":
                                          valuationAsignatureCalculate = valuationAsignatureAux;
                                          break;
                                        case "DEFINITIVE":
                                          valuationAsignatureDefinitive = valuationAsignatureAux;
                                          break;
                                      }
                                    }
                                    let valuationType = valuationAsignatureDefinitive ? "DEFINITIVE" : valuationAsignatureCalculate ? "CALCULATE" : "";
                                    return (
                                      <>
                                        <td className="text-center vertical-middle">
                                          {valuationAsignatureDefinitive ?
                                            <>
                                              {performanceLevelType === "QUALITATIVE" ?
                                                <>
                                                  <StyledBadge color="primary" className="font-0-8rem pt-2" background={valuationAsignatureDefinitive?.node?.performanceLevel?.colorHex ? `${valuationAsignatureDefinitive?.node?.performanceLevel?.colorHex}` : "#00cafe"}>
                                                    {valuationAsignatureDefinitive?.node?.performanceLevel?.abbreviation ? valuationAsignatureDefinitive?.node?.performanceLevel?.abbreviation : valuationAsignatureDefinitive?.node?.performanceLevel?.name} ""
                                                  </StyledBadge>
                                                </> :
                                                <>
                                                  {valuationAsignatureDefinitive?.node?.assessment?.toFixed(countDigits)}
                                                </>
                                              }
                                            </>
                                            : <>
                                              {performanceLevelType === "QUALITATIVE" ?
                                                <>
                                                  <StyledBadge color="primary" className="font-0-8rem ${}" background={valuationAsignatureCalculate?.node?.performanceLevel?.colorHex ? `${valuationAsignatureCalculate?.node?.performanceLevel?.colorHex}` : "#00cafe"}>
                                                    {valuationAsignatureCalculate?.node?.performanceLevel?.abbreviation ? valuationAsignatureCalculate?.node?.performanceLevel?.abbreviation : valuationAsignatureCalculate?.node?.performanceLevel?.name}
                                                  </StyledBadge>
                                                </> :
                                                <>
                                                  {valuationAsignatureCalculate?.node?.assessment?.toFixed(countDigits)}
                                                </>
                                              }
                                            </>}
                                          {/* {valuation?.length > 0 ?
                                          <td className="text-center vertical-middle">
                                            {performanceLevelType === "QUALITATIVE" ?
                                              <>
                                                <StyledBadge color="primary" className="font-0-8rem" background={valuation[0]?.node?.performanceLevel?.colorHex ? `${valuation[0]?.node?.performanceLevel?.colorHex}` : "#00cafe"}>
                                                  {valuation[0]?.node?.performanceLevel?.abbreviation ? valuation[0]?.node?.performanceLevel?.abbreviation : valuation[0]?.node?.performanceLevel?.name}
                                                </StyledBadge>
                                              </> :
                                              <>
                                                {valuation[0]?.node?.assessment?.toFixed(countDigits)}
                                              </>
                                            }
                                          </td>
                                          : <td></td>} */}
                                        </td>
                                      </>
                                    );
                                  })
                                }
                                {
                                  <>
                                    <td className="text-center vertical-middle">
                                      {valuationAreaDefinitive ?
                                        <>
                                          {performanceLevelType === "QUALITATIVE" ?
                                            <>
                                              <StyledBadge color="primary" className="font-0-8rem" background={valuationAreaDefinitive?.node?.performanceLevel?.colorHex ? `${valuationAreaDefinitive?.node?.performanceLevel?.colorHex}` : "#00cafe"}>
                                                {valuationAreaDefinitive?.node?.performanceLevel?.abbreviation ? valuationAreaDefinitive?.node?.performanceLevel?.abbreviation : valuationAreaDefinitive?.node?.performanceLevel?.name}
                                              </StyledBadge>
                                            </> :
                                            <>
                                              {valuationAreaDefinitive?.node?.assessment?.toFixed(countDigits)}
                                            </>
                                          }
                                        </>
                                        : <>
                                          {performanceLevelType === "QUALITATIVE" ?
                                            <>
                                              <StyledBadge color="primary" className="font-0-8rem" background={valuationAreaCalculate?.node?.performanceLevel?.colorHex ? `${valuationAreaCalculate?.node?.performanceLevel?.colorHex}` : "#00cafe"}>
                                                {valuationAreaCalculate?.node?.performanceLevel?.abbreviation ? valuationAreaCalculate?.node?.performanceLevel?.abbreviation : valuationAreaCalculate?.node?.performanceLevel?.name}
                                              </StyledBadge>
                                            </> :
                                            <>
                                              {valuationAreaCalculate?.node?.assessment?.toFixed(countDigits)}
                                            </>
                                          }
                                        </>}
                                      {/* {valuationAreaDefinitive?.node} */}
                                    </td>
                                  </>
                                }
                              </>
                            );
                          })}

                          {valuations?.map((item2: any, index2: any) => {
                            return (
                              <>
                                {item2.experiences.length > 0 ?
                                  <>
                                    {item2.experiences.map((e: any) => {
                                      let note = notes.find(
                                        (n: any) =>
                                          n?.experienceLearningId === e?.id &&
                                          itemStudent?.id === n?.studentId,
                                      );
                                      return (
                                        <>
                                          <td className="text-center vertical-middle">
                                            {performanceLevelType === "QUALITATIVE" ?
                                              <>
                                                <StyledBadge color="primary" className="font-0-8rem" background={note?.performanceLevel?.colorHex ? `${note?.performanceLevel?.colorHex}` : "#00cafe"}>
                                                  {note?.performanceLevel?.abbreviation ? note?.performanceLevel?.abbreviation : note?.performanceLevel?.name}
                                                </StyledBadge>
                                              </> :
                                              <>
                                                {note?.assessment?.toFixed(countDigits)}
                                                {/* <Input
                                                      onKeyPress={(event: any) => {
                                                        return saveNote(event, note, e, item);
                                                      }}
                                                      defaultValue={note?.assessment}
                                                      disabled={isFormEnabled}
                                                      className="form-control"
                                                      style={{ width: "60px" }}
                                                    /> */}
                                              </>
                                            }
                                          </td>
                                        </>
                                      );
                                    })} </> : ""}
                                {item2?.experiences?.length > 0 ? (
                                  <th className="text-center vertical-middle">
                                    {performanceLevelType === "QUALITATIVE" ?
                                      <>
                                        <StyledBadge color="primary" className="font-0-8rem" background={averages.find(
                                          (n: any) =>
                                            item2?.evaluativeComponentId ===
                                            n?.node?.evaluativeComponentId &&
                                            itemStudent?.id === n?.node?.studentId,
                                        )?.node?.performanceLevel?.colorHex ? `${averages.find(
                                          (n: any) =>
                                            item2?.evaluativeComponentId ===
                                            n?.node?.evaluativeComponentId &&
                                            itemStudent?.id === n?.node?.studentId,
                                        )?.node?.performanceLevel?.colorHex}` : "#00cafe"}>
                                          {averages.find(
                                            (n: any) =>
                                              item2?.evaluativeComponentId ===
                                              n?.node?.evaluativeComponentId &&
                                              itemStudent?.id === n?.node?.studentId,
                                          )?.node?.performanceLevel?.name}
                                        </StyledBadge>
                                      </>
                                      :
                                      <>
                                        {averages.find(
                                          (n: any) =>
                                            item2?.evaluativeComponentId ===
                                            n?.node?.evaluativeComponentId &&
                                            itemStudent?.id === n?.node?.studentId,
                                        )?.node?.average?.toFixed(countDigits)}
                                        {/* <Input
                                              disabled={true}
                                              defaultValue={
                                                averages.find(
                                                  (n: any) =>
                                                    item2?.evaluativeComponentId ===
                                                    n?.node?.evaluativeComponentId &&
                                                    item?.id === n?.node?.studentId,
                                                )?.node?.average?.toFixed(2)
                                              }
                                              className="form-control"
                                              style={{ width: "4.5vh" }}
                                            /> */}
                                      </>}
                                  </th>
                                ) : (
                                  <th></th>
                                )}
                              </>
                            );
                          })}
                          {/* <th className="text-center vertical-middle">
                            {averagesFinal.find((n: any) => itemStudent?.id === n?.node?.studentId)?.node
                              ?.assessment?.toFixed(2) || ''}
                          </th>
                          <th className="text-center vertical-middle">
                            <Badge color="primary" className="font-0-8rem">
                              {averagesFinal.find(
                                (c: any) => c?.node?.studentId === itemStudent?.id,
                              )?.node?.performanceLevel?.name || '--'}
                            </Badge>
                          </th> */}
                        </tr>
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <></>
          )}
        </>
      ) : (
        ''
      )}
    </>
  );
};
const mapDispatchToProps = {
  ...experienceLearningActions,
  ...courseActions,
  ...componentEvaluativeActions,
  ...academicPeriodActions,
  ...valuationsActions,
  ...experienceLearningSelfActions,
  ...experienceLearningCoEvaluationActions,
  ...experienceLearningTraditionalActions,
  ...performanceLevelActions,
  ...academicAsignatureCouseActions,
  ...schoolConfiguarionActions
};

const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

export default connect(mapStateToProps, mapDispatchToProps)(SpreadsheetCourse);
