import { CfnOutput } from "aws-cdk-lib";
import type { DockerImageFunction } from "aws-cdk-lib/aws-lambda";
import type { Construct } from "constructs";
import { Cors, LambdaRestApi } from "aws-cdk-lib/aws-apigateway";

/**
 * Create an AWS API Gateway.
 * @param scope Pass "this" in the constructor of InfraStack.
 * @param lambdaFunction The Lambda Function triggered by this API Gateway.
 * @returns The created AWS API Gateway.
 */
export default function CreateAPIGateway(
  scope: Construct,
  lambdaFunction: DockerImageFunction,
): LambdaRestApi {
  const api = new LambdaRestApi(scope, "ReonicApiGateway", {
    handler: lambdaFunction,
    defaultCorsPreflightOptions: {
      allowOrigins: Cors.ALL_ORIGINS,
      allowMethods: Cors.ALL_METHODS,
    },
  });

  // Output the API Gateway's URL.
  new CfnOutput(scope, "ApiGatewayURL", {
    value: api.url,
    description: "The API Gateway's URL. Click it for end-to-end test!",
  });

  return api;
}
