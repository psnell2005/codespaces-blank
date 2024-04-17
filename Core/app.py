import csv
from flask import Flask, jsonify, render_template
import os
import pandas as pd

app = Flask(__name__, static_folder='static')

@app.route('/')
def index():
    return render_template('index.html')

csv_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'SongCSV.csv')

@app.route('/data')
def get_data():
    data = []
    with open(csv_path, 'r', newline='') as file:
        csv_reader = csv.DictReader(file)  
        for row in csv_reader:
            data.append(row)
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True, port=8080)


data = pd.read_csv(csv_path)
