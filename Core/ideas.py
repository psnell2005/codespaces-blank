import pandas as pd
from sklearn.neighbors import NearestNeighbors
import os
from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True, port= 8080)

csv_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'SongCSV.csv')
# Load the song data into a pandas DataFrame
data = pd.read_csv(csv_path)

# Select the relevant features for similarity calculation
features = ['Danceability', 'KeySignature', 'Tempo', 'TimeSignature', 'Year']

# Create a KNN model
k = 10  # Number of nearest neighbors to consider
model = NearestNeighbors(n_neighbors=k, algorithm='auto')
model.fit(data[features])

# Function to suggest similar songs based on a liked song
def suggest_similar_songs(liked_song):
    # Find the index of the liked song in the DataFrame
    liked_song_index = data[data['Title'] == liked_song].index[0]

    # Get the feature vector of the liked song
    liked_song_features = data.loc[liked_song_index, features].values.reshape(1, -1)

    # Find the k nearest neighbors of the liked song
    distances, indices = model.kneighbors(liked_song_features)

    # Get the info of the similar songs
    similar_songs_info = [(data.loc[index, 'Title'], data.loc[index, 'ArtistName'], data.loc[index, 'Year'])for index in indices[0]]

    # Remove the liked song itself from the suggestions
    similar_songs_info = similar_songs_info[1:]

    return similar_songs_info

# Example usage
liked_song = "b'Heaven Can Wait'"
similar_songs = suggest_similar_songs(liked_song)
print(f"Songs similar to '{liked_song}':")
for song, artist, year in similar_songs:
    print(f'{song} by {artist} ({year})')
