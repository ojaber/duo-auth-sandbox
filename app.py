import json
import os

from flask import (
    Flask,
    jsonify,
    redirect,
    render_template,
    request,
    session,
    url_for,
)

import duo_universal

app = Flask(__name__)

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

config_error = None
duo_client = None

CONFIG_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "config.json")
REQUIRED_KEYS = ["client_id", "client_secret", "api_hostname", "redirect_uri", "flask_secret_key"]
PLACEHOLDER_VALUES = {
    "client_id": "DIXXXXXXXXXXXXXXXXXX",
    "client_secret": "your-duo-client-secret-here",
    "api_hostname": "api-XXXXXXXX.duosecurity.com",
    "flask_secret_key": "change-me-to-a-random-secret-string",
}

try:
    with open(CONFIG_PATH) as f:
        config = json.load(f)

    missing = [k for k in REQUIRED_KEYS if k not in config or not config[k]]
    if missing:
        config_error = f"Missing required config keys: {', '.join(missing)}. Please edit config.json."
    else:
        unchanged = [k for k, v in PLACEHOLDER_VALUES.items() if config.get(k) == v]
        if unchanged:
            config_error = (
                f"Placeholder values detected in config.json for: {', '.join(unchanged)}. "
                "Please replace them with your real Duo credentials from the Duo Admin Panel."
            )
        else:
            app.secret_key = config["flask_secret_key"]
            duo_client = duo_universal.Client(
                client_id=config["client_id"],
                client_secret=config["client_secret"],
                host=config["api_hostname"],
                redirect_uri=config["redirect_uri"],
            )

except FileNotFoundError:
    config_error = "config.json not found. Please create it from the template."
except json.JSONDecodeError:
    config_error = "config.json contains invalid JSON. Please fix the syntax."
except Exception as e:
    config_error = f"Failed to initialize Duo client: {e}"

if app.secret_key is None:
    app.secret_key = "fallback-for-error-display-only"

# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------


@app.route("/")
def index():
    if config_error:
        return render_template("error.html", error=config_error), 500
    if session.get("authenticated_user"):
        return redirect(url_for("auth_result"))
    return render_template("login.html")


@app.route("/login", methods=["POST"])
def login():
    if config_error:
        return render_template("error.html", error=config_error), 500

    username = request.form.get("username", "").strip()
    if not username:
        return render_template("login.html", error="Username is required.")

    try:
        duo_client.health_check()
    except Exception as e:
        return render_template(
            "login.html",
            error=f"Duo health check failed: {e}",
            username=username,
        )

    state = duo_client.generate_state()
    session["duo_state"] = state
    session["duo_username"] = username

    auth_url = duo_client.create_auth_url(username, state)
    return redirect(auth_url)


@app.route("/duo-callback")
def duo_callback():
    if config_error:
        return render_template("error.html", error=config_error), 500

    duo_code = request.args.get("duo_code")
    state = request.args.get("state")

    if not duo_code or not state:
        return render_template(
            "error.html",
            error="Missing parameters from Duo. Please try logging in again.",
        ), 400

    saved_state = session.get("duo_state")
    if not saved_state or state != saved_state:
        return render_template(
            "error.html",
            error="State mismatch — possible CSRF attack. Please try logging in again.",
        ), 403

    username = session.get("duo_username")

    try:
        result = duo_client.exchange_authorization_code_for_2fa_result(duo_code, username)
    except Exception as e:
        return render_template(
            "error.html",
            error=f"Duo authentication failed: {e}",
        ), 401

    # Clear interim Duo session data
    session.pop("duo_state", None)
    session.pop("duo_username", None)

    # Set authenticated session
    session["authenticated_user"] = username
    session["auth_result"] = result if isinstance(result, dict) else {"raw": str(result)}

    return redirect(url_for("auth_result"))


@app.route("/auth-result")
def auth_result():
    if config_error:
        return render_template("error.html", error=config_error), 500

    user = session.get("authenticated_user")
    if not user:
        return redirect(url_for("index"))

    return render_template(
        "auth_result.html",
        user=user,
        auth_result=session.get("auth_result"),
    )


@app.route("/api/health")
def api_health():
    if config_error or duo_client is None:
        return jsonify({"status": "error", "message": config_error or "Duo client not initialized"}), 503
    try:
        duo_client.health_check()
        return jsonify({"status": "ok"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 503


@app.route("/logout", methods=["POST"])
def logout():
    session.clear()
    return redirect(url_for("index"))


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    app.run(debug=True, port=8080)
