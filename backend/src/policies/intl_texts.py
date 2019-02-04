class IntlTextsPolicy:
    def __init__(self, language_repo):
        self._language_repo = language_repo

    def are_valid(self, intl_texts):
        try:
            languages = self._language_repo.get_all()
            given_ids = [int(language_id) for language_id, _ in intl_texts.items()]
            expected_ids = [language.id for language in languages]
            return given_ids == expected_ids
        except ValueError:
            return False
