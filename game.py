from difflib import SequenceMatcher

# Dummy song database (replace with a real database in a real application)
song_database = [
    {"title": "Song 1", "artist": "Artist 1"},
    {"title": "Song 2", "artist": "Artist 2"},
    {"title": "Song 3", "artist": "Artist 3"},
    # Add more songs here...
]

def similar(a, b):
    return SequenceMatcher(None, a, b).ratio()

def generate_recommendation(user_songs):
    if not user_songs:
        return "No favorite songs provided"

    max_similarity = 0
    recommended_song = None

    for song in song_database:
        for user_song in user_songs:
            similarity = similar(song['title'], user_song)
            if similarity > max_similarity:
                max_similarity = similarity
                recommended_song = song['title']

    return recommended_song

def main():
    # Read user input for favorite songs
    user_input = input("Enter your favorite songs (separated by commas): ")
    user_songs = [song.strip() for song in user_input.split(',')]

    # Generate recommendation based on user's favorite songs
    recommendation = generate_recommendation(user_songs)
    print("Recommended song:", recommendation)

if __name__ == '__main__':
    main()