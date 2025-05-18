import dill
import random
import json

# ✅ Load function
with open("predict.pkl", "rb") as f:
    loaded_predict = dill.load(f)

# ✅ Use function without redefining it
json_output = loaded_predict("Hà Nội", 28, 60, 100)
print("✅ JSON Output:")
print(json_output)
