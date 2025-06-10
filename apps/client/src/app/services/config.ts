import { Injectable } from '@angular/core';
import config from '../../../config.json'

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  public readonly apiUrl: string;

  constructor() {
    // Check if the placeholder is still there, if so use localhost for development
    this.apiUrl = config.apiUrl === '__API_URL__'
      ? 'http://localhost:3000'
      : config.apiUrl;
  }
}
