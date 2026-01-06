#!/usr/bin/env node
import * as cdk from "aws-cdk-lib/core";
import { InfraStack } from "../lib/infra-stack";
import { AuthStack } from "../lib/auth-stack";
import { FrontendStack } from "../lib/frontend-stack";

const app = new cdk.App();

new InfraStack(app, "MusakorneriInfraStack");
new AuthStack(app, "MusakorneriAuthStack");
new FrontendStack(app, "MusakorneriFrontendStack", {
  domainName: "musakorneri.in", // Replace with your domain
  hostedZoneId: "Z0879566254G2RJP5U65P", // Uncomment and add your hosted zone ID
});
