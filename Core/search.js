document.addEventListener('DOMContentLoaded', function () {
    var searchInput = document.getElementById('searchInput');
    var searchResults = document.getElementById('searchResults');
    var searchForm = document.getElementById('form'); // Get the form element

    // Listen for the "submit" event of the form
    searchForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission

        var query = searchInput.value.toLowerCase();
        searchSongs(query);
    });

    function searchSongs(query) {
        fetch('SongCSV.csv')
            .then(response => response.text())
            .then(csvData => {
                var lines = csvData.split('\n');
                var songs = lines.map(line => line.split(','));

                var songTitles = songs.map(row => row[16]); 

                var matchingSongs = songTitles.filter(title => title.toLowerCase().includes(query));

                displayResults(matchingSongs);
            })
            .catch(error => console.error('Error fetching CSV file:', error));
    }

    function displayResults(songs) {
        searchResults.innerHTML = '';

        songs.forEach(song => {
            var listItem = document.createElement('li');
            listItem.textContent = song;
            searchResults.appendChild(listItem);
        });
    }
});

