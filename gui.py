import os
import sys
from subprocess import call
os.chdir('pyserver')
call([sys.executable, "run_client_server.py"])

