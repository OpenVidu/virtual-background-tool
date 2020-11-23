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

  getEmail(): string {
    return this.data.email;
  }

  getGender(): Gender {
    return this.data.gender;
  }

  isDataSaved(): boolean {
    return !!this.data?.gender && !!this.data?.hair && !!this.data?.skin;
  }
}
