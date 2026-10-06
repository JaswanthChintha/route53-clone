from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime

from database import Base


class HostedZone(Base):
    __tablename__ = "hosted_zones"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    type = Column(String, default="PUBLIC")
    description = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class DNSRecord(Base):
    __tablename__ = "dns_records"

    id = Column(Integer, primary_key=True, index=True)
    hosted_zone_id = Column(Integer, nullable=False)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)
    value = Column(String, nullable=False)
    ttl = Column(Integer, default=300)
    created_at = Column(DateTime, default=datetime.utcnow)