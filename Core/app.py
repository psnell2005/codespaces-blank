import csv
from flask import Flask, jsonify, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/data')
def get_data():
    data = []
    with open('SongCSV.csv', 'r', newline='') as file:  
        csv_reader = csv.DictReader(file)  
        for row in csv_reader:
            data.append(row)
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True, port=8080)