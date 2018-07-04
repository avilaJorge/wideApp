import { Injectable } from '@angular/core';

import { Report } from '../../models/report';
import { GetItDoneRestApi } from '../getitdone-rest-api/getitdone-rest-api';

/*
  Generated class for the ReportsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class Reports {
  reports: Report[] = [];
  defaultReport: any = {
    'service_request_id': '',
    'service_name': '',
    'service_code': '',
    'description': '',

  }

  constructor(public api: GetItDoneRestApi) {
    console.log('Hello ReportsProvider Provider');
  }

}
