import { Injectable } from '@angular/core';
import { Gender, Hair, UserData, Skin } from '../interfaces/user-data';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  data: UserData;

  constructor() { }

  setData(data: UserData) {
    this.data = data;
  }

  getData(): UserData {
    return this.data;
  }

  getHair(): Hair {
    return this.data.hair;
  }

  getSkin(): Skin {
    return this.data.skin;
  }

  getGender(): Gender {
    return this.data.gender;
  }
}
