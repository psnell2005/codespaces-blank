import pandas as pd
from sklearn.neighbors import NearestNeighbors

# Load the song data into a pandas DataFrame
data = pd.read_csv('song_data.csv')

# Select the relevant features for similarity calculation
features = ['Danceability', 'KeySignature', 'Tempo', 'TimeSignature']

# Create a KNN model
k = 5  # Number of nearest neighbors to consider
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

    # Get the titles of the similar songs
    similar_songs = data.loc[indices[0], 'Title'].tolist()

    # Remove the liked song itself from the suggestions
    similar_songs = similar_songs[1:]

    return similar_songs

# Example usage
liked_song = "b'Crossfire'"
similar_songs = suggest_similar_songs(liked_song)
print(f"Songs similar to '{liked_song}':")
for song in similar_songs:
    print(song)