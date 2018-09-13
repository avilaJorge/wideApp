export class User {

  googleUID: string;
  userName: string;
  photoURL: string;
  email: string;
  authExpires: string;
  groupName: string;
  isMeetupAuthenticated: boolean = false;
  meetupAccessToken: string = '';
  meetupRefreshToken: string = '';
  meetupTokenType: string = '';
  meetupTokenExpiresIn: number = 0;
  meetupTokenExpirationDate: number = 0;
  isFitbitAuthenticated: boolean = false;


  constructor(fields: any) {
    this.googleUID = fields.googleUID;
    this.userName = fields.userName;
    this.photoURL = fields.photoURL;
    this.email = fields.email;
    this.authExpires = fields.authExpires;
    this.groupName = fields.groupName;
  }
}
