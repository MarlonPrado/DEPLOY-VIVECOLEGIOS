import { gql } from '@apollo/client';

export const QUERY_GET_ALL_ACADEMIC_HOUR = gql`
  query getAllAcademicHour($academicDayId: String!, $allData: Boolean!) {
    data: getAllAcademicHour(orderCreated: true, allData: $allData, academicDayId: $academicDayId) {
      edges {
        cursor
        node {
          id
          active
          order
          startTime                        
          endTime  
          academicDay  {            
            name
            day
          }                        
        }
      }
      totalCount
    }
  }
`;

export const QUERY_GET_ACADEMIC_HOUR = gql`
  query getAcademicHour($id: String!) {
    data: getAcademicHour(id: $id) {
      id   
      startTime                        
      endTime   
      order                         
      campusId     
      campus  {
        id
        name
      }                       
      academicDayId     
      academicDay  {
        id
        name
        day 
      }         
      schoolId
      school {
        id
        name
      }
      schoolYearId
      schoolYear {
        id
        schoolYear
      }                  
      version
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

export const QUERY_GET_DROPDOWNS_ACADEMIC_HOUR = gql`
  query getDropdownsAcademicHour($schoolId: String!) {
    dataCampus: getAllCampus(allData: false, orderCreated: false, schoolId: $schoolId) {
      edges {
        node {
          id
          name
        }
      }
    }    
  }
`;
