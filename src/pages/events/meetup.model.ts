import { EntryDate } from "../../models/step-log.model";
import { monthNames } from "../../providers/time/time.service";

export class Meetup {
  groupName: string;
  eventDate: EntryDate;
  eventTime: string;
  link: string;
  eventName: string;
  lat: number;
  lon: number;
  location: string;
  groupId: number;
  description: string;
  place: string;

  constructor(fields: any) {
    this.groupName = fields.group.name;
    this.eventDate = this.getEntryDate(fields.local_date);
    this.eventTime = fields.local_time;
    this.link = fields.link;
    this.eventName = fields.name;
    this.lat = fields.venue.lat;
    this.lon = fields.venue.lon;
    this.location = fields.venue.address_1;
    this.groupId = fields.group.id;
    this.description = fields.description;
    this.place = fields.venue.name;
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
