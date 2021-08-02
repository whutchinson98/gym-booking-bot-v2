#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { GymBookingBotV2Stack } from '../lib/gym-booking-bot-v2-stack';
require('dotenv').config();

const app = new cdk.App();
new GymBookingBotV2Stack(app, 'GymBookingBotV2Stack', {
  env: { account: `${process.env.AWS_ACCOUNT}`, region: 'us-east-1' }
});
