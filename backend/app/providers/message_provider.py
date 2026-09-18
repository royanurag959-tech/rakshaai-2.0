import re
from app.providers.base import BaseAnalysisProvider
from app.risk_engine.engine import risk_engine
from app.safety_engine.engine import safety_engine
from app.solution_engine.engine import solution_engine
from app.schemas.schemas import AnalysisResponse, SignalItem, ExplanationItem

class MessageAnalysisProvider(BaseAnalysisProvider):
    """
    Scam Intent & Social Engineering Detection Engine for pasted messages.
    Analyzes urgency, coercion, payment traps, OTP theft, and impersonation.
    """

    def analyze(self, message: str, platform: str = "generic", sender_claim: str = "Unknown") -> AnalysisResponse:
        text = message.lower()
        risk_score = 10.0
        signals: list[SignalItem] = []
        has_urgency = False
        has_financial = False

        # 1. Financial / Money Requests
        if re.search(r"(₹|\brs\.?|\brupees|\bmoney\b|\btransfer\b|\bbhejo\b|\btransfer\b|\b20000\b|\b50000\b|\bpaise\b)", text):
            risk_score += 35.0
            has_financial = True
            signals.append(SignalItem(
                indicator="Unsolicited Money Request",
                description="Message requests direct monetary transfer or mentions specific fund figures.",
                severity="HIGH"
            ))

        # 2. OTP / PIN Demands
        if re.search(r"(otp|one.?time.?password|upi.?pin|enter pin|pin daalo|pin dalo|code share|verification code)", text):
            risk_score += 45.0
            has_financial = True
            signals.append(SignalItem(
                indicator="Credential / OTP / PIN Harvesting",
                description="CRITICAL FRAUD INDICATOR: Message attempts to induce sharing of OTP or UPI PIN.",
                severity="CRITICAL"
            ))

        # 3. Urgency & Coercion / Threat tactics
        if re.search(r"(emergency|turant|immediately|urgent|within \d+ hours|account blocked|police|arrest|cbi|fir|warrant|customs|deactivated)", text):
            risk_score += 30.0
            has_urgency = True
            signals.append(SignalItem(
                indicator="Psychological Coercion & Manufactured Urgency",
                description="Use of artificial urgency or legal threats (Digital Arrest / Account Suspension) designed to provoke irrational hasty compliance.",
                severity="CRITICAL"
            ))

        # 4. Fake Lottery / Prizes / Investment
        if re.search(r"(congratulations|you won|claim prize|lottery|guaranteed return|daily profit|earn \d+|part.?time job|like youtube)", text):
            risk_score += 35.0
            signals.append(SignalItem(
                indicator="High-Yield Scam / Fake Prize Lure",
                description="Classic advance-fee or task-based fraud pattern offering unrealistic payouts.",
                severity="HIGH"
            ))

        # 5. Suspicious Links in text
        if re.search(r"(http://|https://|bit\.ly|tinyurl|\.apk|\.xyz|\.top)", text):
            risk_score += 20.0
            signals.append(SignalItem(
                indicator="Unverified Web Link or APK Attachment",
                description="Contains embedded redirection link or application download trigger.",
                severity="MEDIUM"
            ))

        # 6. Impersonation checks
        if sender_claim and sender_claim.lower() not in ["unknown", "generic"]:
            signals.append(SignalItem(
                indicator=f"Claimed Identity: {sender_claim}",
                description=f"Message sender claims to represent: '{sender_claim}'. Needs strict independent verification.",
                severity="HIGH"
            ))

        risk_level, calculated_score, confidence, conf_score = risk_engine.evaluate(
            risk_score, len(signals), has_financial_urgency=(has_urgency or has_financial)
        )

        explanations = [
            ExplanationItem(
                point="Why was this message flagged?",
                meaning="The text relies on classic social engineering tactics: demanding immediate action, requesting funds or sensitive codes, or threatening punitive consequences."
            ),
            ExplanationItem(
                point="What does this mean in plain language?",
                meaning="Do not reply. Banks and law enforcement never demand funds, OTPs, or passwords over chat apps or phone messages."
            )
        ] if risk_level in ["HIGH", "CRITICAL"] else [
            ExplanationItem(
                point="Message Context Assessment",
                meaning="The message content does not contain prominent financial urgency or credential solicitation keywords."
            ),
            ExplanationItem(
                point="What does this mean?",
                meaning="Risk appears low based on content, but always exercise caution if context changes."
            )
        ]

        safety = safety_engine.generate_safety_guidance(risk_level, "message", "scam_intent")
        solution = solution_engine.generate_solution("message", financial_loss=False)
        verification = safety_engine.generate_verification_guide(sender_claim if sender_claim != "Unknown" else "Sender")

        return AnalysisResponse(
            scan_type="message",
            target_summary=f"Message Scan ({platform.capitalize()}): {message[:50]}...",
            risk_level=risk_level,
            risk_score=calculated_score,
            confidence=confidence,
            confidence_score=conf_score,
            visual_risk=round(90.0 if has_urgency else 35.0, 1),
            temporal_risk=round(93.0 if has_financial else 30.0, 1),
            audio_risk=round(96.0 if any(s.indicator == "Credential / OTP / PIN Harvesting" for s in signals) else 35.0, 1),
            context_risk=round(calculated_score, 1),
            signals=signals,
            explanations=explanations,
            safety_guidance=safety,
            solution_timeline=solution,
            verification_guide=verification
        )

message_provider = MessageAnalysisProvider()
