from sqlalchemy.orm import relationship
from src.models.base import BaseModel


class FeatureType(BaseModel):
    __tablename__ = 'feature_type'

    names = relationship('FeatureTypeName', backref='feature_type', lazy=True)
