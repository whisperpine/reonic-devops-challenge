import { Construct } from "constructs";
import { Secret } from "aws-cdk-lib/aws-secretsmanager";
import { DB_NAME, DB_USERNAME } from "./rds";

/**
 * Create an AWS Secrets Manager.
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
        database: DB_NAME,
        username: DB_USERNAME,
      }),
      generateStringKey: "password",
      excludePunctuation: false, // we only want to exclude specific ones
      excludeCharacters: `/@" `, // forbidden characters: slash, at, quote, space
      passwordLength: 32,
    },
  });
}
