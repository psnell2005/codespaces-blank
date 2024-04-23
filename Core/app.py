import os
from flask import Flask, jsonify, render_template, request
import pandas as pd
import numpy as np

app = Flask(__name__)

# Load data
csv_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'SongCSV.csv')
data = pd.read_csv(csv_path, encoding='utf-8')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/data')
def get_data():
    print("Sending data to /data endpoint")
    print(data.head())
    return jsonify(data.to_dict(orient='records'))

@app.route('/search')
def search_songs():
    term = request.args.get('term', '').lower()
    if term:
        filtered_data = data[(data['Title'].str.lower().str.contains(term)) | (data['ArtistName'].str.lower().str.contains(term))]
        result = filtered_data.to_dict(orient='records')
        result = [
            {
                k: None if pd.isna(v) else v.decode('utf-8')[:-1] if isinstance(v, bytes) else str(v)[:-1] if isinstance(v, str) and v.endswith("'") else v
                for k, v in row.items()
            }
            for row in result
        ]
        # Remove b' prefix from byte strings
        for item in result:
            for key, value in item.items():
                if isinstance(value, str) and value.startswith("b'"):
                    item[key] = value[2:]
        print(f"Search results for term '{term}':")
        print(result)
        return jsonify(result)
    else:
        return jsonify([])

if __name__ == '__main__':
    app.run(debug=True, port=8080)