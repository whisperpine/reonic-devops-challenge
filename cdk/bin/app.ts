#!/usr/bin/env node

import { App } from "aws-cdk-lib";
import { InfraStack } from "../lib/infra-stack";
import { ENVIRONMENT_DEV } from "../lib/tags";

const app = new App();
new InfraStack(app, "ReonicDevOpsStack", {
  tags: {
    "environment": ENVIRONMENT_DEV,
  },
});
