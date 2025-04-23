import { createNotification } from "../../helpers/Notification";
import { client } from "../graphql";
import { MUTATION_UPDATE_DATA_SIMAT } from "../graphql/ImportDataSchool/ImportDataSchoolMutations";


export const updateDataSimat = (schoolId: any, schoolYearId: any) => {
    return async (dispatch: any) => {
      try {
        let dataUpdate = null;
        await client
          .mutate({
            mutation: MUTATION_UPDATE_DATA_SIMAT,
            variables: { schoolId, schoolYearId},
          })
          .then((dataReponse: any) => {
            if (dataReponse.errors?.length > 0) {
              dataReponse.errors.forEach((error: any) => {
                createNotification('error', 'error', '');
              });
            } else {
              dataUpdate = dataReponse.data.update.id;
              createNotification('success', 'success', '');
            }
          });
        return dataUpdate as any;
      } catch (error) {
        createNotification('error', 'error', '');
        return error;
      }
    };
  };


