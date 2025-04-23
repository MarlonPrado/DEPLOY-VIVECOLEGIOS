import { gql } from '@apollo/client';

export const QUERY_GET_ALL_CLASSROOM_PLAN = gql`
  query getAllClassroomPlan($academicAsignatureCourseId: String!) {
    data: getAllClassroomPlan(orderCreated: true, allData: true, academicAsignatureCourseId: $academicAsignatureCourseId) {
      edges {
        cursor
        node {
          id
          startDate
          endDate             
          active
        }
      }
      totalCount
    }
  }
`;

export const QUERY_GET_CLASSROOM_PLAN = gql`
  query getClassroomPlan($id: String!) {
    data: getClassroomPlan(id: $id) {
      id     
      version
      startDate
      endDate
      classroomPlanExpectedPerformances {
        evaluativeComponentId
        evaluativeComponent {
          name
          id
        }
        evidenceLearningsId
        evidenceLearnings {
          id
          statement
        }
      }
      classroomPlanMethodologicalRoutes {
        name
        description
      }
      classroomPlanPerformanceAppraisalStrategies {
        evaluativeComponentId
        evaluativeComponent {
          name
          id
        }
        description
      }
      learningsId
      learnigs {
        id
        statement
      }
      academicStandardsId
      academicStandards{
        id
        standard
      }
      generalBasicLearningRightsId
      generalBasicLearningRights {
        id
        dba
      }
      academicPeriodId
      academicPeriod {
        startDate
        endDate
      }
      campus {
        school {
          pedagogicalModel
          educationalModel
          curricularComponent
        }
      }
      createdAt
      updatedAt
      createdByUser {
        name
      }
      updatedByUser {
        name
      }
    }
  }
`;

export const QUERY_GET_DROPDOWNS_CLASSROOM_PLAN = gql`
  query getDropdownsClassroomPlan($schoolId: String!, $academicAsignatureId: String!, $academicGradeId: String!, $academicPeriodsId: [String!], $generalAcademicAsignatureId: String, $generalAcademicGradeId: String, $learningsId : [String!]) {
    dataEvaluativeComponent: getAllEvaluativeComponent(
      allData: false
      orderCreated: false
      schoolId: $schoolId
    ) {
      edges {
        node {
          id
          name
        }
      }
    }
    dataLearnings: getAllLearning(orderCreated: true, allData: true,schoolId: $schoolId, academicAsignatureId: $academicAsignatureId, academicGradeId: $academicGradeId, academicPeriodsId: $academicPeriodsId) {
      edges {
        node {
          id
          statement
        }
      }
    }
    dataAcademicPeriods: getAllAcademicPeriod(
      allData: false
      orderCreated: false
      schoolId: $schoolId
      orderCustom: true
    ) {
      edges {
        node {
          id
          name
          startDate
          endDate
        }
      }
    }
    dataDBAS: getAllGeneralBasicLearningRight(
      orderCreated: true, allData: false, generalAcademicAsignatureId: $generalAcademicAsignatureId, generalAcademicGradeId: $generalAcademicGradeId
    ) {
      edges {
        node {
          id
          dba
        }
      }
    }
    dataStandards: getAllAcademicStandard(
      orderCreated: true, allData: false, schoolId: $schoolId,academicAsignatureId: $academicAsignatureId, academicGradeId: $academicGradeId
    ) {
      edges {
        node {
          id
          standard
        }
      }
    }
    dataEvidencesLearning: getAllEvidenceLearningLearnigs(learningsId: $learningsId) {
      edges {
        node {
          id
          statement
        }
      }
    }
  }
`;

export const QUERY_GET_COURSES_OF_GRADES = gql`
  query getCoursesOfGrade($academicGradeId: String!, $campusId: String!) {
    dataCourses: getAllCourse(
      allData: false
      orderCreated: false
      academicGradeId: $academicGradeId
      campusId: $campusId
    ) {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;