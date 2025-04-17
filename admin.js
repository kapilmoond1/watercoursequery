// Admin credentials (in a real application, this would be handled server-side)
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'micad2024';

// File paths
const FILE_PATHS = {
    status: 'Narwana Office Documents/status_of_works.csv',
    remodelling: 'Narwana Office Documents/remodelling_list.csv',
    extension: 'Narwana Office Documents/extension_katcha_list.csv',
    application: 'Narwana Office Documents/new_application.csv'
};

// DOM Elements
const loginSection = document.getElementById('loginSection');
const adminDashboard = document.getElementById('adminDashboard');
const loginForm = document.getElementById('loginForm');
const logoutBtn = document.getElementById('logoutBtn');

// File upload forms
const statusUploadForm = document.getElementById('statusUploadForm');
const remodellingUploadForm = document.getElementById('remodellingUploadForm');
const extensionUploadForm = document.getElementById('extensionUploadForm');
const applicationUploadForm = document.getElementById('applicationUploadForm');

// File preview containers
const statusPreview = document.getElementById('statusPreview');
const remodellingPreview = document.getElementById('remodellingPreview');
const extensionPreview = document.getElementById('extensionPreview');
const applicationPreview = document.getElementById('applicationPreview');

// Check if user is already logged in
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    if (isLoggedIn) {
        showAdminDashboard();
    } else {
        showLoginForm();
    }
}

// Show login form
function showLoginForm() {
    loginSection.classList.remove('hidden');
    adminDashboard.classList.add('hidden');
}

// Show admin dashboard
function showAdminDashboard() {
    loginSection.classList.add('hidden');
    adminDashboard.classList.remove('hidden');
    
    // Load file previews
    loadFilePreviews();
}

// Handle login form submission
loginForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        // Set login status in localStorage
        localStorage.setItem('adminLoggedIn', 'true');
        showAdminDashboard();
    } else {
        alert('Invalid username or password. Please try again.');
    }
});

// Handle logout
logoutBtn.addEventListener('click', function() {
    localStorage.removeItem('adminLoggedIn');
    showLoginForm();
});

// Load file previews
async function loadFilePreviews() {
    try {
        // Load previews for each file
        await loadFilePreview(FILE_PATHS.status, statusPreview);
        await loadFilePreview(FILE_PATHS.remodelling, remodellingPreview);
        await loadFilePreview(FILE_PATHS.extension, extensionPreview);
        await loadFilePreview(FILE_PATHS.application, applicationPreview);
    } catch (error) {
        console.error('Error loading file previews:', error);
    }
}

// Load preview for a specific file
async function loadFilePreview(filePath, previewElement) {
    return new Promise((resolve, reject) => {
        Papa.parse(filePath, {
            download: true,
            header: true,
            skipEmptyLines: true,
            preview: 5, // Show only first 5 rows
            complete: function(results) {
                if (results.data && results.data.length > 0) {
                    // Create table from data
                    const tableHTML = createTableFromData(results.data, results.meta.fields);
                    previewElement.innerHTML = tableHTML;
                } else {
                    previewElement.innerHTML = '<p>No data available or file not found.</p>';
                }
                resolve();
            },
            error: function(error) {
                previewElement.innerHTML = `<p class="text-danger">Error loading file: ${error.message}</p>`;
                reject(error);
            }
        });
    });
}

// Create table from data
function createTableFromData(data, headers) {
    if (!data || data.length === 0) {
        return '<p>No data available.</p>';
    }
    
    let tableHTML = '<table class="table table-striped table-bordered">';
    
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
    
    tableHTML += '</table>';
    
    return tableHTML;
}

// Handle file upload forms
statusUploadForm.addEventListener('submit', function(event) {
    event.preventDefault();
    handleFileUpload('status', document.getElementById('statusFile'), statusPreview);
});

remodellingUploadForm.addEventListener('submit', function(event) {
    event.preventDefault();
    handleFileUpload('remodelling', document.getElementById('remodellingFile'), remodellingPreview);
});

extensionUploadForm.addEventListener('submit', function(event) {
    event.preventDefault();
    handleFileUpload('extension', document.getElementById('extensionFile'), extensionPreview);
});

applicationUploadForm.addEventListener('submit', function(event) {
    event.preventDefault();
    handleFileUpload('application', document.getElementById('applicationFile'), applicationPreview);
});

// Handle file upload
function handleFileUpload(fileType, fileInput, previewElement) {
    if (!fileInput.files || fileInput.files.length === 0) {
        alert('Please select a file to upload.');
        return;
    }
    
    const file = fileInput.files[0];
    
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        alert('Please upload a CSV file.');
        return;
    }
    
    // In a real application, this would upload the file to a server
    // For this demo, we'll just parse and preview the file
    Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
            if (results.data && results.data.length > 0) {
                // Create table from data
                const tableHTML = createTableFromData(results.data, results.meta.fields);
                previewElement.innerHTML = tableHTML;
                
                // Show success message
                alert(`File uploaded successfully. In a real application, this would replace the existing ${fileType} file.`);
            } else {
                previewElement.innerHTML = '<p>No data available in the uploaded file.</p>';
            }
        },
        error: function(error) {
            previewElement.innerHTML = `<p class="text-danger">Error parsing file: ${error.message}</p>`;
            alert('Error parsing the CSV file. Please check the file format and try again.');
        }
    });
    
    // Reset file input
    fileInput.value = '';
}

// Initialize the admin panel
window.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
});