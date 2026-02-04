import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";

@Injectable()
export class BaseService {
  protected httpClient = inject(HttpClient);


  protected bffUrl: string = 'http://localhost:5000/';
}
