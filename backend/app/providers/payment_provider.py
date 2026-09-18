import re
from app.providers.base import BaseAnalysisProvider
from app.risk_engine.engine import risk_engine
from app.safety_engine.engine import safety_engine
from app.solution_engine.engine import solution_engine
from app.schemas.schemas import AnalysisResponse, SignalItem, ExplanationItem

class PaymentAnalysisProvider(BaseAnalysisProvider):
    """
    PaymentShield: UPI, QR, and Payment Safety Inspector.
    Protects users against reverse-QR scams, fake payment receipts, UPI PIN traps, and collect requests.
    NOTE: RakshaAI never initiates or executes a payment.
    """

    def analyze(self, upi_id: str = "", amount: float = 0.0, message_context: str = "", qr_data: str = "") -> AnalysisResponse:
        context_lower = (message_context or "").lower()
        upi_clean = (upi_id or "").strip().lower()
        
        risk_score = 15.0
        signals: list[SignalItem] = []
        is_reverse_qr = False

        # 1. Reverse QR Code Trap: "Scan to receive money"
        if "scan" in context_lower and ("receive" in context_lower or "get money" in context_lower or "accept payment" in context_lower):
            risk_score += 65.0
            is_reverse_qr = True
            signals.append(SignalItem(
                indicator="REVERSE QR CODE SCAM DETECTED",
                description="GOLDEN RULE: You NEVER enter your UPI PIN to receive money! Entering your UPI PIN will immediately DEDUCT money from your account.",
                severity="CRITICAL"
            ))

        # 2. UPI Collect Request Misuse
        if "collect" in context_lower or "approve" in context_lower or "pin dalo" in context_lower:
            risk_score += 45.0
            signals.append(SignalItem(
                indicator="Deceptive UPI Collect Mandate",
                description="Scammer initiates a 'Collect Request' disguised as a prize, cashback, or refund.",
                severity="CRITICAL"
            ))

        # 3. Suspicious VPA handle
        if upi_clean:
            if any(fake in upi_clean for fake in ["support", "refund", "cashback", "reward", "officer", "helpdesk"]):
                risk_score += 30.0
                signals.append(SignalItem(
                indicator="Suspicious VPA Handle",
                description=f"VPA '{upi_clean}' mimics an official support handle to gain false trust.",
                severity="HIGH"
            ))

        # 4. Large emergency sum
        if amount and amount >= 10000:
            risk_score += 20.0
            signals.append(SignalItem(
                indicator="High Monetary Value (Urgent Transfer)",
                description=f"Request involves substantial funds (₹{amount:,.2f}), amplifying scam risk.",
                severity="MEDIUM"
            ))

        risk_level, calculated_score, confidence, conf_score = risk_engine.evaluate(
            risk_score, len(signals), has_financial_urgency=True if is_reverse_qr else False
        )

        explanations = [
            ExplanationItem(
                point="Why was this payment request flagged?",
                meaning="The payment scenario contains classic hallmarks of UPI fraud, especially the 'Scan QR / Enter PIN to receive money' trap or fraudulent collect requests."
            ),
            ExplanationItem(
                point="What does this mean in plain language?",
                meaning="Do NOT approve this request. Do NOT enter your UPI PIN. If you enter your PIN, the funds will be immediately deducted from your bank."
            )
        ] if risk_level in ["HIGH", "CRITICAL"] else [
            ExplanationItem(
                point="Payment Context Check",
                meaning="Standard peer-to-peer payment format without overt reverse-QR or collect deception markers."
            ),
            ExplanationItem(
                point="What does this mean?",
                meaning="Always verify recipient name on your banking app screen before authorizing any transfer."
            )
        ]

        safety = safety_engine.generate_safety_guidance(risk_level, "payment", "upi")
        solution = solution_engine.generate_solution("financial", financial_loss=False, amount=amount)

        return AnalysisResponse(
            scan_type="payment",
            target_summary=f"PaymentShield: UPI '{upi_id or 'QR Scan'}' (₹{amount:,.2f})",
            risk_level=risk_level,
            risk_score=calculated_score,
            confidence=confidence,
            confidence_score=conf_score,
            visual_risk=round(96.0 if is_reverse_qr else 40.0, 1),
            temporal_risk=round(92.0 if any(s.indicator == "Deceptive UPI Collect Mandate" for s in signals) else 35.0, 1),
            audio_risk=round(88.0 if any(s.indicator == "Suspicious VPA Handle" for s in signals) else 30.0, 1),
            context_risk=round(calculated_score, 1),
            signals=signals,
            explanations=explanations,
            safety_guidance=safety,
            solution_timeline=solution
        )

payment_provider = PaymentAnalysisProvider()
