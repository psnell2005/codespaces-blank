d3.csv('SongCSV.csv').then(function (data){
    var songs = data;
    var button = d3.select('#button');
    var form = d3.select('#form');
    button.on('click', runEnter);
    form.on('submit', runEnter);

    function runEnter() {
        d3.select('tbody').html('') 
        d3.event.preventDefault(); 
        var inputValue = d3.select('#user-input').property('value');
        var filteredSongs = 
        songs.filter(songs => songs.artists.includes(inputValue));
        <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/lodash.js/0.10.0/lodash.min.js"></script>
        var output = _.sortBy(filteredSongs, 'avg_vote').reverse()
        for (var i = 0; i < filteredSongs.length; i++) {
        d3.select('tbody').insert('tr').html(
        '<td>' + [i+1] + '</td>' +
        '<td>' + (output[i]["song_title"])+'</a>'+'</td>' + 
        '<td>' + (output[i]["artist"])+'</td>' +
        '<td>' + (output[i]['year'])+'</td>' +
        '<td>' + (output[i]['album'])+"</td" ) }
        };
});

