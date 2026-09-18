from abc import ABC, abstractmethod
from typing import Dict, Any, List

class BaseAnalysisProvider(ABC):
    @abstractmethod
    def analyze(self, *args, **kwargs) -> Dict[str, Any]:
        """Core analysis method returning signals, raw scores, and explainability items"""
        pass
