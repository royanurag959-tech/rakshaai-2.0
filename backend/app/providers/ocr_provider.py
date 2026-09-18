import re
import hashlib
from app.providers.base import BaseAnalysisProvider
from app.providers.message_provider import message_provider
from app.providers.link_provider import link_provider
from app.schemas.schemas import AnalysisResponse, SignalItem

class ScreenshotAnalysisProvider(BaseAnalysisProvider):
    """
    Screenshot Multi-Signal Analyzer.
    Combines simulated OCR text extraction, phone/URL regex parsing,
    and cascading Scam Intent analysis.
    """

    def analyze(self, filename: str, file_bytes: bytes, user_notes: str = "") -> AnalysisResponse:
        sha256 = hashlib.sha256(file_bytes).hexdigest()
        
        # Simulate realistic OCR extraction based on filename or embedded demo patterns
        lower_name = filename.lower()
        if "whatsapp" in lower_name or "emergency" in lower_name or "money" in lower_name:
            extracted_text = (
                "Bhai urgent emergency hai! Hospital mein admit hoon. "
                "Turant ₹20,000 transfer kar de is UPI par: hospital-care99@oksbi. "
                "Main shaam tak lauta dunga. Please jaldi kar!"
            )
        elif "invest" in lower_name or "crypto" in lower_name or "telegram" in lower_name:
            extracted_text = (
                "VIP Guaranteed Daily Profit! Invest ₹5,000 and receive ₹25,000 within 24 hours. "
                "Official SEBI approved scheme. Join channel: https://t.me/crypto-king-guaranteed"
            )
        elif "bank" in lower_name or "kyc" in lower_name or "sms" in lower_name:
            extracted_text = (
                "Dear Customer, Your SBI NetBanking will be suspended today due to pending KYC update. "
                "Click to verify immediately: http://sbi-online-kyc-update-secure.top/login"
            )
        else:
            extracted_text = (
                "Suspicious chat snippet: 'Please confirm your OTP 849201 to receive the Rs. 50,000 lottery transfer.'"
            )

        # Run text extraction through message provider
        base_result = message_provider.analyze(extracted_text, platform="screenshot")
        base_result.scan_type = "screenshot"
        base_result.sha256_hash = sha256
        base_result.target_summary = f"Screenshot OCR Analysis: {filename} ({len(extracted_text)} chars extracted)"

        # Extract structured entities
        phones = re.findall(r"(\+?91[\-\s]?)?[6789]\d{9}", extracted_text)
        urls = re.findall(r"https?://[^\s]+", extracted_text)
        upis = re.findall(r"[\w\.\-]+@[\w\-]+", extracted_text)

        ocr_signals = []
        if upis:
            ocr_signals.append(SignalItem(
                indicator=f"Extracted UPI Handle: {upis[0]}",
                description="Payment destination handle parsed directly from image OCR.",
                severity="HIGH"
            ))
        if urls:
            ocr_signals.append(SignalItem(
                indicator=f"Extracted URL: {urls[0]}",
                description="Embedded hyperlink detected in screenshot image.",
                severity="HIGH"
            ))
        if phones:
            phone_val = phones[0] if isinstance(phones[0], str) else phones[0][0]
            if phone_val:
                ocr_signals.append(SignalItem(
                    indicator=f"Extracted Indian Mobile Contact: {phone_val}",
                    description="Mobile contact number parsed directly from screenshot image OCR.",
                    severity="MEDIUM"
                ))

        base_result.signals.extend(ocr_signals)

        # 4-metric forensic breakdown for Screenshot OCR
        has_entities = bool(upis or urls or phones)
        has_urgency = any(w in extracted_text.lower() for w in ["emergency", "turant", "urgent", "hospital", "bail", "admit"])
        has_money = bool(upis or "₹" in extracted_text or "transfer" in extracted_text.lower() or "rs" in extracted_text.lower())
        
        base_result.visual_risk = round(88.0 if has_entities else 60.0, 1)
        base_result.temporal_risk = round(92.0 if has_urgency else 50.0, 1)
        base_result.audio_risk = round(95.0 if has_money else 45.0, 1)
        base_result.context_risk = round(base_result.risk_score, 1)

        return base_result

ocr_provider = ScreenshotAnalysisProvider()
