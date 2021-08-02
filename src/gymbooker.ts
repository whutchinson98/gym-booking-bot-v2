import {APIGatewayProxyEventV2, APIGatewayProxyResultV2} from 'aws-lambda';
import chromium from 'chrome-aws-lambda';
import * as constants from './constants';


/**
 * @description Books the most recent time slot and day at fit4less
 * requires EMAIL and PASSWORD environment variables
 */
export async function mostRecentSlotAndDay(
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {
  console.log('Running Gym Booking Bot:', event);

  const email:string = process.env.EMAIL || '';
  const password:string = process.env.PASSWORD || '';

  let browser = null;

  try {
    // Instantiate the browser
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    let page = await browser.newPage();

    await page.goto(constants.FIT4LESS_URL);

    //Enter email and password
    await page.$eval(constants.EMAIL, (el, email) => {el.value = email}, email);

    await page.$eval(constants.PASSWORD, (el, password) => {el.value = password}, password);

    //Login
    await page.click(constants.LOGIN_BUTTON);

    await page.waitForSelector(constants.DATE_SELECTOR, {visible: true});

    //Select day button
    await page.click(constants.DATE_SELECTOR);

    //Go to newest day
    await page.click(constants.NEWEST_DAY_SELECTOR);

    await page.waitForSelector(constants.NEWEST_TIME_SELECTOR, {visible: true});

    //Select earliest time
    await page.click(constants.NEWEST_TIME_SELECTOR);

    //Confirm
    await page.click(constants.CONFIRM_SELECTION);

  } catch (error) {
    return {
      body: JSON.stringify({error:true, message: error}),
      statusCode: 500,
    };
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }

  return {
    body: JSON.stringify({message: 'Gym booked successfully'}),
    statusCode: 200,
  };
}

export async function test(
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {
  console.log('event', event);

  return {
    body: JSON.stringify({message: `Gym test ${process.env.TEST_VAR}`}),
    statusCode: 200,
  };
}
