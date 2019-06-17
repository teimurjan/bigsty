import os
import hashlib
import uuid

from werkzeug.utils import secure_filename

from paths import BASE_DIR

class FileStorage:
    def __init__(self, path):
        self.__path = path

    def save_file(self, file):
        filename = secure_filename(f'{uuid.uuid4().hex}_{file.filename}')
        file.save(os.path.join(BASE_DIR, self.__path, filename))
        return f'/{os.path.join(self.__path, filename)}'
