import mlflow
import mlflow.sklearn
import pickle
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# 1 - Connect MLflow Tracking Server
mlflow.set_tracking_uri("http://localhost:5000")

# 2 - Create an Experiment (or get existed Experiment)
experiment_name = "RandomForest_Training"
experiment = mlflow.get_experiment_by_name(experiment_name)
if experiment is None:
    experiment_id = mlflow.create_experiment(experiment_name)
else:
    experiment_id = experiment.experiment_id
mlflow.set_experiment(experiment_name)

# 3 - Load Dataset
X, y = load_iris(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 4 - Start a MLflow Run
with mlflow.start_run():
    run_id = mlflow.active_run().info.run_id
    print(f"📌 Run ID: {run_id}")

    # Log thông số chung
    max_depth = 5
    mlflow.log_param("max_depth", max_depth)

    # Model 1: RandomForestClassifier
    rf_model = RandomForestClassifier(n_estimators=100, max_depth=max_depth, random_state=42)
    rf_model.fit(X_train, y_train)
    y_pred_rf = rf_model.predict(X_test)
    accuracy_rf = accuracy_score(y_test, y_pred_rf)
    mlflow.log_metric("accuracy_rf", accuracy_rf)
    mlflow.sklearn.log_model(rf_model, "random_forest_model")
    
    # Model 2: DecisionTreeClassifier
    dt_model = DecisionTreeClassifier(max_depth=max_depth, random_state=42)
    dt_model.fit(X_train, y_train)
    y_pred_dt = dt_model.predict(X_test)
    accuracy_dt = accuracy_score(y_test, y_pred_dt)
    mlflow.log_metric("accuracy_dt", accuracy_dt)
    mlflow.sklearn.log_model(dt_model, "decision_tree_model")

    # Export model into file .pkl và Save in MLflow as artifacts
    with open("random_forest.pkl", "wb") as f:
        pickle.dump(rf_model, f)
    mlflow.log_artifact("random_forest.pkl")

    with open("decision_tree.pkl", "wb") as f:
        pickle.dump(dt_model, f)
    mlflow.log_artifact("decision_tree.pkl")

    print(f"✅ Training completed. Models saved with RF Accuracy: {accuracy_rf:.4f}, DT Accuracy: {accuracy_dt:.4f}")
