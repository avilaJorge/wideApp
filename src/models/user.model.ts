export class User {

  googleUID: string;
  userName: string;
  photoURL: string;
  email: string;
  authExpires: string;
  groupName: string;
  isMeetupAuthenticated: boolean = false;
  meetupAuthToken: string = '';
  isUAAuthenticated: boolean = false;
  underArmourAuthToken: string = '';


  constructor(fields: any) {
    this.googleUID = fields.googleUID;
    this.userName = fields.userName;
    this.photoURL = fields.photoURL;
    this.email = fields.email;
    this.authExpires = fields.authExpires;
    this.groupName = fields.groupName;
  }
}
