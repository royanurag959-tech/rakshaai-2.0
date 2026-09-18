from app.schemas.schemas import SolutionTimeline

class SolutionEngine:
    """
    Dedicated Solution Engine for RakshaAI 2.0.
    Answers: 'What should I do now?' across 4 structured time horizons:
    NOW, NEXT 3 HOURS, NEXT 24 HOURS, NEXT 7 DAYS.
    """

    @staticmethod
    def generate_solution(scenario_type: str, financial_loss: bool = False, amount: float = 0.0) -> SolutionTimeline:
        scenario = scenario_type.lower()
        
        if financial_loss or "financial" in scenario or "payment" in scenario or "upi" in scenario:
            return SolutionTimeline(
                now=[
                    "IMMEDIATE: Dial 1930 (National Cyber Crime Reporting Helpline) to report financial loss and initiate a Golden Hour transaction hold.",
                    "Log in to your banking app or call your bank's 24x7 emergency helpline to freeze debit cards, disable UPI, and block compromised net banking accounts.",
                    "Preserve payment UTR number, UPI reference ID, receiver's UPI VPA handle, and screenshots of debit SMS.",
                    "Save full communication logs with the scammer before they unsend or delete messages."
                ],
                next_3h=[
                    "Draft an official cybercrime complaint using RakshaAI's Report Generator.",
                    "File the complaint on https://cybercrime.gov.in with transaction ID, suspect phone/UPI, and digital evidence.",
                    "Obtain and note your Cyber Crime Acknowledgement Number.",
                    "Send an email with the complaint copy and transaction proof to your bank's Nodal / Grievance Officer requesting formal reversal."
                ],
                next_24h=[
                    "Visit your home bank branch in person and submit a written dispute letter along with the 1930 complaint copy.",
                    "Change all internet banking passwords, UPI PINs, and email passwords from a separate clean device.",
                    "Run an antivirus scan on your mobile device to ensure no malicious APK or remote viewer was installed."
                ],
                next_7d=[
                    "Track the formal freeze status with your bank and local cyber cell investigating officer.",
                    "Review your credit reports (CIBIL / Experian) to verify no unauthorized loan inquiries were initiated in your name.",
                    "Share details within RakshaAI Family Shield to inoculate family members against similar payment trap tactics."
                ]
            )

        elif "voice" in scenario or "audio" in scenario:
            return SolutionTimeline(
                now=[
                    "Immediately terminate the voice conversation. Do not agree to wire any money.",
                    "Dial your relative or colleague on their regular cell number (SIM to SIM) to verify their safety.",
                    "Save the voicemail, call recording, or incoming phone number to RakshaAI Evidence Locker."
                ],
                next_3h=[
                    "Check with other mutual family members or coworkers to see if they received similar distress calls.",
                    "Block the caller ID and report spam on your carrier and Truecaller/Whoscall."
                ],
                next_24h=[
                    "Establish a private, un-hackable 'Family Safe Word' that must be spoken before any urgent money transfer is ever considered.",
                    "Review social media accounts and make voice-containing reels/videos private to prevent further voice model scraping."
                ],
                next_7d=[
                    "Educate family elders on AI voice cloning and virtual kidnapping scams using RakshaAI Cyber Safety Academy.",
                    "Keep phone firmware updated to benefit from carrier-level spam and spoofing filters."
                ]
            )

        elif "link" in scenario or "url" in scenario or "emergency_link" in scenario:
            return SolutionTimeline(
                now=[
                    "Close the suspicious browser tab immediately. Do not interact further.",
                    "If you downloaded any file (.apk, .exe, .scr, .zip), DO NOT open it; delete it from Downloads immediately.",
                    "If passwords were typed on the fake portal, change that password immediately on the legitimate service via a clean browser."
                ],
                next_3h=[
                    "Clear browser history, cookies, and local storage cache.",
                    "Enable Multi-Factor Authentication (MFA) via Authenticator app (not SMS) on the affected accounts.",
                    "Run a malware scan using Microsoft Defender or trusted mobile security suite."
                ],
                next_24h=[
                    "Check active login sessions on your Google, Microsoft, and banking accounts and revoke any unknown devices.",
                    "Inspect email forwarding rules to ensure no silent copy rules were inserted by attackers."
                ],
                next_7d=[
                    "Bookmark official banking and government websites; never rely on search engine sponsored ads for login portals.",
                    "Monitor bank account statements for micro-debits or unauthorized mandate registrations."
                ]
            )

        else: # generic / social / message
            return SolutionTimeline(
                now=[
                    "Do not click links or reply to the message.",
                    "Take a complete screenshot showing the sender's handle, phone number, and timestamp.",
                    "Preserve the raw message text into RakshaAI Evidence Locker for SHA-256 fingerprinting."
                ],
                next_3h=[
                    "Report and block the account on the respective platform (WhatsApp/Instagram/Telegram).",
                    "Warn any mutual contacts if the scammer is impersonating someone in your network."
                ],
                next_24h=[
                    "Review privacy settings on the social media platform to hide your contact number and friend list from public viewing.",
                    "Enable two-step verification inside the messaging application."
                ],
                next_7d=[
                    "Review active sessions on the messaging app and terminate any unfamiliar desktop or web clients.",
                    "Consult RakshaAI Cyber Safety Academy to stay updated on emerging social engineering tactics."
                ]
            )

solution_engine = SolutionEngine()
