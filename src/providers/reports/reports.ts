import { Injectable } from '@angular/core';

import { Report } from '../../models/report';
import { GetItDoneRestApi } from '../api/getitdone-rest-api';

/*
  Generated class for the ReportsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class Reports {
  reports: Report[] = [];
  services = new Array();
  serviceNames = new Array();

  defaultReport: any = {
    'service_request_id': '',
    'service_name': '',
    'service_code': '',
    'description': 'Something went wrong!',
    'media_url': '',
    'street': '',
    'address': ''
  }

  endpoints = {
    requests: 'requests.json',
    services: 'services.json'
  }

  constructor(public api: GetItDoneRestApi) {
    console.log('Hello ReportsProvider Provider');

    this.api.get(this.endpoints.services).then(data => {
      for (let index in data) {
        console.log(data[index]);
        this.services.push(data[index]);
        this.serviceNames.push({
          'service_code': data[index]['service_code'],
          'service_name': data[index]['service_name'],
          'service_group': data[index]['group']
        });
      }
    });
    console.log(this.serviceNames);

    this.api.get(this.endpoints.requests).then(data => {
      for (let index in data) {
        console.log(data[index]);
        this.reports.push(new Report(data[index]));
      }
    });
    console.log(this.reports);
  }

  query(params?: any) {
    return this.reports;
  }

  getServices() {
    return this.serviceNames;
  }

  add(report: Report) {

  }

  delete(report: Report) {

  }
}
