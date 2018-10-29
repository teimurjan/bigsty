from api.dto.base import DTO


class FeatureTypeDTO(DTO):
    def __init__(self, id_, names):
        super().__init__(id_)
        self._names = names

    @property
    def names(self):
        return self._names
