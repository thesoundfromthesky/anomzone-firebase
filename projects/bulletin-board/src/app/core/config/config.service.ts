import { Injectable } from '@angular/core';
import { Config } from './config.models';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  config!: Config;


  get forms(): Config['forms'] {
    return this.config.forms;
  }

  constructor() {}
}
