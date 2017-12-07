export interface User<Group = string> {
  name: string;
  is_active: boolean;
  email: string;
  group: Group;
  date_joined: string;
}