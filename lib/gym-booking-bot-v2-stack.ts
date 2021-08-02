import * as cdk from '@aws-cdk/core';
import * as lambda from "@aws-cdk/aws-lambda";
import * as apigateway from "@aws-cdk/aws-apigateway";
import {Rule, Schedule} from "@aws-cdk/aws-events";
import {LambdaFunction} from "@aws-cdk/aws-events-targets";
require('dotenv').config();

export class GymBookingBotV2Stack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Lambdas
    const gymTestHandler = new lambda.Function(this, "GymTestHandler", {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset("src"),
      handler: "gymbooker.test",
      environment: {
        TEST_VAR: 'TESTING'
      }
    });

    const mostRecentSlotAndDayHandler = new lambda.Function(this, "MostRecentSlotAndDay", {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset("src"),
      handler: "gymbooker.mostRecentSlotAndDay",
      memorySize: 1024,
      timeout: cdk.Duration.seconds(600),
      environment: {
        EMAIL: `${process.env.EMAIL}`,
        PASSWORD: `${process.env.PASSWORD}`,
      }
    });

    const mostRecentSlotAndDayRachelHandler = new lambda.Function(this, "MostRecentSlotAndDayRachel", {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset("src"),
      handler: "gymbooker.mostRecentSlotAndDay",
      memorySize: 1024,
      timeout: cdk.Duration.seconds(600),
      environment: {
        EMAIL: `${process.env.WIFE_EMAIL}`,
        PASSWORD: `${process.env.WIFE_PASSWORD}`,
      }
    });

    // APIGateway
    const api = new apigateway.RestApi(this, "gymbooking-api", {
      restApiName: "Gym Booking Bot Service",
      description: "This service is used by the Gym Booking Bot for manual runs and testing"
    });

    const getGymBookingIntegration = new apigateway.LambdaIntegration(gymTestHandler, {
      requestTemplates: { "application/json": '{ "statusCode": "200" }' }
    });

    const getMostRecentSlotAndDayHandler = new apigateway.LambdaIntegration(mostRecentSlotAndDayHandler, {
      requestTemplates: { "application/json": '{ "statusCode": "200" }' }
    });

    const testApi = api.root.addResource('test');


    testApi.addMethod("GET", getGymBookingIntegration);
    api.root.addMethod("GET", getMostRecentSlotAndDayHandler);


    // EventBridge
    new Rule(this, 'Gym Session', {
    description: 'Books Gym for MON WED FRI',
    schedule: Schedule.cron({minute: '1', hour: '22', weekDay: 'TUE,FRI,SUN'}),
    targets: [
      new LambdaFunction(mostRecentSlotAndDayHandler),
      new LambdaFunction(mostRecentSlotAndDayRachelHandler)
    ],
   });
  }
}
