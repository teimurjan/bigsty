
- [Postman published API](https://documenter.getpostman.com/view/1604017/RznBLzAk)

- <b>All requests require header `Content-Type: applicaiton/json` if it is JSON or `Content-Type: multipart/form-data`</b>

- <b>All GET requests can have language header `Accept-Language: de-DE`. The intl fields of the requested resource will be returned in the provided language. If it's not provided `en-US` is used by default. The header's value should be language code of an existing language in your app's database.</b>
- <b>All DELETE, PUT and POST requests require a user to be an admin or a manager.</b>

## Category

Category of a product. Example: `Cellphones`.

|        | `api_category` |          |
| ------ | -------------- | -------- |
| Column | Type           | Nullable |
| id     | integer        | not null |


|             | `api_category_name`   |          |
| ----------- | --------------------- | -------- |
| Column      | Type                  | Nullable |
| id          | integer               | not null |
| value       | character varying(50) | not null |
| category_id | integer               | not null |
| language_id | integer               | not null |

### GET `/categories`

Returns all categories.

<b>200</b> HTTP status code

```json
{
    "data": [
        {
            "id": 1,
            "name": "Smartphone",
            "feature_types": [
                1,
                2
            ]
        },
        {
            "id": 2,
            "name": "Tablet",
            "feature_types": [
                1,
                2
            ]
        }
    ]
}
```

### POST `/categories`

Creates a category.

Request payload example:

```json
{
	"names":{
		"1": "Tablet"
	},
	"feature_types": [1,2]
}
```

Where `names` is a map where keys are IDs of all available languages in your app's database and values are just string values for the language.

<b>200</b> HTTP status code

```json
{
    "data": {
        "id": 2,
        "name": "Tablet",
        "feature_types": [
            {
                "id": 1,
                "name": "Color"
            },
            {
                "id": 2,
                "name": "ROM Memory"
            }
        ]
    }
}
```

### GET `/category/<id>`

Returns a category by ID.

<b>200</b> HTTP status code

```json
{
    "data": {
        "id": 1,
        "name": "Phone",
        "feature_types": [
            {
                "id": 1,
                "name": "Color"
            },
            {
                "id": 2,
                "name": "ROM Memory"
            }
        ]
    }
}
```

### PUT `/category/<id>`

Updates a category by ID.

Request payload example:

```json
{
	"names":{
		"1": "Smartphone"
	},
	"feature_types": [1,2]
}
```

Where `names` is a map where keys are IDs of all available languages in your app's database and values are just string values for the language.

Responses:

<b>200</b> HTTP status code

```json
{
    "data": {
        "id": 1,
        "name": "Smartphone",
        "feature_types": [
            {
                "id": 1,
                "name": "Color"
            },
            {
                "id": 2,
                "name": "ROM Memory"
            }
        ]
    }
}
```


### DELETE `/category/<id>`

Deletes a category with ID.

<b>200</b> HTTP status code

```json
{}
```

## Feature type

Any feature. Examples: `Color`, `Size`, `Memory`.

|        | `api_feature_type` |          |
| ------ | ------------------ | -------- |
| Column | Type               | Nullable |
| id     | integer            | not null |


|                 | `api_feature_type_name` |          |
| --------------- | ----------------------- | -------- |
| Column          | Type                    | Nullable |
| id              | integer                 | not null |
| value           | character varying(50)   | not null |
| feature_type_id | integer                 | not null |
| language_id     | integer                 | not null |


|                | `api_feature_type_x_category` |          |
| -------------- | ----------------------------- | -------- |
| Column         | Type                          | Nullable |
| id             | integer                       | not null |
| featuretype_id | integer                       | not null |
| category_id    | integer                       | not null |


### GET `/feature_types?page=2&limit=1`

If `page` parameter is given will return the specific page. Otherwise returns all feature types.

<b>200</b> HTTP status code

```json
{
    "data": [
        {
            "id": 1,
            "name": "Color"
        }
    ],
    "meta": {
        "count": 2,
        "pages_count": 2,
        "page": 1,
        "limit": 1
    }
}
```

### POST `/feature_types`

Creates a feature type.

Request payload example:

```json
{
	"names": {
		"1": "Memory"
	}
}
```

Where `names` is a map where keys are IDs of all available languages in your app's database and values are just string values for the language.

<b>200</b> HTTP status code

```json
{
    "data": {
        "id": 2,
        "name": "Memory"
    }
}
```

### GET `/feature_types/<id>`

Returns a feature type by ID.

<b>200</b> HTTP status code

```json
{
    "data": {
        "id": 1,
        "name": "Color"
    }
}
```

### PUT `/feature_types/<id>`

Updates a feature type by ID.

Request payload example:

```json
{
	"names":{
		"1": "ROM Memory"
	}
}
```

Where `names` is a map where keys are IDs of all available languages in your app's database and values are just string values for the language.

Responses:

<b>200</b> HTTP status code

```json
{
    "data": {
        "id": 2,
        "name": "ROM Memory"
    }
}
```


### DELETE `/feature_types/<id>`

Deletes a feature type with ID.

<b>200</b> HTTP status code

```json
{}
```


## Feature value

Any value for a feature. Examples: `Black`, `Large`, `64GB`.

|                 | `api_feature_value` |          |
| --------------- | ------------------- | -------- |
| Column          | Type                | Nullable |
| id              | integer             | not null |
| feature_type_id | integer             | not null |


|                  | `api_feature_value_name` |          |
| ---------------- | ------------------------ | -------- |
| Column           | Type                     | Nullable |
| id               | integer                  | not null |
| value            | character varying(50)    | not null |
| feature_value_id | integer                  | not null |
| language_id      | integer                  | not null |



|                 | `api_feature_value_x_product_type` |          |
| --------------- | ---------------------------------- | -------- |
| Column          | Type                               | Nullable |
| featurevalue_id | integer                            | not null |
| producttype_id  | integer                            | not null |


|                 | `api_feature_value_x_product` |          |
| --------------- | ----------------------------- | -------- |
| Column          | Type                          | Nullable |
| featurevalue_id | integer                       | not null |
| product_id      | integer                       | not null |


### GET `/feature_values?page=2&limit=1`

If `page` parameter is given will return the specific page. Otherwise returns all feature values.

<b>200</b> HTTP status code

```json
{
    "data": [
        {
            "id": 1,
            "name": "Black",
            "feature_type": 1
        },
        {
            "id": 2,
            "name": "White",
            "feature_type": 1
        }
    ],
    "meta": {
        "count": 5,
        "pages_count": 3,
        "page": 1,
        "limit": 2
    }
}
```

### POST `/feature_values`

Creates a feature value.

Request payload example:

```json
{
	"names": {
		"1": "128GB"
	},
	"feature_type_id": 2
}
```

Where `names` is a map where keys are IDs of all available languages in your app's database and values are just string values for the language.

<b>200</b> HTTP status code

```json
{
    "data": {
        "id": 5,
        "name": "128GB",
        "feature_type": {
            "id": 2,
            "name": "ROM Memory"
        }
    }
}
```

### GET `/feature_values/<id>`

Returns a feature value by ID.

<b>200</b> HTTP status code

```json
{
    "data": {
        "id": 2,
        "name": "White",
        "feature_type": {
            "id": 1,
            "name": "Color"
        }
    }
}
```

### PUT `/feature_types/<id>`

Updates a feature type by ID.

Request payload example:

```json
{
	"names": {
		"1": "Bright Red"
	},
	"feature_type_id": 1
}
```

Where `names` is a map where keys are IDs of all available languages in your app's database and values are just string values for the language.

Responses:

<b>200</b> HTTP status code

```json
{
    "data": {
        "id": 3,
        "name": "Bright Red",
        "feature_type": {
            "id": 1,
            "name": "Color"
        }
    }
}
```


### DELETE `/feature_values/<id>`

Deletes a feature value with ID.

<b>200</b> HTTP status code

```json
{}
```

## Feature value

Any value for a feature. Examples: `Black`, `Large`, `64GB`.

|                 | `api_feature_value` |          |
| --------------- | ------------------- | -------- |
| Column          | Type                | Nullable |
| id              | integer             | not null |
| feature_type_id | integer             | not null |


|                  | `api_feature_value_name` |          |
| ---------------- | ------------------------ | -------- |
| Column           | Type                     | Nullable |
| id               | integer                  | not null |
| value            | character varying(50)    | not null |
| feature_value_id | integer                  | not null |
| language_id      | integer                  | not null |



|                 | `api_feature_value_x_product_type` |          |
| --------------- | ---------------------------------- | -------- |
| Column          | Type                               | Nullable |
| featurevalue_id | integer                            | not null |
| producttype_id  | integer                            | not null |


|                 | `api_feature_value_x_product` |          |
| --------------- | ----------------------------- | -------- |
| Column          | Type                          | Nullable |
| featurevalue_id | integer                       | not null |
| product_id      | integer                       | not null |


### GET `/feature_values?page=2&limit=1`

If `page` parameter is given will return the specific page. Otherwise returns all feature values.

<b>200</b> HTTP status code

```json
{
    "data": [
        {
            "id": 1,
            "name": "Black"
        }
    ],
    "meta": {
        "count": 2,
        "pages_count": 2,
        "page": 1,
        "limit": 1
    }
}
```

### POST `/feature_values`

Creates a feature value.

Request payload example:

```json
{
	"names": {
		"1": "64GB"
	}
}
```

Where `names` is a map where keys are IDs of all available languages in your app's database and values are just string values for the language.

<b>200</b> HTTP status code

```json
{
    "data": {
        "id": 2,
        "name": "64GB"
    }
}
```

### GET `/feature_values/<id>`

Returns a feature value by ID.

<b>200</b> HTTP status code

```json
{
    "data": {
        "id": 1,
        "name": "Black"
    }
}
```

### PUT `/feature_types/<id>`

Updates a feature type by ID.

Request payload example:

```json
{
	"names":{
		"1": "128GB"
	}
}
```

Where `names` is a map where keys are IDs of all available languages in your app's database and values are just string values for the language.

Responses:

<b>200</b> HTTP status code

```json
{
    "data": {
        "id": 2,
        "name": "128GB"
    }
}
```


### DELETE `/feature_values/<id>`

Deletes a feature value with ID.

<b>200</b> HTTP status code

```json
{}
```


## Product type

Any product type. Examples: `iPhone 7`, `Apple Watch 3`.

|             | `api_product_type`     |          |
| ----------- | ---------------------- | -------- |
| Column      | Type                   | Nullable |
| id          | integer                | not null |
| image       | character varying(100) | not null |
| category_id | integer                | not null |


|                 | `api_product_type_name` or <br/>`api_product_type_description` or<br/>`api_product_type_short_description` |          |
| --------------- | ---------------------------------------------------------------------------------------------------------- | -------- |
| Column          | Type                                                                                                       | Nullable |
| id              | integer                                                                                                    | not null |
| value           | character varying(50)                                                                                      | not null |
| feature_type_id | integer                                                                                                    | not null |
| language_id     | integer                                                                                                    | not null |


### GET `/product_types?page=2&limit=1`

If `page` parameter is given will return the specific page. Otherwise returns all product types.

<b>200</b> HTTP status code

```json
{
    "data": [
        {
            "id": 1,
            "name": "iPhone 7",
            "description": "iPhone 7 Description",
            "short_description": "iPhone 7 Short Description",
            "image": "/media/product_types/iphone7_Rzk735G.jpeg",
            "category": 1,
            "feature_values": [
                1,
                2,
                4,
                5
            ]
        }
    ],
    "meta": {
        "count": 1,
        "pages_count": 1,
        "page": 1,
        "limit": 20
    }
}
```

### POST `/product_types`

Creates a product type.

Request should contain multipart form data with the `json` field which contains all needed data except the image. Also the form data should contain `image` field with the product type image. `json` field example:
```json
{
   "names":{
      "1":"iPhone 7"
   },
   "descriptions":{
      "1":"iPhone 7 Description"
   },
   "short_descriptions":{
      "1":"iPhone 7 Short Description"
   },
   "feature_values":[
      1,
      4
   ],
   "category_id":1
}
```

Where `names`, `descriptions` and `short_descriptions` are the maps where keys are IDs of all available languages in your app's database and values are just string values for the language.

<b>200</b> HTTP status code

```json
{
    "data": {
        "id": 2,
        "name": "iPhone 7",
        "description": "iPhone 7 Description",
        "short_description": "iPhone 7 Short Description",
        "image": "/media/product_types/iphone7.jpeg",
        "category": 1,
        "feature_values": [
            {
                "id": 1,
                "name": "Black",
                "feature_type": 1
            },
            {
                "id": 4,
                "name": "64GB",
                "feature_type": 2
            }
        ]
    }
}
```

### GET `/product_types/<id>`

Returns a product type by ID.

<b>200</b> HTTP status code

```json
{
    "data": {
        "id": 1,
        "name": "iPhone 7",
        "description": "iPhone 7 Description",
        "short_description": "iPhone 7 Short Description",
        "image": "/media/product_types/iphone7_Rzk735G.jpeg",
        "category": 1,
        "feature_values": [
            {
                "id": 1,
                "name": "Black",
                "feature_type": 1
            },
            {
                "id": 2,
                "name": "White",
                "feature_type": 1
            },
            {
                "id": 4,
                "name": "64GB",
                "feature_type": 2
            },
            {
                "id": 5,
                "name": "128GB",
                "feature_type": 2
            }
        ]
    }
}
```

### PUT `/product_types/<id>`

Updates a product type by ID.

Request should contain multipart form data with the `json` field which contains all needed data except the image. Also the form data should contain `image` field with the product type image. `json` field example:
```json
{
   "names":{
      "1":"iPhone 7"
   },
   "descriptions":{
      "1":"iPhone 7 Description"
   },
   "short_descriptions":{
      "1":"iPhone 7 Short Description"
   },
   "feature_values":[
      1,
      4
   ],
   "category_id":1
}
```

Where `names`, `descriptions` and `short_descriptions` are the maps where keys are IDs of all available languages in your app's database and values are just string values for the language.

<b>200</b> HTTP status code

```json
{
    "data": {
        "id": 2,
        "name": "iPhone 7",
        "description": "iPhone 7 Description",
        "short_description": "iPhone 7 Short Description",
        "image": "/media/product_types/iphone7.jpeg",
        "category": 1,
        "feature_values": [
            {
                "id": 1,
                "name": "Black",
                "feature_type": 1
            },
            {
                "id": 4,
                "name": "64GB",
                "feature_type": 2
            }
        ]
    }
}
```


### DELETE `/product_types/<id>`

Deletes a product type with ID.

<b>200</b> HTTP status code

```json
{}
```

## Product

Any product. Examples: `iPhone 7 Black 64GB`, `Apple Watch 3 38mm Silver`.

|                 | `api_product` |          |
| --------------- | ------------- | -------- |
| Column          | Type          | Nullable |
| id              | integer       | not null |
| discount        | integer       | not null |
| price           | integer       | not null |
| quantity        | integer       | not null |
| product_type_id | integer       | not null |


### GET `/products?page=2&limit=1`

If `page` parameter is given will return the specific page. Otherwise returns all products.

<b>200</b> HTTP status code

```json
{
    "data": [
        {
            "id": 3,
            "discount": 10,
            "price": 1,
            "quantity": 1,
            "product_type": 1,
            "images": [
                "/media/products/iphone7-black_6OLft3Q.jpg",
                "/media/products/iphone7-black-select-2016_x8JSLjr.jpeg"
            ],
            "feature_values": [
                1,
                5
            ]
        }
    ],
    "meta": {
        "count": 1,
        "pages_count": 1,
        "page": 1,
        "limit": 20
    }
}
```

### POST `/products`

Creates a product.

Request should contain multipart form data with the `json` field which contains all needed data except the images. Also the form data should contain `images` fields with the product images. `json` field example:
```json
{
   "product_type_id":1,
   "price":1,
   "discount":1,
   "quantity":1,
   "feature_values":[
      1,
      4
   ]
}
```

<b>200</b> HTTP status code

```json
{
    "data": {
        "id": 3,
        "discount": 1,
        "price": 1,
        "quantity": 1,
        "product_type": 1,
        "images": [
            "/media/products/iphone7-black-select-2016.jpeg"
        ],
        "feature_values": [
            1,
            4
        ]
    }
}
```

### GET `/products/<id>`

Returns a product by ID.

<b>200</b> HTTP status code

```json
{
    "data": {
        "id": 3,
        "discount": 1,
        "price": 1,
        "quantity": 1,
        "product_type": 1,
        "images": [
            "/media/products/iphone7-black-select-2016.jpeg"
        ],
        "feature_values": [
            1,
            4
        ]
    }
}
```

### PUT `/products/<id>`

Updates a product by ID.

Request should contain multipart form data with the `json` field which contains all needed data except the images. Also the form data should contain `images` fields with the product images. `json` field example:
```json
{
   "product_type_id":1,
   "price":1,
   "discount":1,
   "quantity":1,
   "feature_values":[
      1,
      4
   ]
}
```

<b>200</b> HTTP status code

```json
{
    "data": {
        "id": 3,
        "discount": 1,
        "price": 1,
        "quantity": 1,
        "product_type": 1,
        "images": [
            "/media/products/iphone7-black-select-2016.jpeg"
        ],
        "feature_values": [
            1,
            4
        ]
    }
}
```


### DELETE `/products/<id>`

Deletes a product with ID.

<b>200</b> HTTP status code

```json
{}
```
