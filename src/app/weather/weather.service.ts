import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ICurrentWeather } from '../interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface ICurrentWeatherData {
  weather: [{
    description: string,
    icon: string
  }],
  main: {
    temp: number
  },
  sys: {
    country: string
  },
  dt: number,
  name: string
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(private httpClient: HttpClient) { }

  private transformToICurrentWeather(data: ICurrentWeatherData): ICurrentWeather{
    return {
      city: data.name,
      country: data.sys.country,
      date: data.dt * 1000,
      image: `http://openweathermap.org/img/w/${data.weather[0].icon}.png`,
      temperature: Math.round(this.convertKelvinToFahrenheit(data.main.temp)),
      description: data.weather[0].description
    }
  }

  private convertKelvinToFahrenheit(kelvin: number){
    return kelvin * 9 / 5 - 459.67
  }

  getCurrentWeather(city): Observable<ICurrentWeather>{
    return this.httpClient.get<ICurrentWeatherData>(
      `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${environment.apiKey}`
    ).pipe(
      map(data => this.transformToICurrentWeather(data))
    )
  }
}

// test use
export interface IWeatherService {
  getCurrentWeather(city: string, country: string):Observable<ICurrentWeather>
}