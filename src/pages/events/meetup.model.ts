import { EntryDate } from "../../models/step-log.model";
import { fullDayName, fullMonthNames, monthNames } from "../../providers/time/time.service";
import { MeetupRouteDB } from "../routes/route.model";

export enum Response {
  Yes = 1,
  No = 2,
  None = 3
}

export const rsvp_status = ['', 'You\'re going', 'You\'re not going', 'Are you going?'];

export class Meetup {
  id: string;
  going: Response;
  eventDate: EntryDate;
  link: string;
  eventName: string;
  description: string;
  rsvpLimit: number;
  status: string;
  yesRSVPCount: number;
  howToFindUs: string;
  descriptionImages: string[];
  featurePhoto: string;
  host: string;
  timeInfo: MeetupTime;
  group: MeetupGroup;
  venue: MeetupVenue;
  meetupSelf: MeetupSelf = null;
  rsvpSample: MeetupMember[] = [];

  constructor(fields: any) {
    this.going = Response.No;
    this.id = fields.id;
    this.eventDate = this.getEntryDate(fields.local_date);
    this.link = fields.link;
    this.eventName = fields.name;
    this.description = fields.description;
    this.rsvpLimit = fields.rsvp_limit;
    this.status = fields.status;
    this.descriptionImages = fields.description_images;
    this.featurePhoto = fields.featured_photo || '';
    this.howToFindUs = fields.how_to_find_us;
    this.yesRSVPCount = fields.yes_rsvp_count;
    this.group = new MeetupGroup(fields.group);
    this.venue = fields.venue ? new MeetupVenue(fields.venue) : null;
    this.timeInfo = new MeetupTime(fields);
    this.host = "Hosted by ";
    let comma: boolean = false;

    if (fields.rsvp_sample) {
      for (let sample of fields.rsvp_sample) {
        this.rsvpSample.push(new MeetupMember(sample.member));
        let mem = this.rsvpSample[this.rsvpSample.length - 1];
        if (mem.host) {
          if (comma) {
            this.host += (", " + mem.name);
          } else {
            this.host += mem.name;
            comma = true;
          }
        }
      }
    }
    if (fields.self) {
      this.meetupSelf = new MeetupSelf(fields.self);
    }
  }

  getEntryDate(dateStr: string): EntryDate {
    const monthNum = parseInt(dateStr.substring(5,7), 10);
    let entryDate: EntryDate = {
      rawDate: dateStr,
      month: monthNames[monthNum - 1],
      monthNum: monthNum,
      day: parseInt(dateStr.substring(8, 10), 10),
      year: parseInt(dateStr.substring(0, 4), 10)
    };
    return entryDate;
  }
}

export class MeetupMember {
  id: number;
  name: string;
  photo: string;
  role: string;
  roleStr: string;
  host: boolean;

  constructor(fields: any) {
    this.id = fields.id;
    this.name = fields.name;
    this.photo = fields.photo || '';
    this.role = fields.role || 'member';
    this.roleStr = this.getRoleStr(this.role);
    this.host = fields.event_context.host || false;
  }

  getRoleStr(role: string) {
    switch (role) {
      case 'assistant_organizer': {
        return "Assistant Organizer";
      }
      case 'coorganizer': {
        return "Coorganizer";
      }
      case 'event_organizer': {
        return "Event Organizer";
      }
      case 'organizer': {
        return "Organizer";
      }
      default: {
        return "Member";
      }
    }
  }
}

export class MeetupGroup {
  name: string;
  id: number;
  urlName: string;
  keyPhoto: string;
  location: string;

  constructor(fields: any) {
    this.name = fields.name;
    this.id = fields.id;
    this.urlName = fields.urlname;
    this.keyPhoto = fields.key_photo || '';
    this.location = fields.localized_location;
  }
}

export class MeetupTime {
  duration: number;
  created: number;
  time: number;
  updated: number;
  utfOffset: number;
  startTime: string;
  endTime: string;
  month: string;
  day: string;
  date: number;

  constructor(fields: any) {
    this.created = fields.created;
    this.duration = fields.duration;
    this.time = fields.time;
    this.updated = fields.updated;
    this.utfOffset = fields.utc_offset;
    let date = new Date(this.time);
    let str = date.toLocaleTimeString();
    let index = str.indexOf(':', str.indexOf(':') + 1);
    this.startTime = str.substring(0, index) + str.substring(index + 3);
    str = (new Date(this.time + this.duration)).toLocaleTimeString();
    index = str.indexOf(':', str.indexOf(':') + 1);
    this.endTime = str.substring(0, index) + str.substring(index + 3);
    this.month = fullMonthNames[date.getMonth() + 1];
    this.day = fullDayName[date.getDay()];
    this.date = date.getDate();
  }
}

export class MeetupVenue {
  name: string;
  lat: number;
  lon: number;
  location: { address_1: string, address_2: string };
  city: string;
  zip: string;
  constructor(fields: any) {
    this.name = fields.name;
    this.lat = fields.lat;
    this.lon = fields.lon;
    this.location = {
      address_1: fields.address_1,
      address_2: fields.address_2 || ''
    };
    this.city = fields.city;
    this.zip = fields.zip;
  }
}

export class MeetupSelf {
  actions: string[];
  role: string;
  rsvp: {answers: string, guests: number, response: Response};
  constructor(fields: any) {
    this.actions = fields.actions ? fields.actions : [];
    this.role = fields.role;
    let temp = {
      answers: null,
      guests: 0,
      response: Response.None
    };
    if (fields.rsvp) {
      temp.answers = fields.rsvp.answers || null;
      temp.guests = fields.rsvp.guests || 0;
      temp.response = MeetupRSVP.getResponse(fields.rsvp.response);
    }
    this.rsvp = temp;
  }
}

export class MeetupComment {
  comment: string;
  created: number;
  postDate: string;
  id: number;
  likeCount: number;
  inReplyTo: number;
  replies: MeetupComment[] = [];
  member: MeetupMember;

  constructor(fields: any) {
    this.comment = fields.comment;
    this.created = fields.created;
    this.postDate = MeetupComment.parseDateString(this.created);
    this.id = fields.id;
    this.likeCount = fields.like_count;
    this.inReplyTo = fields.in_reply_to ? fields.in_reply_to : null;
    this.member = new MeetupMember(fields.member);
    if (fields.replies) {
      for (let reply of fields.replies) {
        this.replies.push(new MeetupComment(reply));
      }
    }
  }

  public static parseDateString(dateNum: number): string {
    const dateObj: Date = new Date(dateNum);
    let timeStr = dateObj.toLocaleTimeString();
    let index = timeStr.indexOf(':', timeStr.indexOf(':', 0));
    timeStr = timeStr.substring(0, index) + timeStr.substring(index + 3);
    let dateStr = dateObj.toLocaleDateString();
    let dateIndex = dateStr.indexOf('/', dateStr.indexOf('/', 0) + 1);
    dateStr = dateStr.substring(0, dateIndex + 1) + dateStr.substring(dateIndex + 3);
    return dateStr + ' ' + timeStr;
  }
}

export class MeetupProfile {
  id: number;
  name: string;
  email: string;
  status: string;
  joined: number;
  city: string;
  bio: string;
  photo: { thumb_link: string, photo_link: string };
  groupProfile: MeetupGroupProfile;
  privacy: {bio: string, groups: string, topics: string};
  topics: MeetupTopics[] = [];
  stats: {groups: number, topics: number, rsvps: number};

  constructor(fields: any) {
    this.id = fields.id || 0;
    this.name = fields.name || '';
    this.email = fields.email || '';
    this.status = fields.status || '';
    this.joined = fields.joined || 0;
    this.city = fields.city || '';
    this.bio = fields.bio || '';
    this.stats = fields.stats || {groups: 0, topics: 0, rsvps: 0};
    if (fields.photo) {
      this.photo = { thumb_link: fields.photo.thumb_link || '', photo_link: fields.photo.photo_link || '' };
    } else {
      this.photo = { thumb_link: '', photo_link: '' };
    }
    if (fields.group_profile) {
      this.groupProfile = new MeetupGroupProfile(fields.group_profile);
    } else {
      this.groupProfile = new MeetupGroupProfile('');
    }
    this.privacy = fields.privacy || {bio: '', groups: '', topics: ''};
    if (fields.topics) {
      this.topics = fields.topics;
    }
  }
}

export class MeetupGroupProfile {
  created: number;
  intro: string;
  link: string;
  createdYear: number;
  constructor(fields: any) {
    this.created = fields.created || 0;
    this.createdYear = (new Date(this.created)).getFullYear();
    this.intro = fields.intro || '';
    this.link = fields.link || '';
  }
}

export class MeetupTopics {
  id: number;
  name: string;
  urlkey: string;
  lang: string;

  constructor(fields: any) {
    this.id = fields.id || 0;
    this.name = fields.name || '';
    this.urlkey = fields.urlkey || '';
    this.lang = fields.lang || '';
  }
}

export class MeetupRSVP {
  created: number;
  updated: number;
  response: Response;
  guests: number;
  dateStr: string;
  member: MeetupMember;

  constructor(fields: any) {
    this.created = fields.created;
    this.updated = fields.updated;
    this.response = MeetupRSVP.getResponse(fields.response);
    this.guests = fields.guests;
    this.member = new MeetupMember(fields.member);
    this.dateStr = MeetupComment.parseDateString(this.updated);
  }

  public static getResponse(response: any): Response {
    if(response) {
      if (response === "yes") {
        return Response.Yes;
      } else {
        return Response.No;
      }
    } else {
      return Response.None;
    }
  }

  public static getStrResponse(response: Response): string {
    switch (response) {
      case Response.No: {
        return "no";
      }
      case Response.Yes: {
        return "yes";
      }
      case Response.None: {
        return "";
      }
      default: {
        return "";
      }
    }
  }

}

export interface DBMeetup {
  id: string;
  name: string;
  status: string;
  time: number;
  duration: number;
  date_str: string;
  time_str: string;
  route: MeetupRouteDB;
}
