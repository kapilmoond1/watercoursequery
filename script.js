// Global variables to store the loaded CSV data
let statusData = [];
let remodellingData = [];
let extensionData = [];
let applicationData = [];
let dataLoaded = false;

// Function to load all CSV files
async function loadAllData() {
    try {
        // Show loading spinner
        document.querySelector('.loading').style.display = 'block';
        
        // Load all CSV files in parallel
        const [statusResult, remodellingResult, extensionResult, applicationResult] = await Promise.all([
            loadCSV('Narwana Office Documents/status_of_works.csv'),
            loadCSV('Narwana Office Documents/remodelling_list.csv'),
            loadCSV('Narwana Office Documents/extension_katcha_list.csv'),
            loadCSV('Narwana Office Documents/new_application.csv')
        ]);
        
        // Store the data
        statusData = statusResult.data;
        remodellingData = remodellingResult.data;
        extensionData = extensionResult.data;
        applicationData = applicationResult.data;
        
        dataLoaded = true;
        
        // Hide loading spinner
        document.querySelector('.loading').style.display = 'none';
        
        console.log('All data loaded successfully');
        return true;
    } catch (error) {
        console.error('Error loading data:', error);
        document.querySelector('.loading').style.display = 'none';
        alert('Error loading data. Please try again later.');
        return false;
    }
}

// Function to load a single CSV file
async function loadCSV(filePath) {
    return new Promise((resolve, reject) => {
        Papa.parse(filePath, {
            download: true,
            header: true,
            skipEmptyLines: true,
            complete: function(results) {
                resolve(results);
            },
            error: function(error) {
                reject(error);
            }
        });
    });
}

// Function to search across all datasets
function searchData(searchType, searchQuery) {
    if (!dataLoaded) {
        alert('Data is still loading. Please try again in a moment.');
        return null;
    }
    
    // Convert search query to lowercase for case-insensitive matching
    const query = searchQuery.toLowerCase();
    
    // Define field mappings for each dataset
    const fieldMappings = {
        rd: {
            status: 'Name of Works RD',
            remodelling: 'RD of Watercourse and Name of Channel',
            extension: 'RD of watercourse',
            application: 'Name of Work'
        },
        village: {
            status: 'Name of Village',
            remodelling: 'Name of Village',
            extension: 'Name of Village',
            application: 'BENIFICIERY Village'
        },
        channel: {
            status: 'Name of Works RD',  // Contains both RD and channel name
            remodelling: 'RD of Watercourse and Name of Channel',
            extension: 'Name of channel',
            application: 'Name of Work'
        },
        constituency: {
            status: 'Consitiuency',
            remodelling: 'Name of Constituency',
            extension: 'Name of constituen cy',
            application: '' // Not available in application data
        }
    };
    
    // Search in each dataset
    const statusResults = searchInDataset(statusData, fieldMappings[searchType].status, query);
    const remodellingResults = searchInDataset(remodellingData, fieldMappings[searchType].remodelling, query);
    const extensionResults = searchInDataset(extensionData, fieldMappings[searchType].extension, query);
    const applicationResults = searchInDataset(applicationData, fieldMappings[searchType].application, query);
    
    return {
        status: statusResults,
        remodelling: remodellingResults,
        extension: extensionResults,
        application: applicationResults,
        all: [...statusResults, ...remodellingResults, ...extensionResults, ...applicationResults]
    };
}

// Function to search in a specific dataset
function searchInDataset(dataset, fieldName, query) {
    if (!fieldName) return [];
    
    return dataset.filter(item => {
        // Check if the field exists in the item
        if (!item[fieldName]) return false;
        
        // Convert field value to lowercase for case-insensitive matching
        const fieldValue = item[fieldName].toLowerCase();
        
        // Check if the field value contains the query
        return fieldValue.includes(query);
    });
}

// Function to create a table from data
function createTable(data, type) {
    if (!data || data.length === 0) {
        return '<p>No results found.</p>';
    }
    
    // Get headers from the first item
    const headers = Object.keys(data[0]);
    
    // Create table HTML
    let tableHTML = '<div class="table-responsive"><table class="table table-striped result-table">';
    
    // Add header row
    tableHTML += '<thead><tr>';
    headers.forEach(header => {
        tableHTML += `<th>${header}</th>`;
    });
    tableHTML += '</tr></thead>';
    
    // Add data rows
    tableHTML += '<tbody>';
    data.forEach(item => {
        tableHTML += '<tr>';
        headers.forEach(header => {
            tableHTML += `<td>${item[header] || ''}</td>`;
        });
        tableHTML += '</tr>';
    });
    tableHTML += '</tbody>';
    
    tableHTML += '</table></div>';
    
    return tableHTML;
}

// Event listener for search form submission
document.getElementById('searchForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const searchType = document.getElementById('searchType').value;
    const searchQuery = document.getElementById('searchQuery').value.trim();
    
    if (!searchQuery) {
        alert('Please enter a search term.');
        return;
    }
    
    // Show loading spinner
    document.querySelector('.loading').style.display = 'block';
    
    // Load data if not already loaded
    if (!dataLoaded) {
        const loaded = await loadAllData();
        if (!loaded) return;
    }
    
    // Perform search
    const results = searchData(searchType, searchQuery);
    
    // Hide loading spinner
    document.querySelector('.loading').style.display = 'none';
    
    // Display results
    document.getElementById('allResults').innerHTML = createTable(results.all, 'all');
    document.getElementById('statusResults').innerHTML = createTable(results.status, 'status');
    document.getElementById('remodellingResults').innerHTML = createTable(results.remodelling, 'remodelling');
    document.getElementById('extensionResults').innerHTML = createTable(results.extension, 'extension');
    document.getElementById('applicationResults').innerHTML = createTable(results.application, 'application');
    
    // Show result container
    document.getElementById('resultContainer').style.display = 'block';
    
    // Update tab counts
    updateTabCounts(results);
});

// Function to update tab counts
function updateTabCounts(results) {
    document.getElementById('all-tab').textContent = `All Results (${results.all.length})`;
    document.getElementById('status-tab').textContent = `Status of Works (${results.status.length})`;
    document.getElementById('remodelling-tab').textContent = `Remodelling List (${results.remodelling.length})`;
    document.getElementById('extension-tab').textContent = `Extension List (${results.extension.length})`;
    document.getElementById('application-tab').textContent = `New Applications (${results.application.length})`;
}

// Event listener for reset button
document.querySelector('button[type="reset"]').addEventListener('click', function() {
    document.getElementById('resultContainer').style.display = 'none';
});

// Load data when the page loads
window.addEventListener('DOMContentLoaded', function() {
    // Start loading data in the background
    loadAllData();
});