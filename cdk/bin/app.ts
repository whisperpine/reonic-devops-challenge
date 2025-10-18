#!/usr/bin/env node

import { App } from "aws-cdk-lib";
import { InfraStack } from "../lib/infra-stack";

const app = new App();
new InfraStack(app, "ReonicDevOpsStack", {
  tags: {
    "Environment": "Dev",
  },
});
