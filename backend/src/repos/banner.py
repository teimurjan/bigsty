from sqlalchemy.orm import joinedload

from src.storage.base import Storage
from src.models import Banner, BannerText
from src.repos.base import IntlRepo, with_session


class BannerRepo(IntlRepo):
    def __init__(self, db_conn, file_storage: Storage):
        super().__init__(db_conn, Banner)
        self.__file_storage = file_storage

    @with_session
    def add_banner(
        self,
        texts,
        link,
        image,
        session
    ):
        banner = Banner()

        self._add_intl_texts(texts, banner, 'texts', BannerText)

        banner.link = link

        banner.image = self.__file_storage.save_file(image)

        session.add(banner)

        session.flush()

        return banner

    @with_session
    def update_banner(
        self,
        id_,
        texts,
        link,
        image,
        session
    ):
        banner = self.get_by_id(id_, session=session)

        self._update_intl_texts(texts, banner, 'texts', BannerText)

        banner.link = link

        if image is not None:
            banner.image = (image
                            if isinstance(image, str)
                            else self.__file_storage.save_file(image))

        return banner

    class DoesNotExist(Exception):
        pass
