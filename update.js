import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";

export const main = handler(async (event, context) => {
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.tableName,
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      job_id: event.pathParameters.job_id
    },
    UpdateExpression: "SET job_location = :job_location, job_plumber = :job_plumber, job_status = :job_status",
    ExpressionAttributeValues: {
      ":job_location": data.job_location || null,
      ":job_plumber": data.job_plumber || null,
      ":job_status": data.job_status || null
    },
    ReturnValues: "ALL_NEW"
  };

  await dynamoDb.update(params);

  return { status: true };
});