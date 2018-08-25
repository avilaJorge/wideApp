import { EntryDate } from "../../models/step-log.model";
import { monthNames } from "../../providers/time/time.service";

export class Meetup {
  eventDate: EntryDate;
  eventTime: string;
  link: string;
  eventName: string;
  description: string;
  rsvpLimit: number;
  status: string;
  yesRSVPCount: number;
  howToFindUs: string;
  descriptionImages: string[];
  featurePhoto: string;
  group: MeetupGroup;
  venue: MeetupVenue;
  rsvpSample: MeetupMember[] = [];


  constructor(fields: any) {
    this.eventDate = this.getEntryDate(fields.local_date);
    this.eventTime = fields.local_time;
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

    for (let sample of fields.rsvp_sample) {
      this.rsvpSample.push(new MeetupMember(sample.member));
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
