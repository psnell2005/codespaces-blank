import csv
from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/data')
def get_data():
    data = []
    with open('SongCSV.csv', 'r') as file:
        csv_reader = csv.reader(file)
        for row in csv_reader:
            data.append(row)
    return jsonify(data)

if __name__ == '__main__':
    app.run()