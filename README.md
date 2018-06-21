# serverless-thousand-lambda
A automation script to launch thousand of lambda (tested with 6000)

When doing some experiments with lambda. I came across a problem that requires me to deploy 6000 lambda functions. And they need to be run in parallel meaning they should all execute almost at the same time.

Using serverless in theory you can combine them all into one but cloud formation won't support that many. It only support up to 60 or so. And even worse each region only supports around 3000 lambda functions. 

So the solution I came up with was automating the whole deploy and invoke.

First I need a template for my serverless deployment.

Second Based on the limit above I know I have to create 180 folders same code from the template I created last step.

Third I modify the serverless.yml config so that It only include 60 lambda functions.

Fourth I create a script that go into each folder and execute the deploy command

Fifth I create a script to delete all s3 buckets, the reason is because you can only create a certain number of buckets for each region (100 buckets or so). I run this script everytime it reaches the limit

Sixth There will be scenerios that you reach cloud formation limit ( again you can only create a certain number of cloud formation for each region ) So I created a script to delete.

Seventh Invoke ( I created a script to generate a bash script that go into each serverless folder and execute invoke command )