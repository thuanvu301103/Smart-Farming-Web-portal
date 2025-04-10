FROM python:3.10-slim

WORKDIR /app

# Install MLflow and any extras
RUN pip install --upgrade pip && pip install mlflow boto3 psycopg2-binary

EXPOSE 5000

CMD ["mlflow", "server", \
     "--host", "0.0.0.0", \
     "--port", "5000", \
     "--backend-store-uri", "sqlite:///mlflow.db", \
     "--default-artifact-root", "./mlruns"]