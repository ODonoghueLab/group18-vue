import os
import shutil

this_dir = os.path.dirname(__file__)

config_filename = os.path.join(this_dir, "config.py")

if not os.path.isfile(config_filename):
    default_config_filename = os.path.join(this_dir, "config_default.py")
    shutil.copy(default_config_filename, config_filename)
