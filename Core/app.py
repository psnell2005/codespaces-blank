import os
from flask import Flask, jsonify, render_template, request
import pandas as pd
import numpy as np
from sklearn.neighbors import NearestNeighbors
import traceback
import logging

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
    
# Load data and build model
def load_data_and_build_model():
    # Select the relevant features for similarity calculation
    features = ['Danceability', 'KeySignature', 'Tempo', 'TimeSignature', 'Year']
    # Create a KNN model
    k = 10  # Number of nearest neighbors to consider
    model = NearestNeighbors(n_neighbors=k, algorithm='auto')
    model.fit(data[features])
    return model, data, features
model, data, features = load_data_and_build_model()

# Function to suggest similar songs based on a liked song
def suggest_similar_songs(liked_song, data, features, model):
    print(f"Finding similar songs for '{liked_song}'")
    print(f"Data shape: {data.shape}")
    print(f"Features: {features}")
    
    liked_song_index = data[data['Title'] == liked_song].index
    print(f"Liked song index: {liked_song_index}")
    
    if not liked_song_index.empty:
        liked_song_features = data.loc[liked_song_index[0], features].values.reshape(1, -1)
        distances, indices = model.kneighbors(liked_song_features)
        similar_songs_info = [(data.loc[index, 'Title'], data.loc[index, 'ArtistName'], data.loc[index, 'Year']) for index in indices[0]]
        similar_songs_info = similar_songs_info[1:]  # Exclude the input song itself
        return similar_songs_info
    else:
        print(f"No similar songs found for '{liked_song}'")
        return []

logging.basicConfig(level=logging.ERROR)
logger = logging.getLogger(__name__)

# Flask route to get similar songs
@app.route('/get_similar_songs', methods=['POST'])
def get_similar_songs():
    try:
        liked_song = request.json.get('likedSong')
        logger.info(f"Received likedSong: {liked_song}")
        similar_songs = suggest_similar_songs(liked_song, data, features, model)
        logger.info(f"Similar songs: {similar_songs}")
        similar_songs_list = [{'title': song[0], 'artist': song[1], 'year': int(song[2])} for song in similar_songs]
        logger.info(f"Similar songs list: {similar_songs_list}")
        
        return jsonify(similar_songs_list)
    except Exception as e:
        logger.error(f"Error in get_similar_songs: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({"error": "Internal Server Error"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=8080)
