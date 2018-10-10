from api.dto.base import DTO


class LanguageDTO(DTO):
    def __init__(self, id_, name):
        super().__init__(id_)
        self._name = name

    @property
    def name(self):
        return self._name
