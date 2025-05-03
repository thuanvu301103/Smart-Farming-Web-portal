FROM python:3.10-slim

WORKDIR /app

# Install MLflow and any extras
RUN pip install --upgrade pip && pip install mlflow boto3 psycopg2-binary

# Copy pre-populated database and artifacts into image
COPY mlflow.db /app/mlflow.db
COPY mlruns /app/mlruns

EXPOSE 5000

CMD ["mlflow", "server", \
     "--host=0.0.0.0", \
     "--port=5000", \
     "--backend-store-uri=sqlite:////app/mlflow.db", \
     "--default-artifact-root=file:/app/mlruns", \
     "--workers=1"]