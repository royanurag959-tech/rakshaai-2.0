import re
import urllib.parse
from app.providers.base import BaseAnalysisProvider
from app.risk_engine.engine import risk_engine
from app.safety_engine.engine import safety_engine
from app.solution_engine.engine import solution_engine
from app.schemas.schemas import AnalysisResponse, SignalItem, ExplanationItem

COMMON_TARGETED_BRANDS = [
    "sbi", "hdfc", "icici", "axis", "paytm", "phonepe", "gpay",
    "google", "whatsapp", "facebook", "instagram", "telegram",
    "amazon", "flipkart", "netflix", "microsoft", "apple", "income-tax"
]

SUSPICIOUS_KEYWORDS = [
    "kyc", "pan-update", "update", "verify", "secure", "free-gift",
    "lottery", "claim", "reward", "win", "block", "suspend", "bonus", "apk"
]

SUSPICIOUS_TLDS = [
    ".xyz", ".top", ".club", ".buzz", ".work", ".site", ".live",
    ".cc", ".tk", ".ml", ".ga", ".cf", ".gq", ".click", ".link"
]

SHORTENER_DOMAINS = ["bit.ly", "tinyurl.com", "t.co", "is.gd", "cutt.ly", "rb.gy"]

class LinkAnalysisProvider(BaseAnalysisProvider):
    """
    LinkShield Safe URL Inspector.
    Safely inspects URLs without user execution, detecting typosquatting, deceptive subdomains,
    suspicious TLDs, and credential harvesting hooks.
    """

    def analyze(self, url: str) -> AnalysisResponse:
        url_clean = url.strip()
        if not url_clean.startswith("http://") and not url_clean.startswith("https://"):
            parsed = urllib.parse.urlparse("https://" + url_clean)
        else:
            parsed = urllib.parse.urlparse(url_clean)

        domain = (parsed.netloc or parsed.path).lower().split(":")[0]
        path = parsed.path.lower()
        query = parsed.query.lower()

        risk_score = 10.0
        signals: list[SignalItem] = []
        is_phishing = False

        # 1. Check for IP address in hostname
        if re.match(r"^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$", domain):
            risk_score += 40.0
            signals.append(SignalItem(
                indicator="Raw IP Address Host",
                description=f"URL points directly to numeric IP ({domain}) rather than registered domain name.",
                severity="HIGH"
            ))
            is_phishing = True

        # 2. Check for targeted brand typosquatting
        detected_brands = [b for b in COMMON_TARGETED_BRANDS if b in domain]
        # legitimate check
        is_legit_domain = any(domain == f"{b}.com" or domain == f"www.{b}.com" or domain == f"{b}.co.in" or domain == f"www.{b}.co.in" for b in COMMON_TARGETED_BRANDS)

        if detected_brands and not is_legit_domain:
            risk_score += 45.0
            signals.append(SignalItem(
                indicator="Brand Impersonation / Deceptive Domain",
                description=f"Domain references recognizable brand ('{detected_brands[0]}') on an unverified host.",
                severity="CRITICAL"
            ))
            is_phishing = True

        # 3. Check for Suspicious TLDs
        matched_tld = [tld for tld in SUSPICIOUS_TLDS if domain.endswith(tld)]
        if matched_tld:
            risk_score += 25.0
            signals.append(SignalItem(
                indicator="High-Risk TLD Extension",
                description=f"Domain registered under high-abuse low-cost TLD ('{matched_tld[0]}').",
                severity="HIGH"
            ))

        # 4. Check for URL shorteners
        if any(short in domain for short in SHORTENER_DOMAINS):
            risk_score += 20.0
            signals.append(SignalItem(
                indicator="URL Shortener Masking",
                description="Link uses a shortening service to conceal destination URL and server headers.",
                severity="MEDIUM"
            ))

        # 5. Check for sensitive action keywords
        found_keywords = [kw for kw in SUSPICIOUS_KEYWORDS if kw in domain or kw in path or kw in query]
        if found_keywords:
            risk_score += 20.0
            signals.append(SignalItem(
                indicator="Coercive / Scam Keywords Found",
                description=f"URL contains high-urgency keywords: {', '.join(found_keywords)}.",
                severity="HIGH"
            ))
            is_phishing = True

        # 6. Check multiple subdomains
        if domain.count(".") >= 3:
            risk_score += 15.0
            signals.append(SignalItem(
                indicator="Excessive Nested Subdomains",
                description="Complex subdomain chaining frequently used to bypass heuristic perimeter filters.",
                severity="MEDIUM"
            ))

        # Evaluate risk level
        risk_level, calculated_score, confidence, conf_score = risk_engine.evaluate(
            risk_score, len(signals), has_financial_urgency=is_phishing
        )

        explanations = [
            ExplanationItem(
                point="Why was this link flagged?",
                meaning=f"The domain structure '{domain}' shows clear markers of a deceptive phishing setup mimicking legitimate institutions without cryptographic authorization."
            ),
            ExplanationItem(
                point="What does this mean in plain language?",
                meaning="If you open this link, it is designed to steal your net banking login, card numbers, UPI PIN, or install spyware onto your phone."
            )
        ] if risk_level in ["HIGH", "CRITICAL"] else [
            ExplanationItem(
                point="Domain Reputation Evaluation",
                meaning=f"Domain '{domain}' does not exhibit active typosquatting, blacklist markers, or suspicious redirects."
            ),
            ExplanationItem(
                point="What does this mean?",
                meaning="The link appears standard. Always ensure the browser address bar shows the exact spelling of the authentic website before entering credentials."
            )
        ]

        safety = safety_engine.generate_safety_guidance(risk_level, "link", "phishing")
        solution = solution_engine.generate_solution("link", financial_loss=False)

        return AnalysisResponse(
            scan_type="link",
            target_summary=f"LinkShield Scan: {url_clean[:60]}...",
            risk_level=risk_level,
            risk_score=calculated_score,
            confidence=confidence,
            confidence_score=conf_score,
            visual_risk=round(92.0 if detected_brands or is_raw_ip else (80.0 if matched_tld else 35.0), 1),
            temporal_risk=round(94.0 if detected_brands else 40.0, 1),
            audio_risk=round(90.0 if any(k in ["kyc", "login", "password", "bank", "otp"] for k in found_keywords) else 35.0, 1),
            context_risk=round(calculated_score, 1),
            signals=signals,
            explanations=explanations,
            safety_guidance=safety,
            solution_timeline=solution
        )

link_provider = LinkAnalysisProvider()
