from pydantic import BaseModel, field_validator
from datetime import datetime


class HostedZoneCreate(BaseModel):
    name: str
    type: str = "PUBLIC"
    description: str | None = None


class HostedZoneResponse(BaseModel):
    id: int
    name: str
    type: str
    description: str | None
    created_at: datetime

    class Config:
        from_attributes = True


class DNSRecordCreate(BaseModel):
    name: str
    type: str
    value: str
    ttl: int = 300

    @field_validator("type")
    @classmethod
    def validate_type(cls, value: str):
        allowed_types = {
            "A",
            "AAAA",
            "CNAME",
            "TXT",
            "MX",
            "NS",
            "PTR",
            "SRV",
            "CAA",
        }

        value = value.upper()

        if value not in allowed_types:
            raise ValueError(
                "Invalid DNS record type"
            )

        return value

    @field_validator("ttl")
    @classmethod
    def validate_ttl(cls, value: int):
        if value < 1:
            raise ValueError(
                "TTL must be greater than 0"
            )

        return value


class DNSRecordResponse(BaseModel):
    id: int
    hosted_zone_id: int
    name: str
    type: str
    value: str
    ttl: int
    created_at: datetime

    class Config:
        from_attributes = True