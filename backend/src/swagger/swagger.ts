import { Options as SwaggerJSDocOptions } from 'swagger-jsdoc';

const swaggerOptions: SwaggerJSDocOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      description: 'API Documentation for your AtharvaBoss',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        Customer: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            mobileNumber: { type: 'integer' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            Order: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Order',
              },
            },
          },
          required: ['name', 'mobileNumber'],
        },
        CustomerResponse: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            mobileNumber: { type: 'integer' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            Order: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Order',
              },
            },
          },
        },
        Product: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            Customizations: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Customizations',
              },
            },
            Item: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Item',
              },
            },
          },
          required: ['name'],
        },
        ProductResponse: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            Customizations: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Customizations',
              },
            },
          },
        },
        Customizations: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number', format: 'float' },
            productId: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            product: {
              $ref: '#/components/schemas/Product',
            },
          },
          required: ['description', 'price', 'productId'],
        },
        CustomizationsResponse: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number', format: 'float' },
            productId: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Order: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            orderTime: {
              type: 'string',
              enum: ['MORNING', 'AFTERNOON', 'EVENING', 'NIGHT']
            },
            orderDate: { type: 'string', format: 'date-time' },
            customerId: { type: 'string' },
            orderAmount: { type: 'number', format: 'float' },
            orderStatus: {
              type: 'string',
              enum: ['PAID', 'UNPAID']
            },
            totalItems: { type: 'integer' },
            createdAt: { type: 'string', format: 'date-time' },
            customer: {
              $ref: '#/components/schemas/Customer',
            },
            Item: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Item',
              },
            },
          },
          required: ['orderTime', 'customerId', 'orderAmount', 'orderStatus', 'totalItems'],
        },
        OrderResponse: {
          type: 'object',
          properties: {
            orders: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Order',
              },
            },
            totalAmount: { type: 'number', format: 'float' },
            unpaidAmount: { type: 'number', format: 'float' },
            paidAmount: { type: 'number', format: 'float' },
          },
        },
        Item: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            productId: { type: 'string' },
            quantity: { type: 'integer' },
            customizationId: { type: 'string' },
            orderId: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            product: {
              $ref: '#/components/schemas/Product',
            },
            order: {
              $ref: '#/components/schemas/Order',
            },
          },
          required: ['productId', 'quantity', 'orderId'],
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    paths: {
      // Customer Routes
      '/api/customer/': {
        post: {
          tags: ['Customer'],
          security: [
            {
              bearerAuth: [],
            },
          ],
          summary: 'Create new customer',
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Customer',
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Customer created successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/CustomerResponse',
                  },
                },
              },
            },
            '400': {
              description: 'Failed to create customer',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
        get: {
          tags: ['Customer'],
          security: [
            {
              bearerAuth: [],
            },
          ],
          summary: 'Get all customers',
          responses: {
            '200': {
              description: 'List of all customers',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/CustomerResponse',
                    },
                  },
                },
              },
            },
            '400': {
              description: 'Failed to get customers',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },

      // Product Routes
      '/api/product/': {
        post: {
          tags: ['Product'],
          security: [
            {
              bearerAuth: [],
            },
          ],
          summary: 'Add new product',
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Product',
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Product added successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ProductResponse',
                  },
                },
              },
            },
            '400': {
              description: 'Failed to add product',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },

        get: {
          tags: ['Product'],
          security: [
            {
              bearerAuth: [],
            },
          ],
          summary: 'Get all products',
          responses: {
            '200': {
              description: 'List of all products',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/ProductResponse',
                    },
                  },
                },
              },
            },
            '400': {
              description: 'Failed to get products',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/api/product/{id}': {
        get: {
          tags: ['Product'],
          security: [
            {
              bearerAuth: [],
            },
          ],
          summary: 'Get product by ID',
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: {
                type: 'string',
              },
              description: 'Product ID',
            },
          ],
          responses: {
            '200': {
              description: 'Product retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ProductResponse',
                  },
                },
              },
            },
            '400': {
              description: 'Failed to get product',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '404': {
              description: 'Product not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
        delete: {
          tags: ['Product'],
          security: [
            {
              bearerAuth: [],
            },
          ],
          summary: 'Delete product by ID',
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: {
                type: 'string',
              },
              description: 'Product ID',
            },
          ],
          responses: {
            '200': {
              description: 'Product deleted successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ProductResponse',
                  },
                },
              },
            },
            '400': {
              description: 'Failed to delete product',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '404': {
              description: 'Product not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },

      // Customizations Routes
      '/api/customizations/': {
        post: {
          tags: ['Customizations'],
          security: [
            {
              bearerAuth: [],
            },
          ],
          summary: 'Create new customization',
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Customizations',
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Customization created successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/CustomizationsResponse',
                  },
                },
              },
            },
            '400': {
              description: 'Failed to create customization',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/api/customizations/{id}': {
        delete: {
          tags: ['Customizations'],
          security: [
            {
              bearerAuth: [],
            },
          ],
          summary: 'Delete customization by ID',
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: {
                type: 'string',
              },
              description: 'Customization ID',
            },
          ],
          responses: {
            '200': {
              description: 'Customization deleted successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/CustomizationsResponse',
                  },
                },
              },
            },
            '400': {
              description: 'Failed to delete customization',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '404': {
              description: 'Customization not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },

      // Order Routes
      '/api/order/': {
        post: {
          tags: ['Order'],
          security: [
            {
              bearerAuth: [],
            },
          ],
          summary: 'Create new order',
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Order',
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Order created successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Order',
                  },
                },
              },
            },
            '400': {
              description: 'Failed to create order',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },

        get: {
          tags: ['Order'],
          security: [
            {
              bearerAuth: [],
            },
          ],
          summary: 'Get all orders for current month',
          responses: {
            '200': {
              description: 'List of orders with summary information',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/OrderResponse',
                  },
                },
              },
            },
            '400': {
              description: 'Failed to get orders',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/api/order/{customerId}': {
        get: {
          tags: ['Order'],
          security: [
            {
              bearerAuth: [],
            },
          ],
          summary: 'Get all orders for a specific customer for current month',
          parameters: [
            {
              in: 'path',
              name: 'customerId',
              required: true,
              schema: {
                type: 'string',
              },
              description: 'Customer ID',
            },
          ],
          responses: {
            '200': {
              description: 'List of customer orders with summary information',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/OrderResponse',
                  },
                },
              },
            },
            '400': {
              description: 'Failed to get customer orders',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '404': {
              description: 'Customer not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },

      // Health check
      '/api/health': {
        get: {
          tags: ['Health'],
          summary: 'Health check endpoint',
          responses: {
            '200': {
              description: 'API is running correctly',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: {
                        type: 'string',
                        example: 'OK',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'], // Path to files with JSDoc annotations
};

export default swaggerOptions;