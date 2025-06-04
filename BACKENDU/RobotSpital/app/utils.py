import string
import secrets
from passlib.context import CryptContext

#genereaza o parola pentru noi angajati
def generate_password(length: int = 12):
    chars = string.ascii_letters + string.digits
    return ''.join(secrets.choice(chars) for _ in range(length)) 

pwd_context = CryptContext(schemes=['bcrypt'])

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

#verificare 
def verify_medic_rol(rol: str):
    if rol == 'M':
        return True
    else:
        return False