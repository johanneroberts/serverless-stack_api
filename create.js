import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";

export const main = handler(async (event, context) => {
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.tableName,
    Item: {
      userId: event.requestContext.identity.cognitoIdentityId,
      job_id: Date.now(),
      job_location: data.job_location,
      job_plumber: data.job_plumber,
      job_status: data.job_status
    }
  };

  await dynamoDb.put(params);

  return params.Item;
});