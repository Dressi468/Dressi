## License
This project is licensed under the MIT License – see the LICENSE file for details.

Project Setup & Handover Guide

This guide explains how to get the project running locally, deployment notes, known issues, and admin setup.

1. Environment Variables

The app requires a .env file with the following keys. Set these either in your hosting environment or locally in a .env file.

Example for PowerShell (Windows):
$env:ADMIN_EMAIL="admin@admin.com"
# Add other environment variables as needed

These variables must be set before running the backend or frontend.

2. Running the Code Locally

Backend:

1. Open a terminal and go to the backend folder:
cd project-root/backend

2. Install Python dependencies:
pip install -r requirements.txt

3. Run the backend server:
python manage.py runserver

Frontend:

1. Open a terminal and go to the frontend folder:
cd project-root/frontend

2. Install Node.js dependencies:
npm install

3. If npm is outdated, update it:
npm install -g npm

4. Run the frontend in development mode:
npm run dev

3. Deployment Notes

- Ensure all environment variables are set in production.
- Update ALLOWED_HOSTS and CORS_ALLOWED_ORIGINS in settings.py for your domain.

4. Known Issues / Pending Improvements

Frontend:

- The website is not optimised for mobile, so layout may look uneven on phones.
- Minimal quiz questions can cause the AI to struggle to generate unique outfits. Adding more questions would help.
- Curated pages sometimes fail to load because AI generation was disabled per client request.

Backend:

- AI Generation Feature is disabled in deployment per client request.
- PUBLIC_URL_BASE (Cloudflare public dev URL) is not recommended for deployment. Switching to the correct URL method should be a priority for future teams.

Admin Page:

- Animations and UI layout are clunky. May need a design overhaul.
- Additional features may be required, e.g., editing entries instead of just viewing/deleting.

Admin Account:

- Refer to the .env file for ADMIN_EMAIL.
- Ensure the account has "role: admin" in MongoDB Atlas. The You can add this manually through the web interface by editing the entry.

The Default email is "admin@admin.com"