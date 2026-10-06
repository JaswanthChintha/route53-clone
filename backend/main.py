from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import engine, Base, SessionLocal
import models
from schemas import (
    HostedZoneCreate,
    HostedZoneResponse,
    DNSRecordCreate,
    DNSRecordResponse
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@app.get("/")
def home():
    return {"message": "Route53 Clone Backend is running!"}


@app.post("/hosted-zones", response_model=HostedZoneResponse)
def create_hosted_zone(
    zone: HostedZoneCreate,
    db: Session = Depends(get_db)
):
    new_zone = models.HostedZone(
        name=zone.name,
        type=zone.type,
        description=zone.description
    )

    db.add(new_zone)
    db.commit()
    db.refresh(new_zone)

    return new_zone


@app.get("/hosted-zones")
def get_hosted_zones(db: Session = Depends(get_db)):
    return db.query(models.HostedZone).all()


@app.get("/hosted-zones/{zone_id}", response_model=HostedZoneResponse)
def get_hosted_zone(
    zone_id: int,
    db: Session = Depends(get_db)
):
    zone = db.query(models.HostedZone).filter(
        models.HostedZone.id == zone_id
    ).first()

    if not zone:
        raise HTTPException(
            status_code=404,
            detail="Hosted zone not found"
        )

    return zone


@app.put("/hosted-zones/{zone_id}", response_model=HostedZoneResponse)
def update_hosted_zone(
    zone_id: int,
    zone_data: HostedZoneCreate,
    db: Session = Depends(get_db)
):
    zone = db.query(models.HostedZone).filter(
        models.HostedZone.id == zone_id
    ).first()

    if not zone:
        raise HTTPException(
            status_code=404,
            detail="Hosted zone not found"
        )

    zone.name = zone_data.name
    zone.type = zone_data.type
    zone.description = zone_data.description

    db.commit()
    db.refresh(zone)

    return zone


@app.delete("/hosted-zones/{zone_id}")
def delete_hosted_zone(
    zone_id: int,
    db: Session = Depends(get_db)
):
    zone = db.query(models.HostedZone).filter(
        models.HostedZone.id == zone_id
    ).first()

    if not zone:
        raise HTTPException(
            status_code=404,
            detail="Hosted zone not found"
        )

    db.query(models.DNSRecord).filter(
        models.DNSRecord.hosted_zone_id == zone_id
    ).delete(synchronize_session=False)

    db.delete(zone)
    db.commit()

    return {"message": "Hosted zone deleted successfully"}


@app.post(
    "/hosted-zones/{zone_id}/records",
    response_model=DNSRecordResponse
)
def create_dns_record(
    zone_id: int,
    record: DNSRecordCreate,
    db: Session = Depends(get_db)
):
    zone = db.query(models.HostedZone).filter(
        models.HostedZone.id == zone_id
    ).first()

    if not zone:
        raise HTTPException(
            status_code=404,
            detail="Hosted zone not found"
        )

    new_record = models.DNSRecord(
        hosted_zone_id=zone_id,
        name=record.name,
        type=record.type,
        value=record.value,
        ttl=record.ttl
    )

    db.add(new_record)
    db.commit()
    db.refresh(new_record)

    return new_record


@app.get(
    "/hosted-zones/{zone_id}/records",
    response_model=list[DNSRecordResponse]
)
def get_dns_records(
    zone_id: int,
    db: Session = Depends(get_db)
):
    zone = db.query(models.HostedZone).filter(
        models.HostedZone.id == zone_id
    ).first()

    if not zone:
        raise HTTPException(
            status_code=404,
            detail="Hosted zone not found"
        )

    return db.query(models.DNSRecord).filter(
        models.DNSRecord.hosted_zone_id == zone_id
    ).all()


@app.get(
    "/hosted-zones/{zone_id}/records/{record_id}",
    response_model=DNSRecordResponse
)
def get_dns_record(
    zone_id: int,
    record_id: int,
    db: Session = Depends(get_db)
):
    record = db.query(models.DNSRecord).filter(
        models.DNSRecord.id == record_id,
        models.DNSRecord.hosted_zone_id == zone_id
    ).first()

    if not record:
        raise HTTPException(
            status_code=404,
            detail="DNS record not found"
        )

    return record


@app.put(
    "/hosted-zones/{zone_id}/records/{record_id}",
    response_model=DNSRecordResponse
)
def update_dns_record(
    zone_id: int,
    record_id: int,
    record_data: DNSRecordCreate,
    db: Session = Depends(get_db)
):
    record = db.query(models.DNSRecord).filter(
        models.DNSRecord.id == record_id,
        models.DNSRecord.hosted_zone_id == zone_id
    ).first()

    if not record:
        raise HTTPException(
            status_code=404,
            detail="DNS record not found"
        )

    record.name = record_data.name
    record.type = record_data.type
    record.value = record_data.value
    record.ttl = record_data.ttl

    db.commit()
    db.refresh(record)

    return record


@app.delete(
    "/hosted-zones/{zone_id}/records/{record_id}"
)
def delete_dns_record(
    zone_id: int,
    record_id: int,
    db: Session = Depends(get_db)
):
    record = db.query(models.DNSRecord).filter(
        models.DNSRecord.id == record_id,
        models.DNSRecord.hosted_zone_id == zone_id
    ).first()

    if not record:
        raise HTTPException(
            status_code=404,
            detail="DNS record not found"
        )

    db.delete(record)
    db.commit()

    return {"message": "DNS record deleted successfully"}