const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'API Documentation',
    description: 'API Documentation for your AtharvaBoss',
  },
  host: 'localhost:4000'
};

const outputFile = './swagger-output.json';
const routes = ['./src/routes/user.router.ts', './src/routes/product.router.ts', './src/routes/customizations.router.ts', './src/routes/order.router.ts'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);