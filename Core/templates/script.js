document.addEventListener('DOMContentLoaded', function() {
    // Fetch initial data
    fetchData();

    // Search form submission handler
    document.getElementById('form').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission behavior
        const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
        if (searchTerm) {
            searchSongs(searchTerm);
        } else {
            fetchData(); // If search term is empty, fetch all data
        }
    });
});

function fetchData() {
    axios.get('/data')
        .then(function(response) {
            renderTable(response.data);
        })
        .catch(function(error) {
            console.error('Error fetching data:', error);
        });
}

function searchSongs(searchTerm) {
    axios.get(`/search?term=${searchTerm}`)
        .then(function(response) {
            renderTable(response.data);
        })
        .catch(function(error) {
            console.error('Error searching songs:', error);
        });
}

function renderTable(data) {
    const table = document.getElementById('dataTable');
    const headerRow = table.querySelector('thead tr');
    const tbody = table.querySelector('tbody');

    // Clear existing table content
    headerRow.innerHTML = '';
    tbody.innerHTML = '';

    // Create table header
    Object.keys(data[0]).forEach(function(column) {
        const th = document.createElement('th');
        th.textContent = column;
        headerRow.appendChild(th);
    });

    // Create table rows
    data.forEach(function(row, index) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${index + 1}</td>`; // Row number
        Object.values(row).forEach(function(cell) {
            const td = document.createElement('td');
            td.textContent = cell;
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
}