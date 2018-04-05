import os
import shutil

this_dir = os.path.dirname(__file__)

config_filename = os.path.join(this_dir, "config.py")
default_config_filename = os.path.join(this_dir, "config_default.py")
if not os.path.isfile(config_filename):
    shutil.copy(default_config_filename, config_filename)
