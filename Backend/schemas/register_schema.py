from pydantic import BaseModel, EmailStr, field_validator
import re

class RegisterUser(BaseModel):
    username: str
    fullname: str
    email: EmailStr
    password: str

    @field_validator("username")
    def validate_username(cls, v):
        if not re.fullmatch(r"^[A-Za-z0-9]{8,16}$", v):
            raise ValueError(
                "Username harus 8-16 karakter dan hanya boleh huruf atau angka."
            )
        return v

    @field_validator("fullname")
    def validate_fullname(cls, v):
        if not re.fullmatch(r"^[A-Za-zA-Z ]{4,32}$", v):
            raise ValueError(
                "Fullname harus 4-32 karakter dan hanya mengandung huruf dan spasi."
            )
        return v

    @field_validator("password")
    def validate_password(cls, v):
        if len(v) < 8 or len(v) > 16:
            raise ValueError("Password harus 8-16 karakter.")

        if not re.search(r"[a-z]", v):
            raise ValueError("Password harus memiliki minimal 1 huruf kecil.")

        if not re.search(r"[A-Z]", v):
            raise ValueError("Password harus memiliki minimal 1 huruf besar.")

        if not re.search(r"\d", v):
            raise ValueError("Password harus memiliki minimal 1 angka.")

        if not v.isalnum():
            raise ValueError("Password tidak boleh mengandung simbol.")

        return v
