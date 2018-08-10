# AWS AppSync Using Amazon Aurora as a Data Source via AWS Lambda

## Introduction

This sample application will create all of the AWS resources you need to have an AppSync GraphQL API that fronts an RDS Aurora cluster, doing so via a Lambda function. All resources are created with AWS CloudFormation. Specifically, it will provision the AppSync API (including the schema, data source, and all resolvers), the Cognito user pool used for authorization, an RDS cluster that runs on Amazon Aurora MySQL, and a Lambda function to serve as the go-between. Both the Lambda function and the RDS resources will reside in a newly created VPC. This sample will work out of the box in every region that AppSync is available, and will show how you can use GraphQL to interact with your database, as well as how the requests translate into SQL. You can use this sample application for learning purposes or adapt the resources to meet your own needs.

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
  
* Dependency Versions
  * The Lambda code runs Node.js 8.10
  * The RDS cluster runs Aurora MySQL 5.7
  * The RDS instance is a t2.medium

## AWS Setup

### Create CloudFormation Stack

The sample spins up several AWS resources via CloudFormation, as described above. Step one to using it is having CloudFormation create the stack. Note the AppSync GraphQL API name when you're creating it - it's an input in creating the stack, and will be necessary later. Creating the stack can be done any of the following ways:

#### From Here

| AWS Region | Short name | | 
| -- | -- | -- |
| US East (Ohio) | us-east-2 | [![cloudformation-launch-button](images/cloudformation-launch-stack.png)](https://console.aws.amazon.com/cloudformation/home?region=us-east-2#/stacks/new?stackName=AWSAppSyncRDSLambdaSample&templateURL=https://s3-us-west-2.amazonaws.com/awsappsync/samples/rds-over-lambda-sample/appsyncrdslambdasampletemplate.yaml) |
| US East (N. Virginia) | us-east-1 | [![cloudformation-launch-button](images/cloudformation-launch-stack.png)](https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/new?stackName=AWSAppSyncRDSLambdaSample&templateURL=https://s3-us-west-2.amazonaws.com/awsappsync/samples/rds-over-lambda-sample/appsyncrdslambdasampletemplate.yaml) |
| US West (Oregon) | us-west-2 | [![cloudformation-launch-button](images/cloudformation-launch-stack.png)](https://console.aws.amazon.com/cloudformation/home?region=us-west-2#/stacks/new?stackName=AWSAppSyncRDSLambdaSample&templateURL=https://s3-us-west-2.amazonaws.com/awsappsync/samples/rds-over-lambda-sample/appsyncrdslambdasampletemplate.yaml) |
| EU (Ireland) | eu-west-1 | [![cloudformation-launch-button](images/cloudformation-launch-stack.png)](https://console.aws.amazon.com/cloudformation/home?region=eu-west-1#/stacks/new?stackName=AWSAppSyncRDSLambdaSample&templateURL=https://s3-us-west-2.amazonaws.com/awsappsync/samples/rds-over-lambda-sample/appsyncrdslambdasampletemplate.yaml) |
| EU (Frankfurt) | eu-central-1 | [![cloudformation-launch-button](images/cloudformation-launch-stack.png)](https://console.aws.amazon.com/cloudformation/home?region=eu-central-1#/stacks/new?stackName=AWSAppSyncRDSLambdaSample&templateURL=https://s3-us-west-2.amazonaws.com/awsappsync/samples/rds-over-lambda-sample/appsyncrdslambdasampletemplate.yaml) |
| Asia Pacific (Tokyo) | ap-northeast-1 | [![cloudformation-launch-button](images/cloudformation-launch-stack.png)](https://console.aws.amazon.com/cloudformation/home?region=ap-northeast-1#/stacks/new?stackName=AWSAppSyncRDSLambdaSample&templateURL=https://s3-us-west-2.amazonaws.com/awsappsync/samples/rds-over-lambda-sample/appsyncrdslambdasampletemplate.yaml) |
| Asia Pacific (Sydney) | ap-southeast-2 | [![cloudformation-launch-button](images/cloudformation-launch-stack.png)](https://console.aws.amazon.com/cloudformation/home?region=ap-southeast-2#/stacks/new?stackName=AWSAppSyncRDSLambdaSample&templateURL=https://s3-us-west-2.amazonaws.com/awsappsync/samples/rds-over-lambda-sample/appsyncrdslambdasampletemplate.yaml) |
| Asia Pacific (Singapore) | ap-southeast-1 | [![cloudformation-launch-button](images/cloudformation-launch-stack.png)](https://console.aws.amazon.com/cloudformation/home?region=ap-southeast-1#/stacks/new?stackName=AWSAppSyncRDSLambdaSample&templateURL=https://s3-us-west-2.amazonaws.com/awsappsync/samples/rds-over-lambda-sample/appsyncrdslambdasampletemplate.yaml) |
| Asia Pacific (Mumbai) | ap-south-1 |  [![cloudformation-launch-button](images/cloudformation-launch-stack.png)](https://console.aws.amazon.com/cloudformation/home?region=ap-south-1#/stacks/new?stackName=AWSAppSyncRDSLambdaSample&templateURL=https://s3-us-west-2.amazonaws.com/awsappsync/samples/rds-over-lambda-sample/appsyncrdslambdasampletemplate.yaml) |

#### From the AppSync Console

The AppSync console has the new sample added as well, entitled 'Blog App'. It will spin up the exact same template linked above and in this repository.

![appsync-sample-tile](images/console-sample-selection.png)

#### Customize Your Own

If you want to customize your own version of the template, that can easily be done by using this repository. Just download [the template](https://github.com/aws-samples/AWS-AppSync-rds-aurora-sample/blob/master/src/appsyncrdslambdasampletemplate.yaml), customize it to fit your own needs, then upload it to the CloudFormation console.

### Setting Up Authorization

The sample uses [Cognito User Pools](https://docs.aws.amazon.com/appsync/latest/devguide/security.html#amazon-cognito-user-pools-authorization) for authorization. Now that the sample stack has been created, the next step is creating a Cognito user to sign in. The easiest way to do this is by first going to the Cognito console. From there, click 'Manage User Pools'. Next, you will see a list of different user pools under your account. By default, the sample will create one with the name 'AppSyncRDSLambdaPool' - click into that. You'll need two things from this console:

#### Client Id
The CloudFormation stack will automatically create the client resource for you. You can get it by clicking 'App clients', in which it will be under the text 'App client id'.

#### A Created User
You'll need a user to exist under this pool to sign in with on the AppSync console. To create one, click on 'Users and groups' inside the created user pool page.

![Creating a user](images/creating-user.png)

Input a username for the user and a temporary password. Insert your phone number (with the country code, of the format +15555555555) in the 'Phone Number' field, check 'SMS (default)', and uncheck 'Mark email as verified'. This will text your phone with the username and temporary password for the user. If you don't enter a temporary password, a random one will be auto-generated for you. This will create the user with status 'FORCE_CHANGE_PASSWORD', which is Cognito's way of making sure a created user changes their password before they're able to sign in successfully. The AppSync console will take care of this for you.

#### Authorizing on the AppSync Console

There's one last step before you're ready to play with the sample. Go to the AppSync console, and click on the API that was created with the stack. Click on 'Queries' on the side of the page. At the top, you'll see a button to log in with User Pools. Click that.

![Sign in](images/signin-appsync.png)

Once you sign in with the username and temporary password you used, the console will prompt you to give a new password. This is normal for 'admin-created users', which is what we did on the Cognito console earlier. We have to change it once to get the user out of state 'FORCE_CHANGE_PASSWORD'. Use whatever password you like - this will be permanent.

![Changing password](images/signin-appsync-2.png)

## License Summary

This sample code is made available under a modified MIT license. See the LICENSE file.

