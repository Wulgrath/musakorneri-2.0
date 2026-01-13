import * as cdk from "aws-cdk-lib/core";
import * as s3 from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

export class S3Stack extends cdk.Stack {
  public readonly filesBucket: s3.Bucket;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.filesBucket = new s3.Bucket(this, "FilesBucket", {
      bucketName: "musakorneri-files",
      publicReadAccess: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS_ONLY,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      cors: [
        {
          allowedMethods: [s3.HttpMethods.GET],
          allowedOrigins: ["*"],
          allowedHeaders: ["*"],
        },
      ],
    });

    new cdk.CfnOutput(this, "FilesBucketName", {
      value: this.filesBucket.bucketName,
      exportName: "MusakorneriFilesBucket",
    });

    new cdk.CfnOutput(this, "FilesBucketUrl", {
      value: this.filesBucket.bucketWebsiteUrl,
      exportName: "MusakorneriFilesBucketUrl",
    });
  }
}