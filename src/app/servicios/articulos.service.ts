import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 

@Injectable()
export class ArticulosService {

  constructor(private http: HttpClient) { }

  getArticulo(){
    let url = "http://localhost:3000/articulo"
    return this.http.get(url)
                    .map( (resp:any) => {
                      return resp;
                    });
  }

  postArticulo(articulo){
    let url = "http://localhost:3000/articulo"
    return this.http.post(url, articulo)
                    .map( (resp:any) => {
                      return resp;
                    });
  }

}
