import pickle
import numpy as np
from sklearn.linear_model import LinearRegression

def train_and_save_model(file_path: str):
    # Giả sử chúng ta có một số dữ liệu ngẫu nhiên cho 3 yếu tố: water, soil, time
    np.random.seed(42)
    # Tạo 100 điểm dữ liệu giả lập với các tính năng water, soil, time
    X = np.random.rand(100, 3)  # 100 mẫu, 3 tính năng (water, soil, time)
    
    # Tạo các giá trị mục tiêu ngẫu nhiên cho 3 yếu tố
    y_water = X[:, 0] * 10 + np.random.randn(100)  # water phụ thuộc vào tính năng đầu tiên
    y_soil = X[:, 1] * 5 + np.random.randn(100)    # soil phụ thuộc vào tính năng thứ hai
    y_time = X[:, 2] * 3 + np.random.randn(100)    # time phụ thuộc vào tính năng thứ ba

    # Tạo mô hình Linear Regression cho từng yếu tố
    model_water = LinearRegression()
    model_soil = LinearRegression()
    model_time = LinearRegression()

    model_water.fit(X, y_water)
    model_soil.fit(X, y_soil)
    model_time.fit(X, y_time)

    # Lưu mô hình vào file
    with open(file_path, "wb") as f:
        pickle.dump((model_water, model_soil, model_time), f)
        
def load_model(file_path: str):
    try:
        # Kiểm tra và tải mô hình
        with open(file_path, "rb") as f:
            model_water, model_soil, model_time = pickle.load(f)
        return model_water, model_soil, model_time
    except Exception as e:
        raise Exception(f"Error loading model: {str(e)}")

def predict_and_generate_json(input_data: np.ndarray, model_file_path: str):
    # Tải mô hình đã huấn luyện
    model_water, model_soil, model_time = load_model(model_file_path)

    # Dự đoán các giá trị cho water, soil, time
    water_prediction = model_water.predict(input_data)
    soil_prediction = model_soil.predict(input_data)
    time_prediction = model_time.predict(input_data)

    # Tạo file JSON
    predictions = {
        "water": water_prediction.tolist(),
        "soil": soil_prediction.tolist(),
        "time": time_prediction.tolist()
    }

    return predictions
