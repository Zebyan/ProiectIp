import jwt
from datetime import datetime, timedelta
from . import schemas
from jwt.exceptions import InvalidTokenError
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

oath2_scheme = OAuth2PasswordBearer(tokenUrl='login')

SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

def create_access_token(data: dict):
    encode_token = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    encode_token.update({"exp": expire})

    encoded_token = jwt.encode(encode_token, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_token

def verify_access_token(token: str, credentials_exception):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=ALGORITHM)
        print("Payload:", payload)
        rol: str = payload.get("rol")
        id: int = payload.get("id") 
         

        if rol is None or id is None:
            raise credentials_exception

        token_data = schemas.Token_Data(rol=rol, id=id)
    except InvalidTokenError:
        raise credentials_exception

    return token_data
    
def get_current_angajat(token: str = Depends(oath2_scheme)):
    credentials_exception = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Nu s-au putut verifica datele",
                                            headers={"WWW-Authenticate": "Bearer"})
    return verify_access_token(token, credentials_exception)