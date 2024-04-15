document.addEventListener('DOMContentLoaded', function () {
    var searchInput = document.getElementById('searchInput');
    var searchTableBody = document.getElementById('searchTableBody');

    // Listen for the form submission event
    document.getElementById('form').addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission

        var query = searchInput.value.toLowerCase().trim();
        if (query === '') {
            return; // Ignore empty queries
        }

        // Fetch the CSV file
        fetch('SongCSV.csv')
            .then(response => response.text())
            .then(csvData => {
                var lines = csvData.split('\n');
                var tableRows = '';

                // Iterate through each line of the CSV data
                lines.forEach(line => {
                    var cells = line.split(',');

                    // Check if the song title matches the query
                    if (cells[16].toLowerCase().includes(query)) { 
                        tableRows += '<tr>';
                        tableRows += '<td>' + cells[0] + '</td>'; 
                        tableRows += '<td>' + cells[16] + '</td>'; 
                        tableRows += '<td>' + cells[1] + '</td>'; 
                        tableRows += '<td>' + cells[3] + '</td>'; 
                        tableRows += '<td>' + cells[17] + '</td>'; 
                        tableRows += '</tr>';
                    }
                });

                // Populate the table body with the generated table rows
                searchTableBody.innerHTML = tableRows;
            })
            .catch(error => console.error('Error fetching CSV file:', error));
    });
});
