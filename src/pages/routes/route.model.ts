export const m_to_miles = 0.000621371;
export const m_to_ft = 3.280839895;
export const ua_end = 'https://api.ua.com';
export const inches_in_mile = 63360;
export const routes_limit = 20;

export class RouteMetaData {
  self_link: string;
  next_link: string;
  total_count: number;
  remaining: number;
  constructor (fields: any, current_remaining: number) {
    this.total_count = fields.total_count;
    this.remaining = current_remaining - routes_limit;
    this.self_link = fields._links.self[0].href;
    this.next_link = fields._links.next[0].href;
  }
}


export class Route {
  total_descent: number;
  city: string;
  starting_location: {type: string, coordinates: number[]};
  distance: number;
  distanceInMiles: number;
  distanceFromStart: number;
  name: string;
  max_elevation: number;
  min_elevation: number;
  total_ascent: number;
  gainInFt: number;
  links: {
    alternate: {href: string, id: string, name: string}[],
    user: {href: string, id: string}[];
    thumbnail: {href:string}[];
  }

  constructor(fields: any, lat: number, long: number) {
    this.total_descent = fields.total_descent;
    this.city = fields.city;
    this.starting_location = fields.starting_location;
    this.distance = fields.distance;
    this.distanceInMiles = this.distance * m_to_miles;
    this.name = fields.name;
    this.distanceFromStart = this.coordDistance(lat, long, this.starting_location.coordinates[1], this.starting_location.coordinates[0], 'M');
    this.max_elevation = fields.max_elevation;
    this.min_elevation = fields.min_elevation;
    this.total_ascent = fields.total_ascent;
    this.gainInFt = this.total_ascent * m_to_ft;
    this.links = fields._links;
  }


//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//:::                                                                         :::
//:::  This routine calculates the distance between two points (given the     :::
//:::  latitude/longitude of those points). It is being used to calculate     :::
//:::  the distance between two locations using GeoDataSource (TM) prodducts  :::
//:::                                                                         :::
//:::  Definitions:                                                           :::
//:::    South latitudes are negative, east longitudes are positive           :::
//:::                                                                         :::
//:::  Passed to function:                                                    :::
//:::    lat1, lon1 = Latitude and Longitude of point 1 (in decimal degrees)  :::
//:::    lat2, lon2 = Latitude and Longitude of point 2 (in decimal degrees)  :::
//:::    unit = the unit you desire for results                               :::
//:::           where: 'M' is statute miles (default)                         :::
//:::                  'K' is kilometers                                      :::
//:::                  'N' is nautical miles                                  :::
//:::                                                                         :::
//:::  Worldwide cities and other features databases with latitude longitude  :::
//:::  are available at https://www.geodatasource.com                          :::
//:::                                                                         :::
//:::  For enquiries, please contact sales@geodatasource.com                  :::
//:::                                                                         :::
//:::  Official Web site: https://www.geodatasource.com                        :::
//:::                                                                         :::
//:::               GeoDataSource.com (C) All Rights Reserved 2017            :::
//:::                                                                         :::
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

  coordDistance(lat1, lon1, lat2, lon2, unit) {
    let radlat1 = Math.PI * lat1/180
    let radlat2 = Math.PI * lat2/180
    let theta = lon1-lon2
    let radtheta = Math.PI * theta/180
    let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist)
    dist = dist * 180/Math.PI
    dist = dist * 60 * 1.1515
    if (unit=="K") { dist = dist * 1.609344 }
    if (unit=="N") { dist = dist * 0.8684 }
    return dist
  }
}






