[![Build Status](https://travis-ci.org/telemark/minelev.svg?branch=master)](https://travis-ci.org/telemark/minelev)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)
# minelev

[![Greenkeeper badge](https://badges.greenkeeper.io/telemark/minelev.svg)](https://greenkeeper.io/)
Administrasjonsgrensesnitt for lærere i den videregående skolen.

Versjon 1.0.0 ble lansert 29. februar 2016.

## Docker

Bygg image

```sh
$ docker build -t minelev .
```

Start

```sh
$ docker run -d -p 80:3000 --name minelev minelev
```

Fra hub.docker.com
```sh
$ docker run -d -p 80:3000 --name minelev telemark/minelev
```

## Louie
[Louie](https://github.com/telemark/louie) er en samlebetegnelse for digitale løsninger utviklet av Telemark fylkeskommune.

MinElev er utviklet på Louieplattformen.

## Lisens
[MIT](LICENSE)