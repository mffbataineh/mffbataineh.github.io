#!/usr/bin/env python3
"""The hub page is now built for all children by kids-assets/build_hubs.py (edit the lesson list there)."""
import os, subprocess, sys
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
subprocess.run([sys.executable, os.path.join(root, "kids-assets", "build_hubs.py")], cwd=root, check=True)
