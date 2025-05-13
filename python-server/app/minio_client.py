import boto3

def get_s3_client():
    return boto3.client(
        "s3",
        endpoint_url="http://10.1.8.52:9000",
        aws_access_key_id="thuanvu301103",
        aws_secret_access_key="thuanvu301103",
    )
