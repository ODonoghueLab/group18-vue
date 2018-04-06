"""
Runs Flask in development mode with threads and auto-reloading.
This is fine on a local-machine.

However, Flask cannot cope with multiple users and is very
slow at serving static files.

If you need to run in production, use `run_twisted`,
which runs Flask under Twisted, which can handle multiple users
and serves static files reasonably efficiently.
"""
from __future__ import print_function
from server import api, config
api.app.run(
    threaded=True,
    debug=False,
    port=int(config.PORT))