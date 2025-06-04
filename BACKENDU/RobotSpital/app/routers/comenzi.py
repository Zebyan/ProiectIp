from .. import models, schemas, oath2
from fastapi import Depends, status, HTTPException, APIRouter
from typing import List
from sqlalchemy.orm import Session
from ..database import engine, get_db

router = APIRouter(
    prefix = "/comenzi",
    tags = ["Comenzi"]
)
@router.get("/", response_model=List[schemas.Creare_Comenzi])
def vizualizare_comenzi(
    db: Session = Depends(get_db),
    angajat: schemas.Token_Data = Depends(oath2.get_current_angajat)
):
    comenzi = db.query(models.Comenzi).filter(models.Comenzi.id_angajat == angajat.id).all()
    return comenzi


@router.post("/", status_code=status.HTTP_201_CREATED)
def adaugare_comanda(comenzi: schemas.Creare_Comenzi, db: Session = Depends(get_db), 
                     access: schemas.Token_Data = Depends(oath2.get_current_angajat)):

    exist_comenzi = db.query(models.Comenzi).filter(models.Comenzi.id_comanda == comenzi.id_comanda).first()
    if exist_comenzi:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Comanda deja exista!"
        )
    db_comenzi = models.Comenzi( 
                              ora = comenzi.ora,
                              data = comenzi.data,
                              id_angajat = comenzi.id_angajat,
                              id_pat = comenzi.id_pat,
                              status = comenzi.status,
                              id_prescriptie = comenzi.id_prescriptie
                              )
    
    print(access)
    db.add(db_comenzi)
    db.commit()
    db.refresh(db_comenzi)
    return db_comenzi

@router.get("/status", response_model=List[schemas.Status_Comanda])
def status_comanda(db: Session = Depends(get_db), angajat: models.Angajati = Depends(oath2.get_current_angajat)):
    db_status_comenzi = db.query(models.Comenzi).filter(models.Comenzi.id_angajat == angajat.id).all()
    return db_status_comenzi
