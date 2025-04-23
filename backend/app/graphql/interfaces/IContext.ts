export interface IContext {
  user: {
    authorization: any;
    iat: any;
    exp: any;
    sub: any;
  };
  requestData: {
    ip: any;
    geo: any;
    browser: any;
    language:any;
    ipware: any;
    ipwarePublic: any;
  }
}
