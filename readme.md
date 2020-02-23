# Pizza api

## Create user

`POST {API_URL}/users`

##### headers

```
{
    'Content-Type': 'application/json'
}
```

##### request body

```
{
    email: string, // required
    password: string, // required. (min length is 6)
    address: string, // required
    name: string, // required
}
```

##### succeeded response

`204 No Content`

## Get user

`GET {API_URL}/users`

##### headers

```
{
    'Content-Type': 'application/json',
    token: string // required
}
```

##### query params

```
{
    email: string // required
}
```

##### succeeded response

```
200 OK
{
    name: string,
    email: string,
    address: string,
}
```

## Update user

`PUT {API_URL}/users`

##### headers

```
{
    'Content-Type': 'application/json',
    token: string // required
}
```

##### query params

```
{
    email: string // required
}
```

##### request body

```
{
    address: string,
    name: string,
}
```

##### succeeded response

`204 No Content`

## Delete user

`DELETE {API_URL}/users`

##### headers

```
{
    'Content-Type': 'application/json',
    token: string // required
}
```

##### query params

```
{
    email: string // required
}
```

##### succeeded response

`204 No Content`

## Login

`POST {API_URL}/login`

##### headers

```
{
    'Content-Type': 'application/json'
}
```

##### request body

```
{
    email: string, // required
    password: string, // required. (min length is 6)
}
```

##### succeeded response

```
200 OK
{
    token: string,
}
```

## Logout

`POST {API_URL}/logout`

##### headers

```
{
    'Content-Type': 'application/json',
    token: string // required
}
```

##### succeeded response

`204 No Content`

## Get menu

`GET {API_URL}/menu`

##### headers

```
{
    'Content-Type': 'application/json',
    token: string // required
}
```

##### succeeded response

```
200 OK

[
    {
        id: number,
        name: string,
        price: number,
        size: number,
    },
    ...
]
```

## Add pizza to cart

`POST {API_URL}/cart`

##### headers

```
{
    'Content-Type': 'application/json',
    token: string // required
}
```

##### request body

```
{
    itemId: number, // required. Id of pizza
    count: number, // required. How many this kind of pizza add to cart
}
```

##### succeeded response

`204 No Content`

## Get cart data

`GET {API_URL}/cart`

##### headers

```
{
    'Content-Type': 'application/json',
    token: string // required
}
```

##### succeeded response

```
200 OK

[
    {
        itemId: number,
        count: number
    },
    ...
]
```

## Update cart item

`PUT {API_URL}/cart`

##### headers

```
{
    'Content-Type': 'application/json',
    token: string // required
}
```

##### query params

```
{
    itemId: number
}
```

##### request body

```
{
    count: number
}
```

##### succeeded response

`204 No Content`

## Delete cart item

`DELETE {API_URL}/cart`

##### headers

```
{
    'Content-Type': 'application/json',
    token: string // required
}
```

##### query params

```
{
    itemId: number
}
```

##### succeeded response

`204 No Content`

## Create order (payment)

`POST {API_URL}/orders`

##### headers

```
{
    'Content-Type': 'application/json',
    token: string // required
}
```

##### request body

```
{
    cardNumber: string, // required
    expirationMonth: number, // required (1-12)
    expirationYear: number // required. More than current year
    cvs: number // required (100-999)
}
```

##### succeeded response

```
200 OK

{
    message: string
}
```

## Get profile data

`GET {API_URL}/profile`

##### headers

```
{
    'Content-Type': 'application/json',
    token: string // required
}
```

##### succeeded response

```
200 OK

{
    name: string,
    email: string,
    address: string,
}
```

## Extra info

Do not delete **pizza data** in /.data/menu/pizzaList.json
