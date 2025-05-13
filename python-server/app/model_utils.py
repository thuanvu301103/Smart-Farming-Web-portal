from sklearn.datasets import load_iris
from sklearn.linear_model import LogisticRegression
import pickle

def train_and_save_model(file_path: str):
    X, y = load_iris(return_X_y=True)
    model = LogisticRegression(max_iter=200)
    model.fit(X, y)
    with open(file_path, "wb") as f:
        pickle.dump(model, f)
