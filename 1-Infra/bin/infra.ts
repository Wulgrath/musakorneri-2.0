#!/usr/bin/env node
import * as cdk from "aws-cdk-lib/core";
import { ApiStack } from "../stacks/api/api-stack";
import { DynamodbStack } from "../stacks/dynamodb/dynamodb-stack";
import { FrontendStack } from "../stacks/frontend-stack";
import { AuthStack } from "../stacks/auth/auth-stack";

const app = new cdk.App();

new DynamodbStack(app, "MusakorneriDynamodbStack");
new ApiStack(app, "MusakorneriApiStack");
new AuthStack(app, "MusakorneriAuthStack");
new FrontendStack(app, "MusakorneriFrontendStack");
