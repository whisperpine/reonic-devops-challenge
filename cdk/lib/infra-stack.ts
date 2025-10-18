import * as cdk from "aws-cdk-lib";
import { Stack } from "aws-cdk-lib";
import { Construct } from "constructs";

import { defaultTags } from "./tags";
import CreateResourceGroup from "./resource-group";

export class InfraStack extends Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    // Merged tags.
    const mergedTags = {
      ...defaultTags,
      ...props?.tags,
    };

    // Initialize the base class.
    super(scope, id, { ...props, tags: mergedTags });

    // Create an AWS Resource Group.
    CreateResourceGroup(this, mergedTags);
  }
}
