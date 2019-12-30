import os
from shutil import copyfile

from flask_script import Manager

from src.factories.app import AppFactory

app = AppFactory.create()

manager = Manager(app)

if __name__ == '__main__':
    manager.run()
