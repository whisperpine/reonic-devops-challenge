import { Construct } from "constructs";
import { Secret } from "aws-cdk-lib/aws-secretsmanager";
import { DB_NAME, DB_USERNAME } from "./rds";

/**
 * Create an AWS Secret managed by Secrets Manager
 * @param scope Pass "this" in the constructor of InfraStack.
 * @returns The created secret.
 */
export default function CreateSecret(scope: Construct): Secret {
  // Create a secret in json format.
  return new Secret(scope, "ReonicRDSSecret", {
    generateSecretString: {
      secretStringTemplate: JSON.stringify({
        // host: // will be assigned by RDS instances (see ./rds.ts)
        // port: // will be assigned by RDS instances (see ./rds.ts)
        // password: // will be generated below (generateStringKey)
        database: DB_NAME, // another field will be auto assigned (but what we need is "database")
        username: DB_USERNAME, // used for RDS instance creation
      }),
      generateStringKey: "password",
      excludePunctuation: true, // punctuations will cause "password authentication failed" error
      passwordLength: 32,
    },
  });
}
