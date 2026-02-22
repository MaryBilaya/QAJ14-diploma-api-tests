# Playwright API Tests – JSONBin API

Учебный проект с API-автотестами на Typescript + Playwright для сервиса JSONBin. Показывает умение писать автотесты для REST API (CRUD-операции, позитивные и негативные сценарии).
Основные эндпоинты, которые покрыты тестами:
* POST      /v3/b - создание bin
* GET       /v3/b/{binId} - чтение bin
* PUT       /v3/b/{binId} - обновление bin
* DELETE    /v3/b/{binId} - удаление bin 

## 📌 Цель проекта
- Отработать написание автотестов для CRUD-операций REST API.
- Потренироваться в работе с Playwright APIRequestContext.
- Поправктиковаться в структуре тестового фреймворка (контроллеры, фикстуры, тестовые данные).

## Документация JSONBin
* общий API Reference: https://jsonbin.io/api-reference

## 🧰 Стек технологий
- Node.js
- Typescript
- Playwright Test (APIRequestContext)
- JSONBin API v3 (хранилище JSON)
- dotenv

## 📂 Структура проекта
```text
├─ helpers/                   # вспомогательные функции 
│  ├─ create_test_bin.ts      # создание тестовых bin
│  └─ update_test_bin.ts      # обновление тестовых bin 
├─ tests/
│  ├─ create_bin.spec.ts      # тесты создания bin
│  ├─ delete_bin.spec.ts      # тесты удаления bin
│  ├─ read_bin.spec.ts        # тесты чтения bin
│  └─ update_bin.spec.ts      # тесты обновления bin
├─ controller.ts              # ControllerBin: create/read/update/delete для JSONBin
├─ fixtures.ts                # общие фикстуры / подготовка данных
├─ playwright.config.ts
└─ README.md
``` 

## Клонирование репозитория
* git clone https://github.com/MaryBilaya/QAJ14-diploma-api-tests.git
* cd QAJ14-diploma-api-tests

## Установка зависимостей
npm install

## Переменные окружения
Создайте файл .env в корне проекта и добавьте в него ключи JSONBin: 

X_Master_Key = ваш_master_key

В коде ключи читаются через process.env.X_Master_Key и сохраняются в приватные поля

## Запуск всех тестов
npm test

## HTML-отчет
HTML-отчет открывается автоматически после прогона, вне зависимости от passed или failed

## Что покрыто автотестами
|  №  |   Название CRUD-операции     |                   Test name                 |                     Название теста                   |          tag         |  
|-----|------------------------------|---------------------------------------------|------------------------------------------------------|----------------------|
| 1   | Create Bins API              | Create private bin (by default)             | Успешное создание bin с простым JSON (по умолчанию   | @positive            |
|     |                              |                                             | создастся private bin -> X-Bin-Private = true)       |                      |
| 2   |                              | Create bin: public bin                      | Создание публичного bin (X-Bin-Private = false)      | @positive            |
| 3   |                              | Create bin with name                        | Создание bin с именем X-Bin-Name                     | @positive, @extended |
| 4   |                              | Negative case. Create bin: invalid body     | Отправка запроса с некорректно заполненным body      | @negative            |
| 5   |                              | Negative case. Create bin: empty body       | Отправка запроса с пустым body                       | @negative            | 


|  №  |   Название CRUD-операции     |                   Test name                 |                     Название теста                   |          tag         |  
|-----|------------------------------|---------------------------------------------|------------------------------------------------------|----------------------|
| 1   | Delete Bins API              | Delete existing bin                         | Успешное удаление существующего bin                  | @positive            |
| 2   |                              | Attempt to delete the same bin again        | Попытка повторного удаления того же bin              | @negative            |
| 3   |                              | Delete bin with invalid bin_id              | Удаление bin с невалидным bin_id                     | @negative            |
| 4   |                              | Delete bin withot master key                | Удаление bin без X-Master-Key                        | @negative            |


|  №  |   Название CRUD-операции     |                   Test name                 |                     Название теста                   |          tag         |  
|-----|------------------------------|---------------------------------------------|------------------------------------------------------|----------------------|
| 1   | Read Bins API                | Read existing bin with metadata             | Чтение существующего bin с metadata                  | @positive            | 
| 2   |                              | Read existing bin without metadata          | Чтение существующего bin без metadata (meta=false)   | @positive            |
| 3   |                              | Try to read bin with invalid bin_id         | Чтение bin с невалидным bin_id                       | @negative            |
| 4   |                              | Read bin missing master key                 | Чтение bin без X-Master-Key                          | @negative            |


|  №  |   Название CRUD-операции     |                   Test name                 |                     Название теста                   |          tag         |  
|-----|------------------------------|---------------------------------------------|------------------------------------------------------|----------------------|
| 1   | Update Bins API              | Successful bin updating                     | Успешное обновление bin                              | @positive            | 
| 2   |                              | Update with X-Bin-Version = true            | Обновление с версионированием (X-Bin-Version = true) | @positive, @extended |
| 3   |                              | Updating with invalid binId                 | Обновление с невалидным binId                        | @negative            |
| 4   |                              | Update with empty data                      | Обновление с пустым data                             | @negative            |
| 5   |                              | Updating without X-Master-Key               | Обнолвение без передачи X-Master-Key                 | @negative            |