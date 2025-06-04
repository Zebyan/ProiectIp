from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from .. import database, models, utils, oath2, schemas, send_email
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
from sqlalchemy.exc import IntegrityError
from typing import List
import os

router = APIRouter(
    tags=['Login']
)

@router.post('/login')
def login (date_angajat: schemas.AngajatLogin,db: Session = Depends(database.get_db)):
    db_angajat = db.query(models.Angajati).filter(models.Angajati.email == date_angajat.username).first()
    if not db_angajat: 
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Utilizatorul sau parola nu exista!")
    
    if not utils.verify_password(date_angajat.password, db_angajat.parola): 
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Utilizatorul sau parola nu exista!")

    access_token = oath2.create_access_token(data = {"rol": db_angajat.rol, "nume": db_angajat.nume, "id": db_angajat.id_angajat})

    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/angajati", status_code=status.HTTP_201_CREATED)
def creare_angajat(angajat: schemas.CreateAngajat,db: Session = Depends(database.get_db)):
    random_password = utils.generate_password()
    email_password = os.environ["EMAIL_PASSWORD"]
    print(random_password)
    hashed_password = utils.get_password_hash(random_password)
    db_angajat = models.Angajati(rol = angajat.rol,
                                 nume = angajat.nume,
                                 prenume = angajat.prenume,
                                 email = angajat.email,
                                 parola = hashed_password)
    db.add(db_angajat)
    try:
        db.commit()
        db.refresh(db_angajat)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Email deja folosit!")
    
    try:
        email_body = f"Bună {angajat.nume},\n\nContul tău a fost creat.\nParola ta este: {random_password}\n\n"
        send_email.send_email_notification(to_email=angajat.email, body=email_body, from_password=email_password)
    except Exception as e:
        print("Eroare la trimiterea emailului:", e)
    return db_angajat

@router.get("/angajati", response_model=List[schemas.CreateAngajat])
def vizualizare_angajati(db: Session = Depends(database.get_db)):

    db_angajat = db.query(models.Angajati).all()
    return db_angajat