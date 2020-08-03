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
    UpdateExpression: "SET job_location = :job_location, job_suburb = :job_suburb, job_town = :job_town, job_cfc = :job_cfc, job_ffc = :job_ffc,  job_plumber = :job_plumber, job_fault_date = :job_fault_date, job_status = :job_status",
    ExpressionAttributeValues: {
      ":job_location": data.job_location || null,
      ":job_job_suburb": data.job_suburb || null,
      ":job_town": data.job_town || null,
      ":job_cfc": data.job_cfc || null,
      ":job_ffc": data.job_ffc || null,
      ":job_fault_date" : data.job_fault_date || null,
      ":job_plumber": data.job_plumber || null,
      ":job_status": data.job_status || null
    },
    ReturnValues: "ALL_NEW"
  };

  await dynamoDb.update(params);

  return { status: true };
});