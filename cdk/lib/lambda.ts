import { CfnOutput, Duration } from "aws-cdk-lib";
import { DockerImageCode, DockerImageFunction } from "aws-cdk-lib/aws-lambda";
import { IRepository, Repository } from "aws-cdk-lib/aws-ecr";
import { Construct } from "constructs";

// todo:
// - Bind IAM Roles.
// - Assign it to a subnet.

/**
 * Create an AWS Lambda Function.
 * @param scope Pass "this" in the constructor of InfraStack.
 * @returns The created AWS Lambda Function.
 */
export default function CreateLambda(scope: Construct): DockerImageFunction {
  // Reference the existing ECR repository managed by "CDKToolkit" stack.
  const ecrRepository: IRepository = Repository.fromRepositoryName(
    scope,
    "ContainerAssetsRepository",
    "cdk-hnb659fds-container-assets-174919262311-us-east-1",
  );

  // Create the Lambda function using the container image.
  const lambdaFunction = new DockerImageFunction(scope, "ReonicLambda", {
    code: DockerImageCode.fromEcr(ecrRepository), // the default tag is "latest"
    memorySize: 256, // in MB
    timeout: Duration.seconds(8),

    environment: {
      NODE_ENV: "production", // Options: "production", "staging", "development".
      DB_SECRET_NAME: "", // Used to get credentials from AWS Secrets Manager. // todo
    },
    // vpc: ... // todo
    // role: ... // todo
  });

  // Output the Lambda function's name.
  new CfnOutput(scope, "LambdaFunctionName", {
    value: lambdaFunction.functionName,
  });

  // Output the Lambda function's ARN.
  new CfnOutput(scope, "LambdaFunctionArn", {
    value: lambdaFunction.functionArn,
  });

  return lambdaFunction;
}
