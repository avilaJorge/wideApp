export class User {

  googleUID: string;
  userName: string;
  photoURL: string;
  email: string;
  authExpires: number;
  groupName: string;
  strideLength: number = 0;
  age: number = 0;
  gender: string = '';
  signInEmail: string;
  isMeetupAuthenticated: boolean = false;
  meetup_access_data: any = {
    access_token: '',
    refresh_token: '',
    token_type: '',
    expiration_date: 0,
    expires_in: 0
  };
  meetup_token_expires: number = 0;
  isFitbitAuthenticated: boolean = false;
  fitbit_token_expires: number = 0;
  fitbit_access_data: any = {access_token: '', refresh_token: ''};


  constructor(fields?: any) {
    if (fields) {
      this.googleUID = fields.googleUID;
      this.userName = fields.userName;
      this.photoURL = fields.photoURL;
      this.email = fields.email;
      this.authExpires = fields.authExpires;
      this.groupName = fields.groupName;
      this.signInEmail = fields.signInEmail;
    } else {
      this.googleUID = null;
      this.userName = null;
      this.photoURL = null;
      this.email = null;
      this.authExpires = null;
      this.groupName = null;
      this.signInEmail = null;
    }
  }
}
