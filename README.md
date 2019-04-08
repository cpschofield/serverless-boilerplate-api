# Serverless Lambda API Boilerplate

### Setup

Install all packages
To use Babel, Linter & Serverless CLI tools install them globally
Run `docker-compose up -d` to start the MongoDB container
Run `npm start` to run the Serverless functions in an offline environment

### Controllers

Controllers are a class that contain the handler functions for AWS Lambda to execute

### Middleware

Reusable functions to process incoming requests, these will execute in the order supplied and returned the mutated event and context to the controller function invoked by the request

### Models

Models of database entities or structs

### Services

Services are a class of functions that wrap the standard utility of different ORMs and provide additional utilities

### Helpers

Individual reusable functionalities that don't strictly belong to a service

## Deployment

To deploy your code you will need to have the configured the AWS CLI with your account credentials.

To deploy all of your functions simply run `npm run deploy` which will lint, test and build your code before deploying to AWS.

To deploy a single function use the serverless CLI to run `sls deploy function --name functionName`

## To Do Tasks

- Need to implement a more rigorous error handling capability
- Clean up all the code generally
- Implement test cases
- Add default env variables in case they are undefined
- Current implementation of babel --watch is inelegant
