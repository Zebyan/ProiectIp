from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from . config import settings
import os

#SQLALCHEMY_DATABASE_URL = f'postgresql://{settings.database_username}:{settings.database_password}@{settings.database_hostname}:{settings.database_port}/{settings.database_name}'
#engine = create_engine(SQLALCHEMY_DATABASE_URL)

#SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(settings.database_url)

MySession = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = MySession()
    try:
        yield db
    finally:
        db.close()
