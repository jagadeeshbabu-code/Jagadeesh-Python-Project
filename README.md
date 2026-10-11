# Jagadeesh Kitchen

A Django restaurant website with menu, cart, account, booking, and feedback pages.

## Deploy the app

GitHub Pages cannot run Django or its database. The GitHub Pages URL currently shows this repository's README; deploy the project as a Python web service instead.

This repository includes a Render Blueprint (`render.yaml`) for the Django web service and a PostgreSQL database. To deploy it:

1. Push this repository to GitHub.
2. Sign in to Render, choose **New → Blueprint**, and connect this GitHub repository.
3. Review the resources and any current plan charges, then apply the Blueprint.
4. When the service is live, open its `onrender.com` URL. Render will redeploy it on future pushes to the connected branch.
5. To add menu items and restaurant content, open `/admin/` on the live site. Create an administrator with `python manage.py createsuperuser` in a Render shell, then sign in to Django admin.

The first deploy creates the database schema and gathers static files. The database starts empty, so menu items, categories, about text, and feedback need to be entered in the admin. Set `GOOGLE_MAPS_API_KEY` in the Render service environment if the booking page uses Google Maps.

Uploaded images are stored on the web service filesystem by default. They are not included in the Blueprint's persistent database, so configure persistent file storage or object storage before relying on uploaded media across redeploys.

## Run locally

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Open `http://127.0.0.1:8000/`. For local development, set `DJANGO_DEBUG=True` in `.env` if needed.
