# spotifyToken
Servicio sobre NodeJs que devuelve el token para conectar a la API de Spotify

Script JS ejecutado sobre NodeJs que provee un servicio cuya finalidad es devolver un token válido 
para conseguir el "client credentials" necesario para trabajar con la API de SPOTIFY.

<b>Ruta del servicio </b>  

    '/get_token';

<b>Parámetro necesarios que ha de ser enviados a la ruta por post</b>

        client_id // Your client id
        client_secret // Your client secret
        grant_type //grant_type ('client_credentials')

<b>Return del servicio</b>

        token // el servicio hace una llamada a 'https://accounts.spotify.com/api/token' y
        devuelve un token válido generado a partir del client_id, client_secret y grant_type


<b>Example in Angular 4</b>

*spotify.service.ts*
```
    import { Injectable } from '@angular/core';
    import { Http, Headers } from '@angular/http';
    import 'rxjs/add/operator/map';

    @Injectable()
    export class SpotifyService {
        artistas:any [] = [];

        urlBusqueda = 'https://api.spotify.com/v1/search';
        urlArtista = 'https://api.spotify.com/v1/artists';


        constructor( private http:Http ) { }

        getToken(){
            let url = 'https://spotifygeneratetoken.herokuapp.com/get_token';
            let client_id = '9027c81b4bf0438d904415937a6757ee';
            let client_secret = 'c7a7d99ce2da4a7aa0b7b7e70f602e16';
            let grant_type = 'client_credentials';

            let headers = new Headers();
            headers.append('Content-Type', 'application/json');

            let data = JSON.stringify ({
                client_id: client_id,
                client_secret: client_secret,
                grant_type: grant_type

            });

            return this.http.post(url, data, { headers })
                .map(res => 'Bearer ' + res["_body"]);
        };


        getArtistas( termino:string, token:string ){

            let headers = new Headers();
            headers.append( 'Authorization', token);

            let query = `?q=${ termino }&type=artist`;
            let url = this.urlBusqueda + query ;

            return this.http.get( url, { headers })
            .map( res => {
                //console.log( JSON.parse(res['_body']) ); //esto hace lo mismo que res.json(), json() es una función que traen los response pasados por un map y consiste en hacer un parse de lo que se envía en el body como respuesta

                this.artistas = res.json().artists.items;
                console.log(this.artistas);
                return this.artistas;
            });

        }

    }
```
*search.component.ts*
```
import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../../services/spotify.service';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

    termino:string = "";
    artistas:any[] = [] ;
    constructor( private _spotifyService:SpotifyService ) { }

    ngOnInit() {}

    buscarArtista(){
		this._spotifyService.getToken().subscribe( token => {
            this._spotifyService.getArtistas( this.termino, token ).subscribe();
        });
    }

}
```

