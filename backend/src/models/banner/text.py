from sqlalchemy import Column, String, Integer, ForeignKey
from src.models.intl import IntlText


class BannerText(IntlText):
    __tablename__ = 'banner_text'

    value = Column(String(50), nullable=False)
    banner_id = Column(
        Integer,
        ForeignKey(
            'banner.id'
        ),
        nullable=False
    )
