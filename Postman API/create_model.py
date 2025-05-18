import json
import random
import dill

def predict(location, temperature, humidity, rainfall):

    watering_events_count = random.randint(1, 3)
    watering_methods = ["drip", "spray"]
    watering_events = []
    for i in range(watering_events_count):
        event = {
            "time": f"{6 + i*6}:00",
            "duration": {
                "value": random.randint(15, 40),
                "unit": "min"
            },
            "water_volume": {
                "value": random.randint(50, 120),
                "unit": "l"
            },
            "method": random.choice(watering_methods)
        }
        watering_events.append(event)
    
    output_json = {
        "repeat": {
            "interval": random.randint(1, 3),
            "unit": random.choice(["day", "week"])
        },
        "watering_events_count": watering_events_count,
        "watering_events": watering_events,
        "conditions": {
            "skip_if_raining": random.choice([True, False]),
            "min_soil_moisture": random.randint(10, 30),
            "max_temperature": random.randint(30, 40),
            "min_air_humidity": random.randint(40, 50),
            "max_wind_speed": random.randint(10, 20)
        }
    }

    return json.dumps(output_json, indent=4, ensure_ascii=False)

# 🚀 Kiểm tra hàm
json_output = predict("Bình Dương", 30, 65, 120)
print(json_output)

predict.__globals__['random'] = random
predict.__globals__['json'] = json

with open("predict.pkl", "wb") as f:
    dill.dump(predict, f)

print("✅ Đã lưu hàm predict vào file pickle: predict.pkl")
