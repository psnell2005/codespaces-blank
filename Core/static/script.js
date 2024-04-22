document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form');
    const searchInput = document.getElementById('searchInput');
    const searchTableBody = document.getElementById('searchTableBody');

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const searchTerm = searchInput.value.trim();
        console.log("Search term:", searchTerm);

        axios.get('/search', {
            params: {
                term: searchTerm
            }
        })
        .then(function(response) {
            const searchResults = response.data;
            console.log("Search results:", searchResults);
            if (Array.isArray(searchResults)) {
                updateSearchTable(searchResults);
            } else {
                console.error('Search results are not an array:', searchResults);
                updateSearchTable([]); // Pass an empty array to clear the table
            }
        })
        .catch(function(error) {
            console.error('Error searching songs:', error);
        });
    });


    function updateSearchTable(results) {
        searchTableBody.innerHTML = '';
      
        // Check if the results are an array
        if (Array.isArray(results)) {
          // If it's an array, process it as before
          results.forEach(function(song, index) {
            const row = document.createElement('tr');
            const indexCell = document.createElement('td');
            indexCell.textContent = index + 1;
            row.appendChild(indexCell);
            const titleCell = document.createElement('td');
            titleCell.textContent = song.Title;
            row.appendChild(titleCell);
            const artistCell = document.createElement('td');
            artistCell.textContent = song.ArtistName;
            row.appendChild(artistCell);
            const albumCell = document.createElement('td');
            albumCell.textContent = song.AlbumName;
            row.appendChild(albumCell);
            const yearCell = document.createElement('td');
            yearCell.textContent = song.Year;
            row.appendChild(yearCell);
            searchTableBody.appendChild(row);
          });
        } else {
          // If it's not an array, treat it as a single object
          const song = results;
          const row = document.createElement('tr');
          const indexCell = document.createElement('td');
          indexCell.textContent = '1';
          row.appendChild(indexCell);
          const titleCell = document.createElement('td');
          titleCell.textContent = song.Title;
          row.appendChild(titleCell);
          const artistCell = document.createElement('td');
          artistCell.textContent = song.ArtistName;
          row.appendChild(artistCell);
          const albumCell = document.createElement('td');
          albumCell.textContent = song.AlbumName;
          row.appendChild(albumCell);
          const yearCell = document.createElement('td');
          yearCell.textContent = song.Year;
          row.appendChild(yearCell);
          searchTableBody.appendChild(row);
        }
      }
});