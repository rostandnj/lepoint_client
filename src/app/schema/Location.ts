import {Country} from './Country';

export interface Location {
  id: string;
  country: Country;
  city: string;
  street: string;
  street_detail: string;
  map_link: string;
  longitude: string;
  latitude: string;
  is_active: boolean;
}
