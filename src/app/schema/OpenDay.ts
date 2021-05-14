import {Day} from './Day';

export interface OpenDay{
  id: string;
  start_hour_one: string;
  start_hour_two: string;
  end_hour_one: string;
  end_hour_two: string;
  day: Day;
}
