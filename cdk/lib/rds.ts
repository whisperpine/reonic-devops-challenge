import { RemovalPolicy } from "aws-cdk-lib";
import {
  InstanceClass,
  InstanceSize,
  InstanceType,
  type ISubnet,
  type Vpc,
} from "aws-cdk-lib/aws-ec2";
import { RetentionDays } from "aws-cdk-lib/aws-logs";
import {
  Credentials,
  DatabaseInstance,
  DatabaseInstanceEngine,
  PostgresEngineVersion,
} from "aws-cdk-lib/aws-rds";
import type { Secret } from "aws-cdk-lib/aws-secretsmanager";
import type { Construct } from "constructs";
import { ENVIRONMENT_PROD } from "./tags";
import { SUBNET_DB } from "./vpc";

// todo:
// multi-region, standby instance for failover

/**
 * Create an AWS RDS Postgres instance.
 * @param scope Pass "this" in the constructor of InfraStack.
 * @param vpc The AWS VPC that this Lambda Function will be attached to.
 * @param secret The secret created by Secrets Manager.
 * @param env The value of the tag "environment".
 * @returns The created AWS RDS Postgres instance.
 */
export default function createRds(
  scope: Construct,
  vpc: Vpc,
  secret: Secret,
  env: string,
): DatabaseInstance {
  // Filter out the subnets dedicated for RDS instances.
  const selectedSubnets: ISubnet[] = vpc.isolatedSubnets.filter(
    (subnet: ISubnet): boolean => subnet.node.path.includes(SUBNET_DB),
  );

  // RDS Postgres instance.
  const db = new DatabaseInstance(scope, "ReonicPostgres", {
    engine: DatabaseInstanceEngine.postgres({
      version: PostgresEngineVersion.VER_17,
    }),
    vpc,
    vpcSubnets: { subnets: selectedSubnets },
    allocatedStorage: 20, // in GB
    publiclyAccessible: false,
    // Certain fields will be added to the secret (e.g. host, port, engine).
    credentials: Credentials.fromSecret(secret),
    databaseName: DB_NAME,
    multiAz: false, // todo
    instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.MICRO),
    cloudwatchLogsExports: ["postgresql", "upgrade", "iam-db-auth-error"], // enable log exports
    cloudwatchLogsRetention: RetentionDays.ONE_MONTH,
  });

  if (env === ENVIRONMENT_PROD) {
    db.applyRemovalPolicy(RemovalPolicy.SNAPSHOT);
  }

  return db;
}

/** The name of the database of Postgres instance. */
export const DB_NAME = "postgres";

/** The name of the user of Postgres instance. */
export const DB_USERNAME = "postgres";
