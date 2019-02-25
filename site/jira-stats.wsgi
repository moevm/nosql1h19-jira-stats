#!/usr/bin/python3
import sys
import os
import logging

sys.path.insert(0, os.path.dirname(os.path.realpath(__file__)))

# set all errors output to stderr
logging.basicConfig(stream=sys.stderr)

from manage import app as application
