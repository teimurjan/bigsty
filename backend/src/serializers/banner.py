from src.models.banner import Banner
from src.serializers.intl import IntlSerializer


class BannerSerializer(IntlSerializer):
    def __init__(self, banner: Banner):
        super().__init__()
        self._id = banner.id
        self._texts = banner.texts
        self._link = banner.link
        self._image = banner.image

    def serialize(self):
        return self._filter_with_only_fields({
            'id': self._id,
            'text': self._serialize_text(),
            'link': self._link,
            'image': self._image,
        })

    def _serialize_text(self):
        return self._get_intl_field_from(self._texts)
