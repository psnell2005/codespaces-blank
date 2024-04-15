// d3.csv('SongCSV.csv').then(function (data) {
//     var songs = data;
//     var button = d3.select('#button');
//     var form = d3.select('#form');

//     button.on('click', runEnter);
//     form.on('submit', function(event) {
//         event.preventDefault();  
//         runEnter();
//     });

//     function runEnter() {
//         d3.select('tbody').html(''); 

//         var inputValue = d3.select('#user-input').property('value');
//         var filteredSongs = songs.filter(song => song.artists.includes(inputValue));
        
//         var output = _.sortBy(filteredSongs, 'avg_vote').reverse();

//         for (var i = 0; i < filteredSongs.length; i++) {
//             d3.select('tbody').append('tr').html(
//                 '<td>' + (i+1) + '</td>' +
//                 '<td>' + (output[i].song_title) + '</td>' +
//                 '<td>' + (output[i].artist) + '</td>' +
//                 '<td>' + (output[i].year) + '</td>' +
//                 '<td>' + (output[i].album) + '</td>' 
//             );
//         }
//     }
// });

