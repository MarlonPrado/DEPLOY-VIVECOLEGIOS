import React from 'react';
import { Loader } from '../../common/Loader';
import { Input, Label } from 'reactstrap';
import moment from 'moment';
import IntlMessages from '../../../helpers/IntlMessages';
import { Colxx, Separator } from '../CustomBootstrap';

const CreateEditAuditInformation = (props: any) => {
  const { auditInfo, loading } = props;

  return (
    <>
      <div >
        <div>
          <IntlMessages id="forms.auditInformation" />
          <div className="float-right row mr-0">
            <Label>
              <IntlMessages id="forms.version" />: {auditInfo.version}
            </Label>
          </div>
        </div>
        <div>
          {loading ? (
            <Colxx sm={12} className="d-flex justify-content-center">
              <Loader />
            </Colxx>
          ) : (
            <>
              <Label />
              <div className="d-flex">
                {/* Created At */}
                <Label className="form-group has-float-label">
                  <Input defaultValue={moment(auditInfo.createdAt).format('YYYY-MM-DD h:mm a')} readOnly={true} />
                  <span>
                    <IntlMessages id="forms.createdAt" />
                  </span>
                </Label>
                <div className="p-2" />
                {/* Created By */}
                <Label className="form-group has-float-label">
                  <Input defaultValue={auditInfo.createdByUser?.name} readOnly={true} />
                  <span>
                    <IntlMessages id="forms.createdBy" />
                  </span>
                </Label>
              </div>
              <div className="d-flex">
                {/* Updated At */}
                <Label className="form-group has-float-label">
                  <Input defaultValue={moment(auditInfo.updatedAt).format('YYYY-MM-DD h:mm a')} readOnly={true} />
                  <span>
                    <IntlMessages id="forms.updatedAt" />
                  </span>
                </Label>
                <div className="p-2" />
                {/* Updated By */}
                <Label className="form-group has-float-label">
                  <Input defaultValue={auditInfo.updatedByUser?.name} readOnly={true} />
                  <span>
                    <IntlMessages id="forms.updatedBy" />
                  </span>
                </Label>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CreateEditAuditInformation;
