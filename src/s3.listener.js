const AWS = require('aws-sdk');

class Handler {
  constructor({ s3Svc, sqsSvc }) {
    this.s3Svc = s3Svc
    this.sqsSvc = sqsSvc
    this.queueName = process.env.SQS_QUEUE
  }

  static getSdks() {
    const host = process.env.LOCALSTACK_HOST || "localhost"
    const s3port = process.env.S3_PORT || "4572"
    const sqsPort = process.env.SQS_PORT || "4576"
    const isLocal = process.env.IS_LOCAL
    const s3endpoint = new AWS.Endpoint(
        `http://${host}:${s3port}`
    )
    const s3config = {
        endpoint: s3endpoint,
        s3ForcePathStyle: true
    }

    const sqsEndpoint = new AWS.Endpoint(
        `http://${host}:${sqsPort}`
    )
    const sqsConfig = {
        endpoint: sqsEndpoint,
    }

    if (!isLocal) {
        delete s3config.endpoint
        delete sqsConfig.endpoint
    }
    return {
        s3: new AWS.S3(s3config),
        sqs: new AWS.SQS(sqsConfig)
    }
  }

  async main(event) {
    console.log('***event', JSON.stringify(event, null, 2));
    try {
      return {
        statusCode: 200,
        body: 'Hello',
      }
    } catch (error) {
      console.log('***error', error.stack)
      return {
        statusCode: 500,
        body: 'Internal Error'
      }
    }
  }
}
const { s3, sqs } = Handler.getSdks()
const handler = new Handler({
    sqsSvc: sqs,
    s3Svc: s3
})
module.exports = handler.main.bind(handler)
