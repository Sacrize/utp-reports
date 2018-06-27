# UTP Sprawozdania

Mała aplikacja z 2-ma modułami, dla studenta i dla nauczyciela do zarządzania sprawozdaniami.


### Opis

Nauczyciel dodaje ćwiczenia odnośnie konkretnej grupy studentów. Oni zaś realizują je i uploadują sprawozdania.
Sprawozdania w postaci plików są skanowane przez antywirus (clamav) i wrzucane do GridFS w MongoDB.

Dokumentacja podstawki [express-vue/express-vue](https://github.com/express-vue/express-vue)

### Uruchomienie

Aplikacja wymaga połączenia z MongoDB i ClamAV. Całość skonfigurowana jest dzięki docker-compose.
Wystarczy odpalić poleceniem:

```sh
$ docker-compose up -d
```

Aplikacja działa na porcie 9000.
