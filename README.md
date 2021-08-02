# GYM BOOKING BOT v2

## About

This project provides the ability for my wife and I to automatically have our gym appointments booked for us using an `AWS Lambda` function and `AWS EventBridge`.

If you want to modify the environment variables, lambda function or the eventbridge job you can do that in the `lib/gym-booking-bot-v2-stack.ts` file.

If you want to have it run for yourself you will need the following env variables inside of a `.env` file in the root directory of this project

`AWS_ACCOUNT`
`EMAIL`
`PASSWORD`

Note: this project also has WIFE versions of those env vars to add her appointments.

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template
