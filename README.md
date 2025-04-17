# MICAD Narwana Website

This repository contains the source code for the MICAD Narwana office website.

## Mobile Friendliness

The website uses the Bootstrap framework, which makes it responsive and generally mobile-friendly across different screen sizes.

## Deployment to GitHub Pages

GitHub Pages is a suitable platform for hosting this static website for free.

1.  **Create a GitHub Repository:** Create a new public repository on GitHub (e.g., `micad-narwana-website`).
2.  **Push Files:** Add all the project files (`index.html`, `admin.html`, `script.js`, `admin.js`, and the `Narwana Office Documents` folder) to the repository and push them.
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    git branch -M main
    git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
    git push -u origin main
    ```
    Replace `YOUR_USERNAME` and `YOUR_REPOSITORY_NAME` with your actual GitHub username and repository name.
3.  **Enable GitHub Pages:**
    *   Go to your repository settings on GitHub.
    *   Navigate to the "Pages" section.
    *   Under "Build and deployment", select "Deploy from a branch" as the source.
    *   Choose the `main` branch and the `/ (root)` folder.
    *   Click "Save".
    *   Your site will be available at `https://YOUR_USERNAME.github.io/YOUR_REPOSITORY_NAME/` after a few minutes.

## Important Limitation: Admin Functionality

GitHub Pages hosts static websites. This means server-side code or dynamic file uploads **cannot** run directly on GitHub Pages.

*   **File Uploads:** The file upload functionality in `admin.html` (for `new_application.csv`, `remodelling_list.csv`, `status_of_works.csv`, `extension_katcha_list.csv`) **will not work** when the site is hosted on GitHub Pages.
*   **Updating Data:** To update the data displayed on the website (e.g., the lists from the CSV files), you need to:
    1.  Modify the CSV files in the `Narwana Office Documents` folder locally.
    2.  Commit the updated CSV files to your GitHub repository.
    3.  Push the changes to the `main` branch.
    GitHub Pages will automatically rebuild and deploy the site with the updated data.

## Local Development

To run the website locally, you can use a simple HTTP server. If you have Python installed:

```bash
python -m http.server
```

Then open `http://localhost:8000` (or the port specified by the server) in your web browser. The admin file upload will work in this local environment because it interacts with the local filesystem via JavaScript's File API, but the changes are *not* persisted automatically for deployment.