import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()
export class BaseService {
  constructor(
    protected httpClient: HttpClient
  ) {
  }

  protected bffUrl: string = 'http://localhost:5000/';
}
