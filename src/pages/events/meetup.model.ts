import { EntryDate } from "../../models/step-log.model";
import { fullDayName, fullMonthNames, monthNames } from "../../providers/time/time.service";

export class Meetup {
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
  rsvpSample: MeetupMember[] = [];

  constructor(fields: any) {
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
    this.venue = new MeetupVenue(fields.venue);
    this.timeInfo = new MeetupTime(fields);
    this.host = "Hosted by ";
    let comma: boolean = false;

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
  host: boolean;

  constructor(fields: any) {
    this.id = fields.id;
    this.name = fields.name;
    this.photo = fields.photo || '';
    this.role = fields.role || 'member';
    this.host = fields.event_context.host || false;
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
