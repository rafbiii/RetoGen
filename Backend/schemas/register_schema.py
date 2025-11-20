from pydantic import BaseModel, EmailStr, field_validator
import re

class RegisterUser(BaseModel):
    username: str
    fullname: str
    email: EmailStr
    password: str

    @field_validator("username")
    def validate_username(cls, username):
        if not re.fullmatch(r"^[A-Za-z0-9]{8,16}$", username):
            raise ValueError(
                "Username harus 8-16 karakter dan hanya boleh huruf atau angka."
            )
        return username

    @field_validator("fullname")
    def validate_fullname(cls, fullname):
        if not re.fullmatch(r"^[A-Za-zA-Z ]{4,32}$", fullname):
            raise ValueError(
                "Fullname harus 4-32 karakter dan hanya mengandung huruf dan spasi."
            )
        return fullname

    @field_validator("password")
    def validate_password(cls, password):
        if len(password) < 8 or len(password) > 16:
            raise ValueError("Password harus 8-16 karakter.")

        if not re.search(r"[a-z]", password):
            raise ValueError("Password harus memiliki minimal 1 huruf kecil.")

        if not re.search(r"[A-Z]", password):
            raise ValueError("Password harus memiliki minimal 1 huruf besar.")

        if not re.search(r"\d", password):
            raise ValueError("Password harus memiliki minimal 1 angka.")

        if not password.isalnum():
            raise ValueError("Password tidak boleh mengandung simbol.")

        return password
