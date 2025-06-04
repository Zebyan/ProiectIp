from .. import models, schemas, oath2, utils
from fastapi import Depends, status, HTTPException, APIRouter
from typing import List
from sqlalchemy.orm import Session
from ..database import engine, get_db

router = APIRouter(
    prefix = "/angajati/medic",
    tags = ["Medic"]
)

@router.get("/", response_model=List[schemas.CreatePacient])
def vizualizare_pacienti(db: Session = Depends(get_db), access: schemas.Token_Data = Depends(oath2.get_current_angajat)):
    if not utils.verify_medic_rol(access.rol):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail = "Nu aveti access!"
        )

    pacienti = db.query(models.Pacienti).all()
    return pacienti


@router.post("/", status_code=status.HTTP_201_CREATED)
def adaugare_pacient(pacient: schemas.CreatePacient, db: Session = Depends(get_db), 
                     access: schemas.Token_Data = Depends(oath2.get_current_angajat)):
    
    if not utils.verify_medic_rol(access.rol):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail = "Nu aveti access!"
        )

    exist_pacient = db.query(models.Pacienti).filter(models.Pacienti.CNP == pacient.CNP).first()
    if exist_pacient:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Pacientul deja exista!"
        )
    db_pacient = models.Pacienti(CNP= pacient.CNP, 
                              nume = pacient.nume,
                              prenume = pacient.prenume,
                              judet = pacient.judet,
                              localitate = pacient.localitate,
                              strada = pacient.strada,
                              nr_strada = pacient.nr_strada,
                              scara = pacient.scara,
                              apartament = pacient.apartament,
                              telefon = pacient.telefon,
                              email = pacient.email,
                              profesie = pacient.profesie,
                              loc_de_munca = pacient.loc_de_munca,
                              sex = pacient.sex,
                              grupa_sange = pacient.grupa_sange,
                              rh = pacient.rh,
                              id_pat = pacient.id_pat)
    
    print(access)
    db.add(db_pacient)
    db.commit()
    db.refresh(db_pacient)
    return {"message":"Pacientul a fost creat!"}

@router.put("/{CNP}",response_model=schemas.CreatePacient, status_code=status.HTTP_202_ACCEPTED)
def editare_pacient(CNP: str, pacient: schemas.UpdatePacient, db: Session = Depends(get_db),
                    access: schemas.Token_Data = Depends(oath2.get_current_angajat)):
    if not utils.verify_medic_rol(access.rol):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail = "Nu aveti access!"
        )
    
    db_pacient = db.query(models.Pacienti).filter(models.Pacienti.CNP == CNP).first()
    if db_pacient is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pacientul nu exista!"
        )
    for field, value in pacient.dict(exclude_unset=True).items():
        setattr(db_pacient, field, value)
    db.commit()
    db.refresh(db_pacient)
    return db_pacient

@router.delete("/{CNP}", status_code=status.HTTP_204_NO_CONTENT)
def sterge_pacient(CNP: str, db: Session = Depends(get_db),
                    access: schemas.Token_Data = Depends(oath2.get_current_angajat)):
    if not utils.verify_medic_rol(access.rol):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail = "Nu aveti access!"
        )
    pacient = db.query(models.Pacienti).filter(models.Pacienti.CNP == CNP).first()
    if not pacient:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pacientul nu exista!!")
    
    db.delete(pacient)
    db.commit()
    return{"mesaj": "Pacientul a fost sters!"}


@router.get("/medicamente", response_model=List[schemas.Medicamente])
def vizualizare_medicamente(db: Session = Depends(get_db), access: schemas.Token_Data = Depends(oath2.get_current_angajat)):
    if not utils.verify_medic_rol(access.rol):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail = "Nu aveti access!"
        )

    pacienti = db.query(models.Medicamente).all()
    return pacienti

@router.post("/medicamente", status_code=status.HTTP_201_CREATED)
def adaugare_medicament(medicament: schemas.Medicamente, db: Session = Depends(get_db), 
                     access: schemas.Token_Data = Depends(oath2.get_current_angajat)):
    
    if not utils.verify_medic_rol(access.rol):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail = "Nu aveti access!"
        )

    exist_medicament = db.query(models.Medicamente).filter(models.Medicamente.id_medicament == medicament.id_medicament).first()
    if exist_medicament:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Medicamentul deja exista!"
        )
    db_medicament = models.Medicamente(
        id_medicament = medicament.id_medicament,
        denumire = medicament.denumire,
        stoc = medicament.stoc
    )
    
    print(access)
    db.add(db_medicament)
    db.commit()
    db.refresh(db_medicament)
    return {"message":"Medicamentul a fost adaugat!"}

@router.put("/medicamente{id_medicament}",response_model=schemas.Medicamente, status_code=status.HTTP_202_ACCEPTED)
def editare_medicament(id_medicament: int, medicament: schemas.Medicamente, db: Session = Depends(get_db),
                    access: schemas.Token_Data = Depends(oath2.get_current_angajat)):
    if not utils.verify_medic_rol(access.rol):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail = "Nu aveti access!"
        )
    
    db_medicament = db.query(models.Medicamente).filter(models.Medicamente.id_medicament == id_medicament).first()
    if db_medicament is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Medicamentul nu exista!"
        )
    for field, value in medicament.dict(exclude_unset=True).items():
        setattr(db_medicament, field, value)
    db.commit()
    db.refresh(db_medicament)
    return db_medicament
