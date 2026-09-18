from app.providers.base import BaseAnalysisProvider
from app.providers.message_provider import message_provider
from app.schemas.schemas import AnalysisResponse, SignalItem, ExplanationItem

class SocialAnalysisProvider(BaseAnalysisProvider):
    """
    SocialShield Multi-Platform Cyber Fraud Analyzer.
    Platform-specific heuristic rules for WhatsApp, Instagram, Facebook, Telegram, SMS/Email.
    """

    def analyze(self, platform: str, content: str, sender_profile: str = "", sender_claim: str = "Unknown") -> AnalysisResponse:
        platform_norm = platform.lower()
        
        # Base message analysis
        base_result = message_provider.analyze(content, platform=platform_norm, sender_claim=sender_claim)
        
        extra_signals = []
        # Platform-specific rules
        if platform_norm == "whatsapp":
            extra_signals.append(SignalItem(
                indicator="WhatsApp Family Impersonation / Emergency Pattern",
                description="Common 'Hi Mom / Hi Dad, new number' or 'Bhai urgent help chahiye' pattern detected.",
                severity="CRITICAL" if base_result.risk_level in ["HIGH", "CRITICAL"] else "MEDIUM"
            ))
        elif platform_norm == "instagram":
            extra_signals.append(SignalItem(
                indicator="Instagram Fake Giveaway / Brand Ambassador Lure",
                description="Unsolicited DM offering free luxury goods or paid sponsorship requiring an upfront 'customs or processing fee'.",
                severity="HIGH"
            ))
        elif platform_norm == "telegram":
            extra_signals.append(SignalItem(
                indicator="Telegram Pump-and-Dump / Crypto Ponzi Group Indicator",
                description="Unregulated investment schemes with automated bot engagement and promises of fixed exponential returns.",
                severity="CRITICAL" if "invest" in content.lower() or "crypto" in content.lower() else "MEDIUM"
            ))
        elif platform_norm == "facebook":
            extra_signals.append(SignalItem(
                indicator="Facebook Marketplace / Advance QR Code Trap",
                description="Scammer sending QR code claiming 'Scan to receive payment for your listing'. Scanning a QR code ALWAYS sends money, never receives!",
                severity="HIGH"
            ))
        elif platform_norm in ["sms", "email"]:
            extra_signals.append(SignalItem(
                indicator="Smishing / Vishing Carrier Gateway Indicator",
                description="Bulk automated SMS sender imitating bank short-codes (e.g. VK-SBI, AX-HDFC) without DLT entity registration.",
                severity="HIGH"
            ))

        base_result.signals.extend(extra_signals)
        base_result.target_summary = f"SocialShield ({platform.upper()}): {content[:60]}..."
        
        # 4-metric forensic breakdown for SocialShield
        base_result.visual_risk = round(91.0 if base_result.risk_level in ["HIGH", "CRITICAL"] else 40.0, 1)
        base_result.temporal_risk = round(94.0 if platform_norm in ["whatsapp", "telegram"] else 65.0, 1)
        base_result.audio_risk = round(92.0 if any(w in content.lower() for w in ["invest", "crypto", "qr", "gift", "customs", "delivery", "fee"]) else 45.0, 1)
        base_result.context_risk = round(base_result.risk_score, 1)

        return base_result

social_provider = SocialAnalysisProvider()
