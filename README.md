# Order Processor

This is a TypeScript API server implementation of an order processor.

## Development

This code was developed on mac OSX.
The [src](./src/) directory contains the TypeScript source files.

### Prerequisites

Install the latest LTS version of Node. Feel free to remove the strict engine checks within [package.json](./package.json)

```
  "engines": {
    "npm": ">=9.5.1",
    "node": ">=18.16.0"
  },
  "engineStrict": true,
```

This project uses `yarn` as package manager.

```
npm install -g yarn
```

### Installation

```
yarn install
```

### Running the API server

```
yarn start
```

You can use curl or client of your choice to make a POST request to the API server. For example:

```
curl -X POST http://localhost:3000/place_order \
   -H "Content-Type: application/json" \
   -d '{"requestID": "123ABC", "symbol": "AAPL", "quantity": 100, "price": 135.50, "side": "buy"}'
```

### Testing

Run `jest` tests using

```
yarn test
```

Interactively

```
yarn test --watchAll
```
