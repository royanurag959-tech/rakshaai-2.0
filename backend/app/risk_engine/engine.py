from typing import Tuple, Dict, Any

class RiskEngine:
    """
    Evaluates multi-signal inputs and computes normalized Risk & Confidence.
    Separates Risk (severity/threat level) from Confidence (model certainty).
    """

    @staticmethod
    def evaluate(score: float, signal_count: int, has_financial_urgency: bool = False) -> Tuple[str, float, str, float]:
        """
        Returns (risk_level, risk_score, confidence_level, confidence_score)
        """
        # Ensure clamped score 0-100
        score = max(0.0, min(100.0, float(score)))

        # Risk level determination
        if score >= 80 or (score >= 70 and has_financial_urgency):
            risk_level = "CRITICAL" if score >= 88 else "HIGH"
        elif score >= 50:
            risk_level = "MODERATE"
        else:
            risk_level = "LOW"

        # Confidence determination based on richness of signals and consistency
        if signal_count >= 4:
            conf_score = 92.0
            conf_level = "HIGH"
        elif signal_count >= 2:
            conf_score = 75.0
            conf_level = "MEDIUM"
        else:
            conf_score = 55.0
            conf_level = "LOW"

        return risk_level, round(score, 1), conf_level, round(conf_score, 1)

    @staticmethod
    def calculate_multimodal(audio_risk: float, visual_risk: float, temporal_risk: float, context_risk: float) -> Dict[str, Any]:
        """
        Combines multimodal signals: Audio + Visual + Temporal + Context
        """
        # Weighted combination: Visual (35%), Audio (25%), Temporal (20%), Context (20%)
        composite_score = (visual_risk * 0.35) + (audio_risk * 0.25) + (temporal_risk * 0.20) + (context_risk * 0.20)
        
        signals_detected = 0
        if audio_risk > 60: signals_detected += 1
        if visual_risk > 60: signals_detected += 1
        if temporal_risk > 60: signals_detected += 1
        if context_risk > 60: signals_detected += 1

        risk_level, score, conf_level, conf_score = RiskEngine.evaluate(composite_score, signals_detected)
        
        return {
            "risk_level": risk_level,
            "risk_score": score,
            "confidence": conf_level,
            "confidence_score": conf_score,
            "visual_risk": round(visual_risk, 1),
            "temporal_risk": round(temporal_risk, 1),
            "audio_risk": round(audio_risk, 1),
            "context_risk": round(context_risk, 1),
        }

risk_engine = RiskEngine()
