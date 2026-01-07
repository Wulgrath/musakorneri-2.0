import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import { Construct } from "constructs";

interface FrontendStackProps extends cdk.StackProps {}

export class FrontendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: FrontendStackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, "WebsiteBucket", {
      bucketName: "musakorneri-app",
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "404.html",
      publicReadAccess: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS_ONLY,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const distribution = new cloudfront.Distribution(this, "Distribution", {
      defaultBehavior: {
        origin: new origins.S3StaticWebsiteOrigin(bucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      defaultRootObject: "index.html",
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
        },
      ],
    });


    new cdk.CfnOutput(this, "BucketName", {
      value: bucket.bucketName,
      exportName: "MusakorneriWebsiteBucket",
    });

    new cdk.CfnOutput(this, "DistributionId", {
      value: distribution.distributionId,
      exportName: "MusakorneriDistributionId",
    });

    new cdk.CfnOutput(this, "CloudFrontUrl", {
      value: distribution.distributionDomainName,
      exportName: "MusakorneriCloudFrontUrl",
    });
  }
}
