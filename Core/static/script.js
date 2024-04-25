document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form');
    const searchInput = document.getElementById('searchInput');
    const searchTableBody = document.getElementById('searchTableBody');
    const songInfoContainer = document.getElementById('songInfoContainer');
    
    var apiKey = 'AIzaSyClloF0D3qkEsd9yeCNtp_jAZ6GidZ_y2U';
    gapi.load('client', function() {
      gapi.client.init({
          'apiKey': apiKey,
          'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest']
      }).then(function() {
          console.log('Google API client library and YouTube Data API initialized');
      }).catch(function(error) {
          console.error('Error initializing Google API client library and YouTube Data API:', error);
      });
  });

  form.addEventListener('submit', function(event) {
      event.preventDefault();
      const searchTerm = searchInput.value.trim();
      console.log("Search term:", searchTerm);
      const similarSongsContainer = document.getElementById('similarSongsContainer');
      similarSongsContainer.innerHTML = '';
      const songInfoContainer = document.getElementById('songInfoContainer')
      songInfoContainer.innerHTML = '';
      const searchYouTubeBtn = document.getElementById('searchYouTubeBtn');
        searchYouTubeBtn.style.display = 'none';
        searchYouTubeBtn.onclick = null;
      axios.get('/search', { params: { term: searchTerm } })
          .then(function(response) {
              const searchResults = response.data;
              console.log("Search results:", searchResults);
              if (Array.isArray(searchResults)) {
                  updateSearchTable(searchResults);
              } else {
                  console.error('Search results are not an array:', searchResults);
                  updateSearchTable([]); 
              }
          })
          .catch(function(error) {
              console.error('Error searching songs:', error);
          });
  });

  function updateSearchTable(results) {
    // Clear previous count element
    const countElement = searchTableBody.previousElementSibling;
    if (countElement && countElement.tagName.toLowerCase() === 'div') {
        countElement.remove();
    }

    const resultCount = results.length;
    const countText = `Number of results: ${resultCount}`;
    const newCountElement = document.createElement('div');
    newCountElement.textContent = countText;
    searchTableBody.parentNode.insertBefore(newCountElement, searchTableBody);

    // Clear previous search results
    searchTableBody.innerHTML = '';

    results.forEach(function(song, index) {
        const row = document.createElement('tr');
        row.style.cursor = 'pointer';
        row.addEventListener('click', function() {
            displaySongInfo(song);
        });

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
}

  function displaySongInfo(song) {
      const title = `${song.Title} by ${song.ArtistName}`;
      const link = document.createElement('a');
      link.textContent = title;
      link.href = '#'; 
      link.addEventListener('click', function(event) {
          event.preventDefault();
          getSimilarSongs(song.Title);
          const searchYouTubeBtn = document.getElementById('searchYouTubeBtn');
            searchYouTubeBtn.style.display = 'inline-block';
            searchYouTubeBtn.onclick = function() {
                const searchTerm = `${song.Title} ${song.ArtistName}`;
                searchOnYouTube(searchTerm);
            };
      });
      // Clear previous song info and append new song info
      songInfoContainer.innerHTML = '';
      songInfoContainer.appendChild(link);
  }

  function getSimilarSongs(likedSong) {
      console.log('Getting similar songs for:', likedSong);
      axios.post('/get_similar_songs', { likedSong })
          .then(function(response) {
              const similarSongs = response.data;
              console.log("Response from server:", response);
              console.log("Similar songs:", similarSongs);
              updateSimilarSongsUI(similarSongs);
          })
          .catch(function(error) {
              console.error('Error getting similar songs:', error);
          });
  }

  function updateSimilarSongsUI(similarSongs) {
      console.log('Updating UI with similar songs:', similarSongs);
      // Clear previous similar songs
      const similarSongsContainer = document.getElementById('similarSongsContainer');
      similarSongsContainer.innerHTML = '';
      if (similarSongs.length > 0 ) {
        
          // Create and append similar songs elements
          const similarSongsTable = document.createElement('table');
          similarSongsTable.classList.add('table');

          const tableHead = document.createElement('thead');
          const headRow = document.createElement('tr');
          const titleHeader = document.createElement('th');
          titleHeader.textContent = 'Title';
          const artistHeader = document.createElement('th');
          artistHeader.textContent = 'Artist';
          const yearHeader = document.createElement('th');
          yearHeader.textContent = 'Year';
          headRow.appendChild(titleHeader);
          headRow.appendChild(artistHeader);
          headRow.appendChild(yearHeader);
          tableHead.appendChild(headRow);
          similarSongsTable.appendChild(tableHead);

          const tableBody = document.createElement('tbody');
          similarSongs.forEach(function(song) {
              const row = document.createElement('tr');
              row.style.cursor = 'pointer';
              row.addEventListener('click', function() {
                  const searchTerm = `${song.title} ${song.artist}`;
                  searchOnYouTube(searchTerm);
              });
              const titleCell = document.createElement('td');
              titleCell.textContent = song.title;
              const artistCell = document.createElement('td');
              artistCell.textContent = song.artist;
              const yearCell = document.createElement('td');
              yearCell.textContent = song.year;
              row.appendChild(titleCell);
              row.appendChild(artistCell);
              row.appendChild(yearCell);
              tableBody.appendChild(row);
          });
          similarSongsTable.appendChild(tableBody);
          similarSongsContainer.appendChild(similarSongsTable);
      } else {
          const noSongsMessage = document.createElement('p');
          noSongsMessage.textContent = 'No similar songs found.';
          similarSongsContainer.appendChild(noSongsMessage);
      }
  }


  function searchOnYouTube(searchTerm) {
      gapi.client.youtube.search.list({
          q: searchTerm,
          part: 'snippet'
      }).then(function(response) {
          const searchResult = response.result;
          if (searchResult.items.length > 0) {
              const firstVideo = searchResult.items[0];
              const videoUrl = `https://www.youtube.com/watch?v=${firstVideo.id.videoId}`;
              window.open(videoUrl, '_blank');
          } else {
              console.error('No videos found for the search term:', searchTerm);
          }
      }).catch(function(error) {
          console.error('Error searching YouTube:', error);
      });
  }

  $('#btnSearch').on('click', function() {
      $('#first-video-title').text("")
  });
});