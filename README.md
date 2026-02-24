# Duo 2FA Testing Lab

A local sandbox app for testing [Duo Universal Prompt](https://duo.com/docs/duoweb-v4) two-factor authentication. Enter any username, get redirected to Duo's 2FA prompt, and inspect the full API response.

## Prerequisites

- Python 3.10+
- A Duo Security account with a **Web SDK** application configured in the [Duo Admin Panel](https://admin.duosecurity.com)

## Setup

1. Install dependencies:

   ```
   pip install -r requirements.txt
   ```

2. Create your config file:

   ```
   cp config.json.example config.json
   ```

3. Edit `config.json` with your Duo credentials from the Admin Panel:

   - `client_id` — Your Duo application's Client ID
   - `client_secret` — Your Duo application's Client Secret
   - `api_hostname` — Your Duo API hostname (e.g. `api-XXXXXXXX.duosecurity.com`)
   - `redirect_uri` — Leave as `http://localhost:8080/duo-callback`
   - `flask_secret_key` — Any random string

4. Run the app:

   ```
   python app.py
   ```

5. Open http://localhost:8080

## How it works

1. Enter any username and click **Continue to Duo 2FA**
2. Complete two-factor authentication on Duo's Universal Prompt
3. View the full authentication result and Duo API response

Password validation is bypassed. This is a testing tool, not a real login system.
