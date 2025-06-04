from .database import Base
from sqlalchemy import Column, String, Integer, Enum, CHAR, Time, DateTime, BOOLEAN, ForeignKey

class Angajati(Base):
    __tablename__ = 'Angajati'

    id_angajat = Column(Integer, primary_key=True, autoincrement=True, index=True)
    rol = Column(Enum('M','R','F','A','D', name='Roluri'), nullable=False)
    nume = Column(String, nullable=False)
    prenume = Column(String, nullable=False)
    parola = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)

class Pacienti(Base):
    __tablename__ = 'Pacienti'

    CNP = Column(CHAR(13), primary_key=True, nullable=False)
    nume = Column (String, nullable=False)
    prenume = Column(String, nullable=False)
    judet = Column(String, nullable=False)
    localitate = Column(String, nullable=False)
    strada = Column(String, nullable=False)
    nr_strada = Column(Integer, nullable=False)
    scara = Column(CHAR(1))
    apartament = Column(Integer)
    telefon = Column(String, nullable=False)
    email = Column(String, nullable=False)
    profesie = Column(String)
    loc_de_munca = Column(String)
    sex = Column(Enum('M','F', name='sex_enum'), nullable=False)
    grupa_sange = Column(Enum('A','B','AB','O', name='grupa_sange_enum'), nullable=False)
    rh = Column(Enum('pozitiv', 'negativ', name='rh_enum'), nullable=False)
    id_pat = Column(CHAR(3), nullable=False)

class Medicamente(Base):
    __tablename__ = 'Medicamente'

    id_medicament = Column(Integer, primary_key=True, nullable=False)
    denumire = Column(String, nullable=False)
    stoc = Column(Integer, primary_key=True)

class Prescriptii(Base):
    __tablename__ = 'Prescriptii'

    id_prescriptie = Column(Integer, primary_key=True, nullable=False)
    cantitate = Column(String, nullable=False)
    CNP = Column(CHAR(13), primary_key=True, nullable=False)
    afectiune = Column(String)
    id_medicament = Column(Integer, unique=True, nullable=False)

class Comenzi (Base):
    __tablename__ = 'Comenzi'

    id_comanda = Column(Integer, primary_key=True, nullable=False)
    ora = Column(Time, nullable=False)
    data = Column(DateTime, nullable=False)
    id_angajat = Column(Integer, nullable=False)
    id_pat = Column(CHAR(3), nullable=False)
    status = Column(Enum('Plasata','InProcesare','InTranzit','Livrata', name='status_enum'), nullable=False)
    id_prescriptie = Column(Integer, ForeignKey("Prescriptii.id_prescriptie"))

class Paturi (Base):
    __tablename__ = 'Paturi'

    id_pat = Column(CHAR(3), primary_key=True, nullable=False)
    ocupat = Column(BOOLEAN)
    nr_salon = Column (Integer)
