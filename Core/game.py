from difflib import SequenceMatcher
import pandas as pd

# Load the song database from the provided CSV file
song_data = pd.read_csv('SongCSV.csv')

def similar(a, b):
    return SequenceMatcher(None, a, b).ratio()

def calculate_similarity(song1, song2):
    # Calculate similarity based on multiple attributes
    title_similarity = similar(song1['Title'], song2['Title'])
    artist_similarity = similar(song1['ArtistName'], song2['ArtistName'])
    year_similarity = 1 if song1['Year'] == song2['Year'] else 0  # 1 if same year, 0 otherwise
    tempo_similarity = similar(str(song1['Tempo']), str(song2['Tempo']))
    danceability_similarity = similar(str(song1['Danceability']), str(song2['Danceability']))
    time_signature_similarity = 1 if song1['TimeSignature'] == song2['TimeSignature'] else 0  # 1 if same time signature, 0 otherwise
    key_signature_similarity = 1 if song1['KeySignature'] == song2['KeySignature'] else 0  # 1 if same key signature, 0 otherwise

    # Aggregate similarities (you can adjust weights for each attribute as needed)
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

def main():
    # Read user input for favorite songs
    user_input = input("Enter your favorite songs (separated by commas): ")
    user_songs = [song.strip() for song in user_input.split(',')]

    # Convert user input songs to DataFrame for easier comparison
    user_song_data = pd.DataFrame([{'Title': song} for song in user_songs])

    # Generate recommendation based on user's favorite songs
    recommendation = generate_recommendation(user_song_data, song_data)
    print("Recommended song:", recommendation)

if __name__ == '__main__':
    main()