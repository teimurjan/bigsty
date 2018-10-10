from api.dto.base import DTO


class UserDTO(DTO):
    def __init__(self, id_, email, name, date_joined, password, group, is_active):
        super().__init__(id_)
        self._email = email
        self._name = name
        self._date_joined = date_joined
        self._password = password
        self._group = group
        self._is_active = is_active

    @property
    def email(self):
        return self._email

    @property
    def name(self):
        return self._name

    @property
    def date_joined(self):
        return self._date_joined

    @property
    def password(self):
        return self._password

    @property
    def group(self):
        return self._group

    @property
    def is_active(self):
        return self._is_active
