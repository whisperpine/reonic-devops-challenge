#!/usr/bin/env node

import { App } from "aws-cdk-lib";
import { InfraStack } from "../lib/infra-stack";
import { ENVIRONMENT_DEV, ENVIRONMENT_PROD } from "../lib/tags";

const app = new App();

new InfraStack(app, "ReonicDevOpsStackDev", {
  tags: { "environment": ENVIRONMENT_DEV },
});

new InfraStack(app, "ReonicDevOpsStackProd", {
  tags: { "environment": ENVIRONMENT_PROD },
  // // It ensures that the stack cannot be deleted through the AWS Management Console,
  // // AWS CLI, or API until the protection is explicitly disabled.
  // terminationProtection: true, // enable this in realworld production deployment.
});
