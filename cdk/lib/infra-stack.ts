import * as cdk from "aws-cdk-lib";
import { Stack } from "aws-cdk-lib";
import { Construct } from "constructs";

import { defaultTags, ENVIRONMENTS } from "./tags";
import CreateResourceGroup from "./resource-group";

export class InfraStack extends Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    // Merged tags.
    const mergedTags: {
      [x: string]: string;
    } = {
      ...defaultTags,
      ...props?.tags,
    };

    // Make sure the "environment" tag is a valid value.
    const env: string = mergedTags["environment"];
    if (!ENVIRONMENTS.includes(env)) {
      throw Error(
        `Invalid tag "environment" of value: ${env}.\n` +
          `Expected one of: ${ENVIRONMENTS.join(", ")}.`,
      );
    }

    // Initialize the base class.
    super(scope, id, { ...props, tags: mergedTags });

    // Create an AWS Resource Group.
    CreateResourceGroup(this, mergedTags, env);
  }
}
