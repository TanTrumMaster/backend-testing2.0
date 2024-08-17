import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import passport from '~/config/passport';
import routes from '~/routes/v1';
import error from '~/middlewares/error';
import rateLimiter from '~/middlewares/rateLimiter';
import config from '~/config/config';
import morgan from '~/config/morgan';
import fs from 'fs';
import path from 'path';


const app = express();

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Your API Documentation',
    version: '1.0.0',
    description: 'API documentation',
  },
  servers: [
    {
      url: 'http://localhost:8000',
    },
  ],
};

// Options for the swagger docs
const options = {
  swaggerDefinition,
  apis: [path.resolve(__dirname, './routes/v1/*.js')], // Adjust path if needed
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsdoc(options);
console.log(swaggerSpec); // Ensure this logs valid Swagger documentation

// Setup Swagger UI
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// Debugging path
// const testFilePath = path.resolve(__dirname, './routes/v1/test.js');
// console.log('Path to test.js:', testFilePath);
// console.log('File contents:', fs.readFileSync(testFilePath, 'utf-8'));

if (config.NODE_ENV !== 'test') {
  app.use(morgan);
}

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(cors());
app.use(rateLimiter);
app.use(passport.initialize());
app.use(express.static('public'));
app.use('/api/v1', routes);
app.use(error.converter);
app.use(error.notFound);
app.use(error.handler);

export default app;

// import express from 'express';
// import compression from 'compression';
// import helmet from 'helmet';
// import cors from 'cors';
// import passport from '~/config/passport';
// import routes from '~/routes/v1';
// import error from '~/middlewares/error';
// import rateLimiter from '~/middlewares/rateLimiter';
// import config from '~/config/config';
// import morgan from '~/config/morgan';
// // import swaggerDocs from './utils/swagger';
// const app = express();
// const swaggerDefinition = {
// 	openapi: '3.0.0',
// 	info: {
// 	  title: 'Your API Documentation',
// 	  version: '1.0.0',
// 	  description: 'API documentation',
// 	},
// 	servers: [
// 	  {
// 		url: 'http://localhost:8000',
// 	  },
// 	],
//   };

// const options = {
// 	swaggerDefinition,
// 	apis: ['./routes/*.js'], // Path to the API docs
// };
// const swaggerSpec = swaggerJsdoc(options);
// if (config.NODE_ENV !== 'test') {
// 	app.use(morgan);
// }
// app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// app.use(helmet());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(compression());
// app.use(cors());
// app.use(rateLimiter);
// app.use(passport.initialize());
// app.use(express.static('public'));
// app.use('/api/v1', routes);
// app.use(error.converter);
// app.use(error.notFound);
// app.use(error.handler);

// export default app;
