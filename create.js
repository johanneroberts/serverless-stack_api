import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";

export const main = handler(async (event, context) => {
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.tableName,
    Item: {
      userId: event.requestContext.identity.cognitoIdentityId,
      job_id: data.job_id,
      job_location: data.job_location,
      job_suburb: data.job_suburb,
      job_town: data.job_town,
      job_cfc: data.job_cfc,
      job_ffc: data.jobf_ffc,
      job_fault_date: data.job_fault_date,
      job_plumber: data.job_plumber,
      job_status: data.job_status
    }
  };

  await dynamoDb.put(params);

  return params.Item;
});