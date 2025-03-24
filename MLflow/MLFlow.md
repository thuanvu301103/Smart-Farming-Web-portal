# MLFLlow

## Introduction
- MLflow is an open-source platform designed to manage the machine learning (ML) lifecycle, including experimentation, reproducibility, deployment, and model registry. It provides tools to track ML experiments, package code into reproducible runs, share and deploy models, and manage model versions efficiently
- MLflow Components:
    - `MLflow Tracking` - Logs parameters, metrics, and artifacts of ML experiments.
    - `MLflow Projects` - Packages ML code into a format that enables reproducibility.
    - `MLflow Models` - Standardizes model packaging and deployment across different frameworks.
    - `MLflow Registry` - A centralized model store to manage model versions, stage transitions, and annotations.
- It supports multiple ML frameworks like `TensorFlow`, `PyTorch`, `Scikit-learn`, and `XGBoost`. MLflow can be used locally or in cloud environments, integrating well with existing ML pipelines.

## Install MLFlow
- Install via pip
```bash
pip install mlflow
```
- Check the installation
```bash
mflow --version
```

## Start the MLflow Tracking Server
- Run the following command to start the server:
```bash
mlflow server \
    --backend-store-uri sqlite:///mlflow.db \
    --default-artifact-root ./mlruns \
    --host 0.0.0.0 \
    --port 5000
```
or
```bash
mlflow server --backend-store-uri sqlite:///mlflow.db --default-artifact-root ./mlruns --host 0.0.0.0 --port 5000
```
- Parameters:
	- `--backend-store-uri`: backend store for metadata - use `SQLite` (already installed withing python); can be replaced with `PostgreSQL` or `MySQL` for production
	- `--default-artifact-root`: defines where artifacts (models, logs) are stored
	- `--host`: `0.0.0.0` - allow access from any machine
	- `--port`: `5000` - runs the server on port 5000
- After starting, the API will be available at: `http://localhost:5000`

## MLflow Machine learning (ML) lifecycle Concept
1. `Experiments`: act like folders or projects that group multiple training sessions (runs) together. Users create new experiment when: 
	- They are working on a completely new ML problem
	- They want to compare different approaches
	- They are working with different datasets
2. `Runs`: represent individual training sessions inside an experiment. Users create new experiment when:
	- They are tuning hyperparameters  (e.g., different learning rates), use the same experiment but log each training session as a new run
	- They are training multiple models for comparison
3. `Logs`: help track various aspects of a ML experiment
	- `Metric`: (e.g., accuracy, loss, precision) track evaluation results and compare different training runs
	- `Batch`: log multiple Metrics, Parameters & Tags together
	- `Model`: save trained model for later use
	- `Input`: log dataset name, type, and schema to track data lineage
4. `Artifacts`: are files (e.g., models images, logs) stored for each run. These files come from ML process and are logged using `log_model`, `log_artifact`,...
5. `Registered Model`: is a versioned model stored in the MLflow Model Registry. Unlike logged model in artifact, A registered model is a logged model that is added to the MLflow Model Registry (after all experiment runs complete and when users have decided which model is most suitable to add to the registry) for versioning and deployment. Users use model to:
	- Track multiple versions of a model.
	- Store metadata (author, date, description, etc.).
	- Promote models from staging → production → archived.
	- Enable collaboration between teams.
`Artifact` is a temporary saved trained model. `Registered Model` is official trained model and can be used for later processes. 
6. `ModelVersion`: is a specific version of a Registered Model.
	- Each time users register a model, a new version is created.
	- Versions allow tracking, comparing, and promoting models in the MLflow Model Registry.
	- Can be assigned different stages (Staging, Production, Archived).
7. `ModelVersion Artifact`: when users log a model using `mlflow.log_model()`, it gets saved as an artifact in the MLflow artifact store. When users register a model version, it references these artifacts.
* The trained model then can be used to generate prediction or output from input.

## A MLflow Example working with Python

### Start a MLflow
- Run [this Python script](train_with_mflow.py)
- Result:
	- New Experiment is created named `RandomForest_Training`
	- Inside that Experiment a new Run named is created using `sklearn`
	- All parameters and metrics are logged for the Run
	- 4 artifacts are created

### Register model into MLflow Model Registry
- Run [this Python script](register_model.py)
- Result: the model is register into MLflow Model Registry as `Version 1` of model `New Registered Model`
- Re-run the script to register a new Version of the model.

### Send Data to the API for Prediction
- Use Python to send a request to the model-serving endpoint:
```python
import requests

url = "http://127.0.0.1:1234/invocations"
data = {
    "columns": ["sepal_length", "sepal_width", "petal_length", "petal_width"], 
    "data": [[5.1, 3.5, 1.4, 0.2]]
}

response = requests.post(url, json=data)
print(response.json())  # Prediction result
```

## Caution
- MLflow as well as its [REST APIs][1] is only used for managing ML lifecycle not training ML model. 
- Users train their models using libraries like: `Scikit-Learn`, `TensorFlow/Keras`, `PyTorch`, `XGBoost`. Then, MLflow helps track and manage the process

## Reference
[1]: https://mlflow.org/docs/latest/api_reference/rest-api.html "MLflow REST API"