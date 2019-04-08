# Serverless Lambda API Boilerplate

## Setup

Install all packages
To use Babel, Linter & Serverless CLI tools install them globally
Run `docker-compose up -d` to start the MongoDB container
Run `npm start` to run the Serverless functions in an offline environment

## Controllers

Controllers are a class that contain the handler functions for AWS Lambda to execute

## Middleware

Reusable functions to process incoming requests, these will execute in the order supplied and returned the mutated event and context to the controller function invoked by the request

## Models

Models of database entities or structs

## Services

Services are a class of functions that wrap the standard utility of different ORMs and provide additional utilities

## Helpers

Individual reusable functionalities that don't strictly belong to a service

## To Do Tasks

- Add babel-watch or something so that each file changed is auto rebuilt so I can nodemon sls offline
- Need to implement a more rigorous error handling capability
- Clean up all the code generally
