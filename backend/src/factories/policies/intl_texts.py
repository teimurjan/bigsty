from src.repos.language import LanguageRepo
from src.policies.intl_texts import IntlTextsPolicy


class IntlTextsPolicyFactory:
    @staticmethod
    def create():
        language_repo = LanguageRepo()
        return IntlTextsPolicy(
            language_repo=language_repo
        )
