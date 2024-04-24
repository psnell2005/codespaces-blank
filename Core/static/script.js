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
        const searchTerm = `${song.Title} ${song.ArtistName}`;
        searchOnYouTube(searchTerm);
      });
      // Clear previous song info and append new song info
      songInfoContainer.innerHTML = '';
      songInfoContainer.appendChild(link);
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
          window.location.href = videoUrl;
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