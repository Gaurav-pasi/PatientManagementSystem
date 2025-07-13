# Patient Management System API Documentation

This project uses Swagger/OpenAPI 3.0 to provide comprehensive API documentation.

## Accessing the Documentation

Once the server is running, you can access the Swagger UI at:

```
http://localhost:3000/api-docs
```

## Features

The Swagger documentation includes:

### API Endpoints
- **Patients**: Create, read, and update patient information
- **Doctors**: Manage doctor profiles and information
- **Appointments**: Schedule and manage appointments
- **Doctor Availability**: Set and retrieve doctor availability schedules
- **Payments**: Process payments and handle webhooks
- **Files**: Upload and retrieve user documents
- **Users**: Upload user documents

### Interactive Features
- **Try it out**: Test API endpoints directly from the documentation
- **Request/Response Examples**: See example data structures
- **Authentication**: Bearer token authentication support
- **Schema Validation**: Automatic validation of request/response schemas

## API Structure

### Base URL
```
http://localhost:3000
```

### Authentication
The API uses Bearer token authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-token>
```

### Common Response Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `404`: Not Found
- `500`: Internal Server Error

## Data Models

The documentation includes comprehensive schemas for:

- **User**: Basic user information
- **Patient**: Patient-specific data with medical history
- **Doctor**: Doctor profiles with specializations
- **Appointment**: Appointment scheduling and management
- **DoctorAvailability**: Weekly availability schedules
- **Payment**: Payment processing and tracking
- **File**: File upload and management

## Getting Started

1. Start the server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:3000/api-docs`

3. Explore the API endpoints by:
   - Browsing the available endpoints by category
   - Clicking on an endpoint to see details
   - Using the "Try it out" button to test endpoints
   - Reviewing request/response schemas

## Development

### Adding New Endpoints

To add documentation for new endpoints:

1. Add JSDoc comments above your route definitions
2. Use the `@swagger` annotation
3. Follow the OpenAPI 3.0 specification

Example:
```javascript
/**
 * @swagger
 * /your-endpoint:
 *   get:
 *     summary: Your endpoint description
 *     tags: [Your Tag]
 *     responses:
 *       200:
 *         description: Success response
 */
```

### Updating Schemas

To update data models:

1. Edit the schemas in `src/swagger.ts`
2. Update the corresponding JSDoc comments in route files
3. Restart the server to see changes

## Dependencies

- `swagger-jsdoc`: Generates OpenAPI specification from JSDoc comments
- `swagger-ui-express`: Serves the Swagger UI interface
- `@types/swagger-jsdoc`: TypeScript definitions
- `@types/swagger-ui-express`: TypeScript definitions

## Customization

You can customize the Swagger UI by modifying the options in `src/index.ts`:

```javascript
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Patient Management System API Documentation'
}));
```

## Troubleshooting

If the documentation doesn't load:

1. Check that all dependencies are installed
2. Verify the server is running on the correct port
3. Check the browser console for any JavaScript errors
4. Ensure the `src/swagger.ts` file is properly configured

## Additional Resources

- [OpenAPI 3.0 Specification](https://swagger.io/specification/)
- [Swagger JSDoc Documentation](https://github.com/Surnet/swagger-jsdoc)
- [Swagger UI Express Documentation](https://github.com/scottie1984/swagger-ui-express) 