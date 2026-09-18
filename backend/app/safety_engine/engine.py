from typing import Dict, Any, List
from app.schemas.schemas import SafetyGuidance, VerificationGuide

class SafetyEngine:
    """
    Dedicated Safety Engine for RakshaAI 2.0.
    Translates risk assessment into immediate, unambiguous user protection steps.
    """

    @staticmethod
    def generate_safety_guidance(risk_level: str, scan_type: str, category: str = "general") -> SafetyGuidance:
        if risk_level == "CRITICAL":
            return SafetyGuidance(
                level="Emergency (Red)",
                headline="🚨 CRITICAL THREAT DETECTED: Act Immediately to Halt Fraud",
                immediate_actions=[
                    "Stop all communication with the sender immediately. Block on caller/chat app.",
                    "Do NOT transfer any money or approve any UPI collect request.",
                    "Do NOT share OTP, UPI PIN, ATM PIN, or passwords under any circumstances.",
                    "If credentials or banking PIN were entered, immediately freeze cards/UPI via your official banking app.",
                    "Preserve screenshots, audio files, phone numbers, and UPI handles in Evidence Locker.",
                    "Call National Cyber Fraud Helpline at 1930 immediately if money has left your account."
                ],
                avoid_actions=[
                    "Do NOT call back the suspicious number provided in the message/call.",
                    "Do NOT click any further links or install APK/screen-sharing tools (AnyDesk, TeamViewer, RustDesk).",
                    "Do NOT confront the scammer; preserve evidence quietly.",
                    "Do NOT panic; follow the step-by-step solution below."
                ]
            )
        elif risk_level == "HIGH":
            return SafetyGuidance(
                level="Immediate Attention (Orange)",
                headline="⚠️ HIGH RISK IDENTIFIED: Strong Signs of Manipulation or Social Engineering",
                immediate_actions=[
                    "Pause and break the urgency cycle. Scammers deliberately manufacture panic.",
                    "Do not transfer funds, share verification codes, or disclose private credentials.",
                    "Independently verify the claimed identity using a saved, verified contact number.",
                    "Preserve all interaction history, voice notes, and URLs.",
                    "Prepare an incident record if impersonation of an official or family member occurred."
                ],
                avoid_actions=[
                    "Do NOT trust caller ID or profile display names without two-way verification.",
                    "Do NOT use links, phone numbers, or QR codes sent directly by the caller.",
                    "Do NOT forward the message to friends or family without a warning."
                ]
            )
        elif risk_level == "MODERATE":
            return SafetyGuidance(
                level="Caution (Yellow)",
                headline="🟡 CAUTION: Inconsistencies Detected in Content or Context",
                immediate_actions=[
                    "Review message origin carefully. Compare sender handle with authentic domain.",
                    "Check if the tone involves unsolicited financial, investment, or delivery updates.",
                    "Verify with the official organization through their verified portal or customer care."
                ],
                avoid_actions=[
                    "Do NOT rush into actions based on limited-time discounts or lottery claims.",
                    "Do NOT click shortened URLs (bit.ly, tinyurl) from unknown senders."
                ]
            )
        else:
            return SafetyGuidance(
                level="Safe Guidance (Green)",
                headline="🟢 NO IMMEDIATE THREAT DETECTED: Standard Cyber Hygiene Recommended",
                immediate_actions=[
                    "Content shows standard baseline characteristics and low synthetic indicators.",
                    "Continue normal cautious digital practices: keep 2FA enabled on all accounts.",
                    "Regularly review authorized devices in your messaging apps."
                ],
                avoid_actions=[
                    "Never share passwords or banking PINs even on familiar-looking portals."
                ]
            )

    @staticmethod
    def generate_verification_guide(claimed_identity: str = "Relative / Official") -> VerificationGuide:
        return VerificationGuide(
            title=f"Verify {claimed_identity} Before Trust",
            disclaimer="AI cannot independently prove that a person is who they claim to be.",
            verification_steps=[
                f"Disconnect the current call or message channel immediately.",
                f"Dial the person's known, saved phone number directly via cellular network (not WhatsApp).",
                f"If an official or bank is claimed, dial the number printed on the back of your debit card or official website.",
                f"Never use phone numbers provided in the suspicious message itself.",
                f"Demand video confirmation if possible, and observe natural lighting and spontaneous expressions."
            ],
            challenge_questions=[
                "Ask a shared personal memory that only the real person would know (e.g. 'What did we eat together last weekend?').",
                "Ask about a mutual acquaintance or pet name that has never been posted on social media.",
                "If claiming to be police/CBI, remember: Indian Law Enforcement NEVER conducts 'Digital Arrests' over Skype/WhatsApp!"
            ]
        )

safety_engine = SafetyEngine()
