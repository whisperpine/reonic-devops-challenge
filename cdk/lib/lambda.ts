import { CfnOutput, Duration } from "aws-cdk-lib";
import { DockerImageCode, DockerImageFunction } from "aws-cdk-lib/aws-lambda";
import { IRepository, Repository } from "aws-cdk-lib/aws-ecr";
import { DatabaseInstance } from "aws-cdk-lib/aws-rds";
import { Secret } from "aws-cdk-lib/aws-secretsmanager";
import { Construct } from "constructs";
import { ISubnet, SecurityGroup, Vpc } from "aws-cdk-lib/aws-ec2";

import { SUBNET_APP } from "./vpc";

/**
 * Create an AWS Lambda Function.
 * @param scope Pass "this" in the constructor of InfraStack.
 * @param vpc The AWS VPC that this Lambda Function will be attached to.
 * @param secret The secret created by Secrets Manager.
 * @returns The created AWS Lambda Function.
 */
export default function CreateLambda(
  scope: Construct,
  vpc: Vpc,
  secret: Secret,
  db: DatabaseInstance,
): DockerImageFunction {
  // Reference the existing ECR repository managed by "CDKToolkit" stack.
  const ecrRepository: IRepository = Repository.fromRepositoryName(
    scope,
    "ContainerAssetsRepository",
    "cdk-hnb659fds-container-assets-174919262311-us-east-1",
  );

  // Security group for Lambda.
  const lambdaSG = new SecurityGroup(scope, "ReonicLambdaSG", {
    vpc,
    allowAllOutbound: true,
  });

  // Allow Lambda SG to connect to RDS SG on PostgreSQL default port.
  db.connections.allowDefaultPortFrom(lambdaSG);

  // Filter out the subnets dedicated for applications.
  const selectedSubnets: ISubnet[] = vpc.isolatedSubnets.filter((
    subnet: ISubnet,
  ): boolean => subnet.node.path.includes(SUBNET_APP));

  // Create the Lambda function using the container image.
  const lambdaFunction = new DockerImageFunction(scope, "ReonicLambda", {
    code: DockerImageCode.fromEcr(ecrRepository), // the default tag is "latest"
    memorySize: 256, // in MB
    timeout: Duration.seconds(8),
    environment: {
      NODE_ENV: "production", // Options: "production", "staging", "development".
      DB_SECRET_NAME: secret.secretArn, // Used to get credentials from AWS Secrets Manager.
    },
    vpc,
    vpcSubnets: { subnets: selectedSubnets },
    securityGroups: [lambdaSG],
  });

  // Automatically attaches a policy "secretsmanager:GetSecretValue"
  // on this specific secret, granting the lambda function to read.
  secret.grantRead(lambdaFunction);

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
