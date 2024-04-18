import csv
from flask import Flask, jsonify, render_template, request
import os
import pandas as pd

app = Flask(__name__)

# Load data
csv_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'SongCSV.csv')
data = pd.read_csv(csv_path)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/data')
def get_data():
    data_list = []
    with open(csv_path, 'r', newline='') as file:
        csv_reader = csv.DictReader(file)
        for row in csv_reader:
            data_list.append(row)
    return jsonify(data_list)

@app.route('/search')
def search_songs():
    term = request.args.get('term', '').lower()
    if term:
        filtered_data = data[data['Title'].str.lower().str.contains(term)]
        return jsonify(filtered_data.to_dict(orient='records'))
    else:
        return jsonify(data.to_dict(orient='records'))

if __name__ == '__main__':
    app.run(debug=True, port=8080)