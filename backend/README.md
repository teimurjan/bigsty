# Models

## Category

Category of a product. Example: `Cellphones`.

| Column | Type    | Nullable |
| ------ | ------- | -------- |
| id     | integer | not null |

Categoty has intl field `name`.

| Column      | Type                  | Nullable |
| ----------- | --------------------- | -------- |
| id          | integer               | not null |
| value       | character varying(50) | not null |
| category_id | integer               | not null |
| language_id | integer               | not null |


# API endpoints

- <b>All requests require header `Content-Type: applicaiton/json`</b>

- <b>All GET requests can have language header `Accept-Language: de-DE`. The intl fields of the requested resource will be returned in the provided language. If it's not provided `en-US` is used by default. The header's value should be language code of an existing language in your app's database.</b>
- <b>All DELETE, PUT and POST requests require a user to be an admin or a manager.

## Category

### GET `/categories`

Returns all categories.

Successful response example:

```json
{
  "data": [
    {
      "id": 1,
      "name": "Category #1"
    },
    {
      "id": 2,
      "name": "Category #2"
    }
  ]
}
```

### POST `/categories`

Creates a category.

Request payload example:

```json
{
  "names": [
    {
      "language_id": 1,
      "value": "Category #1"
    }
  ]
}
```

Where `names` is an array of the names for all available languages in your app's database.

Successful response example:

```json
{
  "data": [
    {
      "id": 1,
      "name": "Category #1"
    },
    {
      "id": 2,
      "name": "Category #2"
    }
  ]
}
```

### GET `/category/<id>`

Returns a category by ID.

Successful response example:

```json
{
  "data": {
    "id": 1,
    "name": "Category #1"
  }
}
```

### PUT `/category/<id>`

Updates a category by ID.

Request payload example:

```json
{
  "names": [
    {
      "language_id": 1,
      "value": "Category New #1"
    }
  ]
}
```

Where `names` is an array of the names for all available languages in your app's database.

Successful response example:

```json
{
  "data": {
    "id": 1,
    "name": "Category New #1"
  }
}
```

### DELETE `/category/<id>`

Deletes a category with ID.

Successful response example:

```json
{}
```
