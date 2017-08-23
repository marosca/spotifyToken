# spotifyToken
Servicio sobre NodeJs que devuelve el token para conectar a la API de Spotify

Script JS ejecutado sobre NodeJs que provee un servicio cuya finalidad es devolver un token válido 
para conseguir el "client credentials" necesario para trabajar con la API de SPOTIFY.
En el ejemplo de más abajo se guarda este token en el localStorage y se verifica si ha expirado
para evitar hacer llamadas constantes a la api de Spotify.

<b>Ruta del servicio </b>  

    '/get_token';

<b>Parámetros necesarios que ha de ser enviados a la ruta por el verbo post</b>

        client_id // Your client id
        client_secret // Your client secret
        grant_type //grant_type ('client_credentials')

<b>Return del servicio</b>

        token // el servicio hace una llamada a 'https://accounts.spotify.com/api/token' y
        devuelve un token válido generado a partir del client_id, client_secret y grant_type. En la
	primera llamada guarda el valor del token en el localStorage. La siguiente vez hace la comprobación
	de que existe el token en el storage y de que no ha expirado antes de realizar de nuevo la petición por http


<b>Example in Angular 4</b>

*spotify.service.ts*
```
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class SpotifyService {
    artistas:any [] = [];
    artista:any [] = [];

    urlBusqueda = 'https://api.spotify.com/v1/search';
    urlArtista = 'https://api.spotify.com/v1/artists';


    constructor( private http:Http ) { }

    getTokenFromSpotify(){

	let url = 'https://spotifygeneratetoken.herokuapp.com/get_token';
        let client_id = 'YOUR CLIENT ID';
        let client_secret = 'YOUR CLIENT SECRET';
        let grant_type = 'client_credentials';

        let headers = new Headers();
		headers.append('Content-Type', 'application/json');

        let data = JSON.stringify ({
            client_id: client_id,
            client_secret: client_secret,
            grant_type: grant_type

        });

        return this.http.post(url, data, { headers })
            .map(res => {
                let token =
                    JSON.stringify({
                        token: 'Bearer ' + res["_body"],
                        time: new Date()
                    });
                if (window.localStorage)
                    localStorage['spotifyToken'] = token;

                return 'Bearer ' + res["_body"];
            });
    };

    isTokenExpired(){
        let last = new Date( JSON.parse( localStorage.spotifyToken ).time );
        let now = new Date();
        let diff = ( Number(now)- Number(last) ) / (1000);
        return (diff >= 1);
    }

    getToken(){
        if (localStorage.spotifyToken && !this.isTokenExpired() ){
            let localTokenObj = JSON.parse( localStorage.spotifyToken );

            let localToken = new Observable( observer => {
                observer.next( localTokenObj.token );
                observer.complete();
            });
            console.log('TOKEN EXTRAIDO DE LOCALSTORAGE');
            return localToken;

        } else {
            console.log('TOKEN de Spotify');
            return this.getTokenFromSpotify();
        }
    }

    getArtistas( termino:string, token?:string ){

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
    };

    getArtista(id:string, token:string){
        let headers = new Headers();
        headers.append( 'Authorization', token);

        let url = this.urlArtista + '/' + id ;

        return this.http.get( url , { headers })
            .map( res => res.json());
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
            this._spotifyService.getArtistas( this.termino, String(token) ).subscribe();
        });
    }

}
```
<h2>try the service in: https://spotifygeneratetoken.herokuapp.com/get_token</2>
