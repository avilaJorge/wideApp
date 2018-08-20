import { Injectable } from "@angular/core";

import 'rxjs/add/operator/toPromise';

import { FeedPostModel } from './feed.model';
import { FirebaseService } from "../../providers";
import { Http } from "@angular/http";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class FeedService {
  constructor(private firebaseService: FirebaseService, public http: HttpClient) {}

  getPosts(): Promise<FeedPostModel[]> {
    return this.http.get<{feed: any}>('./assets/example_data/feed.json')
               .toPromise()
               .then(response => response.feed as FeedPostModel[])
               .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
