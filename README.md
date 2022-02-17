### Hexlet tests and linter status:
[![Actions Status](https://github.com/TimurSeyidov/backend-project-lvl2/workflows/hexlet-check/badge.svg)](https://github.com/TimurSeyidov/backend-project-lvl2/actions) [![Maintainability](https://api.codeclimate.com/v1/badges/26f705f13c9859f0ca2e/maintainability)](https://codeclimate.com/github/TimurSeyidov/backend-project-lvl2/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/26f705f13c9859f0ca2e/test_coverage)](https://codeclimate.com/github/TimurSeyidov/backend-project-lvl2/test_coverage)

## О пакете

Программа `gendeff` позволяет сравнивать структуру двух файлов.
Поддерживает файлы формата **json** и **yaml**.

## Установка
```sh
make install
```

## Запуск тестов

```sh
make test
```

## Использование
Сравнение файлов
```sh
gendiff file1.json file2.json
```
[![asciicast](https://asciinema.org/a/OuBMeyyFKRdvWKIpX54VGJ1hy.png)](https://asciinema.org/a/OuBMeyyFKRdvWKIpX54VGJ1hy)

Помощь
```sh
gendiff -h
```
