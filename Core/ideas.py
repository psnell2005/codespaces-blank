# import os
# import pandas as pd
# from sklearn.neighbors import NearestNeighbors
# from flask import Flask, render_template

# app = Flask(__name__)

# # Load data and build model
# def load_data_and_build_model():
#     csv_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'SongCSV.csv')
#     data = pd.read_csv(csv_path)

#     # Select the relevant features for similarity calculation
#     features = ['Danceability', 'KeySignature', 'Tempo', 'TimeSignature', 'Year']

#     # Create a KNN model
#     k = 10  # Number of nearest neighbors to consider
#     model = NearestNeighbors(n_neighbors=k, algorithm='auto')
#     model.fit(data[features])

#     return model, data, features

# model, data, features = load_data_and_build_model()

# # Function to suggest similar songs based on a liked song
# def suggest_similar_songs(liked_song, data, features, model):
#     liked_song_index = data[data['Title'] == liked_song].index
#     if not liked_song_index.empty:
#         liked_song_features = data.loc[liked_song_index[0], features].values.reshape(1, -1)
#         distances, indices = model.kneighbors(liked_song_features)

#         # Get the info of the similar songs
#         similar_songs_info = [(data.loc[index, 'Title'], data.loc[index, 'ArtistName'], data.loc[index, 'Year']) for index in indices[0]]

#         similar_songs_info = similar_songs_info[1:]  # Exclude the input song itself
#         return similar_songs_info
#     else:
#         return []

# # Flask route
# @app.route('/')
# def index():
#     return render_template('index.html')

# # Example usage
# if __name__ == '__main__':
#     liked_song = "Heaven Can Wait"
#     similar_songs = suggest_similar_songs(liked_song, data, features, model)
#     print(f"Songs similar to '{liked_song}':")
#     for song, artist, year in similar_songs:
#         print(f'{song} by {artist} ({year})')

#     # Run Flask app
#     app.run(debug=True, port=8080)