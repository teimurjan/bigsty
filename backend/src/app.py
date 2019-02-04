import sqlalchemy

from src.factories.app import AppFactory
from src.factories.api import APIFactory



if __name__ == "__main__":
    app = AppFactory.create()
    
    engine = db.create_engine(app.config.DB_URL)
    connection = engine.connect()

    api = APIFactory(app, connection).create()

    app.run(debug=True)
