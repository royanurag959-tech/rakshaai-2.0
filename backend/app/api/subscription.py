from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter(prefix="/subscription", tags=["Subscription"])

class PlanTier(BaseModel):
    id: str
    name: str
    price_inr: int
    period: str
    features: List[str]
    popular: bool = False

@router.get("")
def get_subscription_plans():
    return {
        "current_tier": "plus_49",
        "plans": [
            {
                "id": "free",
                "name": "Raksha Basic",
                "price_inr": 0,
                "period": "Forever Free",
                "features": [
                    "5 Deepfake & Scam Scans / day",
                    "Emergency 1930 Triage Access",
                    "Basic Safety Checklists",
                    "Cyber Safety Academy (English & Hindi)"
                ],
                "popular": False
            },
            {
                "id": "plus_49",
                "name": "Raksha Plus",
                "price_inr": 49,
                "period": "/ month",
                "features": [
                    "Unlimited Audio, Video & Link Scans",
                    "Evidence Locker with SHA-256 Hashes",
                    "4-Stage Action Solution Engine (Now/3h/24h/7d)",
                    "1-Click Copy Ready 1930 Complaint Dossiers",
                    "Offline Emergency Protection Mode"
                ],
                "popular": True
            },
            {
                "id": "pro_99",
                "name": "Raksha Pro",
                "price_inr": 99,
                "period": "/ month",
                "features": [
                    "All Plus Features included",
                    "Multimodal Temporal & Forensic Breakdown",
                    "Priority Evidence Fingerprinting",
                    "Export Official PDF Police Dossier",
                    "Personal Risk Trend & Scam Analytics"
                ],
                "popular": False
            },
            {
                "id": "family_149",
                "name": "Family Shield",
                "price_inr": 149,
                "period": "/ month",
                "features": [
                    "Protection for up to 5 Family Members",
                    "Zero-Privacy-Violation Alert System",
                    "Elderly Fraud Lure Notifications",
                    "Family Safe-Word Emergency Protocol",
                    "Dedicated WhatsApp & SMS Shielding"
                ],
                "popular": False
            },
            {
                "id": "enterprise",
                "name": "Raksha Enterprise / API",
                "price_inr": 4999,
                "period": "/ month starting",
                "features": [
                    "REST API access for Banking & Fintech apps",
                    "Real-time Reverse-QR & Impersonation Engine",
                    "SOC2 & ISO 27001 Compliant Data Pipelines",
                    "Bulk CSV/Batch Media Inspection",
                    "24x7 Cyber Threat Intelligence Feed"
                ],
                "popular": False
            }
        ]
    }

@router.post("/checkout")
def checkout_demo(tier_id: str):
    return {
        "status": "success",
        "message": f"Demo checkout successful for tier: {tier_id}. Pro protection activated!",
        "tier": tier_id
    }
