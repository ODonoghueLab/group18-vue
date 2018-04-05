"""
Runs Flask in development mode with threads and auto-reloading.
This is fine on a local-machine.

However, Flask cannot cope with multiple users and is very
slow at serving static files.

If you need to run in production, use `run_twisted`,
which runs Flask under Twisted, which can handle multiple users
and serves static files reasonably efficiently.
"""
import os
import shutil

if not os.path.isfile("server/config.py"):
    shutil.copy("server/config_default.py", "server/config.py")

from server.api import app
from server import config

app.run(
    threaded=True,
    use_reloader=True,
    debug=True,
    use_debugger=False,
    port=int(config.PORT))
