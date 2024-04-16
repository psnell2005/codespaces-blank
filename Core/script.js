document.addEventListener('DOMContentLoaded', function() {
    axios.get('/data')
        .then(function(response) {
            const data = response.data;
            const table = document.getElementById('dataTable');
            const headerRow = table.querySelector('thead tr');
            const tbody = table.querySelector('tbody');

            // Create table header
            data[0].forEach(function(column) {
                const th = document.createElement('th');
                th.textContent = column;
                headerRow.appendChild(th);
            });

            // Create table rows
            for (let i = 1; i < data.length; i++) {
                const row = data[i];
                const tr = document.createElement('tr');

                row.forEach(function(cell) {
                    const td = document.createElement('td');
                    td.textContent = cell;
                    tr.appendChild(td);
                });

                tbody.appendChild(tr);
            }
        })
        .catch(function(error) {
            console.error('Error fetching data:', error);
        });
});