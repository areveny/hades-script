import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface TextLine {
    speaker: string;
    text: string;
}

export interface TextLines {
    [index: number]: TextLine;
}

// https://angular.io/guide/http
@Injectable()
export class QueryService {

    queryEndpoint = 'http://localhost:3000'

    constructor(private http: HttpClient) {}

    runQuery() {
        return this.http.get<TextLine[]>(this.queryEndpoint)
    }


}