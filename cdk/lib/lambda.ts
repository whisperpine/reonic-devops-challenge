import { Duration, RemovalPolicy } from "aws-cdk-lib";
import {
  Alarm,
  ComparisonOperator,
  TreatMissingData,
} from "aws-cdk-lib/aws-cloudwatch";
import { type ISubnet, SecurityGroup, type Vpc } from "aws-cdk-lib/aws-ec2";
import { type IRepository, Repository } from "aws-cdk-lib/aws-ecr";
import { DockerImageCode, DockerImageFunction } from "aws-cdk-lib/aws-lambda";
import { LogGroup, RetentionDays } from "aws-cdk-lib/aws-logs";
import type { DatabaseInstance } from "aws-cdk-lib/aws-rds";
import type { Secret } from "aws-cdk-lib/aws-secretsmanager";
import type { Construct } from "constructs";

import { SUBNET_APP } from "./vpc";

/**
 * Create an AWS Lambda Function.
 * @param scope Pass "this" in the constructor of InfraStack.
 * @param vpc The AWS VPC that this Lambda Function will be attached to.
 * @param secret The secret created by Secrets Manager.
 * @returns The created AWS Lambda Function.
 */
export default function createLambda(
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
  const lambdaSg = new SecurityGroup(scope, "ReonicLambdaSG", {
    vpc,
    allowAllOutbound: true,
  });

  // Allow Lambda SG to connect to RDS SG on PostgreSQL default port.
  db.connections.allowDefaultPortFrom(lambdaSg);

  // Filter out the subnets dedicated for applications.
  const selectedSubnets: ISubnet[] = vpc.isolatedSubnets.filter(
    (subnet: ISubnet): boolean => subnet.node.path.includes(SUBNET_APP),
  );

  // Create the Lambda function using the container image.
  const lambdaFunction = new DockerImageFunction(scope, "ReonicLambda", {
    code: DockerImageCode.fromEcr(ecrRepository), // the default tag is "latest"
    memorySize: 256, // in MB
    timeout: Duration.seconds(8),
    environment: {
      // biome-ignore lint/style/useNamingConvention: SCREAMING_SNAKE_CASE must be used here.
      NODE_ENV: "production", // Options: "production", "staging", "development".
      // biome-ignore lint/style/useNamingConvention: SCREAMING_SNAKE_CASE must be used here.
      DB_SECRET_NAME: secret.secretArn, // Used to get credentials from AWS Secrets Manager.
    },
    vpc,
    vpcSubnets: { subnets: selectedSubnets },
    securityGroups: [lambdaSg],
    logGroup: createCloudwatchLogGroup(scope),
  });

  // Automatically attaches a policy "secretsmanager:GetSecretValue"
  // on this specific secret, granting the lambda function to read.
  secret.grantRead(lambdaFunction);

  createAlarms(scope, lambdaFunction);

  // // Output the Lambda Function's name.
  // new CfnOutput(scope, "LambdaFunctionName", {
  //   value: lambdaFunction.functionName,
  //   description: "The Lambda Function's Name.",
  // });
  //
  // // Output the Lambda Function's ARN.
  // new CfnOutput(scope, "LambdaFunctionArn", {
  //   value: lambdaFunction.functionArn,
  //   description: "The Lambda Function's ARN.",
  // });

  return lambdaFunction;
}

/**
 * Create an AWS Cloudwatch Log Group for API Gateway.
 * @returns The created AWS Cloudwatch Log Group.
 */
function createCloudwatchLogGroup(scope: Construct): LogGroup {
  return new LogGroup(scope, "ReonicLambdaLogGroup", {
    // logGroupName: "/aws/lambda/ReonicLambdaLogGroup",
    retention: RetentionDays.ONE_WEEK,
    removalPolicy: RemovalPolicy.DESTROY,
  });
}

/** Create Cloudwatch Alarms for the Lambda Function. */
function createAlarms(
  scope: Construct,
  lambdaFunction: DockerImageFunction,
): void {
  // Duration Alarm.
  new Alarm(scope, "LambdaHighDurationAlarm", {
    metric: lambdaFunction.metricDuration(),
    threshold: 1000, // in milliseconds
    evaluationPeriods: 2,
    treatMissingData: TreatMissingData.NOT_BREACHING,
  });
  // Error Rate Alarm.
  new Alarm(scope, "LambdaErrorRateAlarm", {
    metric: lambdaFunction.metricErrors(),
    threshold: 1,
    evaluationPeriods: 2,
    comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD,
    treatMissingData: TreatMissingData.NOT_BREACHING,
  });
  // Too Many Invocation Alarm.
  new Alarm(scope, "LambdaHighInvocationAlarm", {
    metric: lambdaFunction.metricInvocations(),
    threshold: 100, // 100 invocations per minute
    evaluationPeriods: 2,
    treatMissingData: TreatMissingData.NOT_BREACHING,
  });
}
