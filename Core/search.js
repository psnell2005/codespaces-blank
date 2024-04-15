document.addEventListener('DOMContentLoaded', function () {
    var searchInput = document.getElementById('searchInput');
    var searchResults = document.getElementById('searchResults');

    searchInput.addEventListener('input', function () {
        var query = searchInput.value.toLowerCase();
        searchSongs(query);
    });

    function searchSongs(query) {
        // Fetch the CSV file using Fetch API
        fetch('SongCSV.csv')
            .then(response => response.text())
            .then(csvData => {
                // Parse CSV data
                var lines = csvData.split('\n');
                var songs = lines.map(line => line.split(','));

    
                var songTitles = songs[16];

                // Filter song titles based on query
                var matchingSongs = songTitles.filter(title => title.toLowerCase().includes(query));

                // Display matching songs
                displayResults(matchingSongs);
            })
            .catch(error => console.error('Error fetching CSV file:', error));
    }

    function displayResults(songs) {
        // Clear previous search results
        searchResults.innerHTML = '';

        // Display each matching song
        songs.forEach(song => {
            var listItem = document.createElement('li');
            listItem.textContent = song;
            searchResults.appendChild(listItem);
        });
    }
});

