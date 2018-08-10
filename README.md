# Introduction

This sample application will create all of the AWS resources you need to have an AppSync GraphQL API that fronts an RDS Aurora cluster, and does so via a Lambda function. Specifically, it will provision the AppSync API (including the schema, data source, and all resolvers), the Cognito user pool used for authorization, an RDS cluster that runs on Amazon Aurora MySQL, and a Lambda function to serve as the go-between. Both the Lambda function and the RDS resources will reside in a newly created VPC. This sample will work out of the box in every region that AppSync is available, and will show how you can use GraphQL to interact with your database, as well as how the requests translate into SQL. You can use this sample application for learning purposes or adapt the resources to meet your own needs.

## Features
The schema is a light blog design - the out of the box types are 'Posts' and 'Comments'.

* GraphQL Mutations
  * Create new posts
  * Create comments on existing posts
  * Increment view counts on existing posts
  * Upvote comments on existing posts
  * Downvote comments on existing posts

* GraphQL Queries
  * Get a post
  * Get all posts by an author
  * Get all of the comments on a post
  * Get the number of comments on a post
  * Get all comments by an author
  
* GraphQL Subscriptions
  * Real time updates for comments added to a post
  * Real time updates for comments added by an author
  * Real time udpates for posts added by an author
  
* Authorization
  * This sample app uses Cognito User Pools as the authorization mechanism

## AWS Setup

| AWS Region | Short name | | 
| -- | -- | -- |
| US East (Ohio) | us-east-2 | [![cloudformation-launch-button](images/cloudformation-launch-stack.png)](https://console.aws.amazon.com/cloudformation/home?region=us-east-2#/stacks/new?stackName=AWSAppSyncRDSLambdaSample&templateURL=https://s3-us-west-2.amazonaws.com/awsappsync/samples/rds-over-lambda-sample/appsyncrdslambdasampletemplate.yaml) |
| US East (N. Virginia) | us-east-1 | [![cloudformation-launch-button](images/cloudformation-launch-stack.png)](https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/new?stackName=AWSAppSyncRDSLambdaSample&templateURL=https://s3-us-west-2.amazonaws.com/awsappsync/samples/rds-over-lambda-sample/appsyncrdslambdasampletemplate.yaml) |
| US West (Oregon) | us-west-1 | [![cloudformation-launch-button](images/cloudformation-launch-stack.png)](https://console.aws.amazon.com/cloudformation/home?region=us-west-1#/stacks/new?stackName=AWSAppSyncRDSLambdaSample&templateURL=https://s3-us-west-2.amazonaws.com/awsappsync/samples/rds-over-lambda-sample/appsyncrdslambdasampletemplate.yaml) |
| EU (Ireland) | eu-west-1 | [![cloudformation-launch-button](images/cloudformation-launch-stack.png)](https://console.aws.amazon.com/cloudformation/home?region=eu-west-1#/stacks/new?stackName=AWSAppSyncRDSLambdaSample&templateURL=https://s3-us-west-2.amazonaws.com/awsappsync/samples/rds-over-lambda-sample/appsyncrdslambdasampletemplate.yaml) |
| EU (Frankfurt) | eu-central-1 | [![cloudformation-launch-button](images/cloudformation-launch-stack.png)](https://console.aws.amazon.com/cloudformation/home?region=eu-central-1#/stacks/new?stackName=AWSAppSyncRDSLambdaSample&templateURL=https://s3-us-west-2.amazonaws.com/awsappsync/samples/rds-over-lambda-sample/appsyncrdslambdasampletemplate.yaml) |
| Asia Pacific (Tokyo) | ap-northeast-1 | [![cloudformation-launch-button](images/cloudformation-launch-stack.png)](https://console.aws.amazon.com/cloudformation/home?region=ap-northeast-1#/stacks/new?stackName=AWSAppSyncRDSLambdaSample&templateURL=https://s3-us-west-2.amazonaws.com/awsappsync/samples/rds-over-lambda-sample/appsyncrdslambdasampletemplate.yaml) |
| Asia Pacific (Sydney) | ap-southeast-2 | [![cloudformation-launch-button](images/cloudformation-launch-stack.png)](https://console.aws.amazon.com/cloudformation/home?region=ap-southeast-2#/stacks/new?stackName=AWSAppSyncRDSLambdaSample&templateURL=https://s3-us-west-2.amazonaws.com/awsappsync/samples/rds-over-lambda-sample/appsyncrdslambdasampletemplate.yaml) |
| Asia Pacific (Singapore) | ap-southeast-1 | [![cloudformation-launch-button](images/cloudformation-launch-stack.png)](https://console.aws.amazon.com/cloudformation/home?region=ap-southeast-1#/stacks/new?stackName=AWSAppSyncRDSLambdaSample&templateURL=https://s3-us-west-2.amazonaws.com/awsappsync/samples/rds-over-lambda-sample/appsyncrdslambdasampletemplate.yaml) |
| Asia Pacific (Mumbai) | ap-south-1 |  [![cloudformation-launch-button](images/cloudformation-launch-stack.png)](https://console.aws.amazon.com/cloudformation/home?region=ap-south-1#/stacks/new?stackName=AWSAppSyncRDSLambdaSample&templateURL=https://s3-us-west-2.amazonaws.com/awsappsync/samples/rds-over-lambda-sample/appsyncrdslambdasampletemplate.yaml) |

## License Summary

This sample code is made available under a modified MIT license. See the LICENSE file.

