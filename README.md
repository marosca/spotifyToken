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
