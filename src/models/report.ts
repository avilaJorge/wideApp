/**
 * A generic model that our MeetupList pages list, create, and delete.
 *
 * Change "Item" to the noun your app will use. For example, a "Contact," or a
 * "Customer," or a "Animal," or something like that.
 *
 * The Items service manages creating instances of Item, so go ahead and rename
 * that something that fits your app as well.
 */
export class Report {

  constructor(fields: any) {
    // Quick and dirty extend/assign fields to this model
    for (const f in fields) {
      // @ts-ignore
      this[f] = fields[f];
    }
    this['street'] = this['address'].split(',', 3)[0];
    console.log("Address is " + this['street']);
  }

}

export interface Report {
  [prop: string]: any;
}
