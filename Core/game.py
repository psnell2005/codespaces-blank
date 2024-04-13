from flask import Flask, request, jsonify
from difflib import SequenceMatcher
import pandas as pd
import os

app = Flask(__name__)

# Since the script is inside 'Core', the CSV file is in the same directory
csv_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'SongCSV.csv')
song_data = pd.read_csv(csv_path)

# Rest of your code remains the same...

song_data = pd.read_csv(csv_path)

def similar(a, b):
    return SequenceMatcher(None, a, b).ratio()

def calculate_similarity(song1, song2):
    title_similarity = similar(song1['Title'], song2['Title'])
    artist_similarity = similar(song1['ArtistName'], song2['ArtistName'])
    year_similarity = 1 if song1['Year'] == song2['Year'] else 0
    tempo_similarity = similar(str(song1['Tempo']), str(song2['Tempo']))
    danceability_similarity = similar(str(song1['Danceability']), str(song2['Danceability']))
    time_signature_similarity = 1 if song1['TimeSignature'] == song2['TimeSignature'] else 0
    key_signature_similarity = 1 if song1['KeySignature'] == song2['KeySignature'] else 0

    total_similarity = (title_similarity + artist_similarity + year_similarity +
                        tempo_similarity + danceability_similarity +
                        time_signature_similarity + key_signature_similarity) / 7
    return total_similarity

def generate_recommendation(user_songs, song_data):
    if not user_songs:
        return "No favorite songs provided"

    max_similarity = 0
    recommended_song = None

    for index, song in song_data.iterrows():
        for _, user_song in user_songs.iterrows():
            similarity = calculate_similarity(song, user_song)
            if similarity > max_similarity:
                max_similarity = similarity
                recommended_song = song['Title']

    return recommended_song

@app.route('/recommend', methods=['POST'])
def recommend():
    user_input = request.json.get('favorite_songs', [])
    user_songs = pd.DataFrame(user_input)

    recommendation = generate_recommendation(user_songs, song_data)
    return jsonify({'recommended_song': recommendation})

if __name__ == '__main__':
    app.run(debug=True)  # Added debug=True for easier debugging
