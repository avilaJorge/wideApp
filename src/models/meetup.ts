/**
 * A generic model that our MeetupList pages list, create, and delete.
 *
 * Change "Item" to the noun your app will use. For example, a "Contact," or a
 * "Customer," or a "Animal," or something like that.
 *
 * The Items service manages creating instances of Item, so go ahead and rename
 * that something that fits your app as well.
 */
export class Meetup {

  constructor(fields: any) {
    // Quick and dirty extend/assign fields to this model
    //for (const f in fields) {
    //  // @ts-ignore
    //  this[f] = fields[f];
    //}
    this['organizer_photo'] = fields.organizer.photo ? fields.organizer.photo.thumb_link : 'assets/imgs/no_user1.png';
    this['name'] = fields.name;
    this['city'] = fields.city;
    this['key_photo'] = fields.key_photo ? fields.key_photo.photo_link :
      fields.group_photo ? fields.group_photo.photo_link : '';
    this['description'] = fields.description;
  }

}

export interface Meetup {
  [prop: string]: any;
}
