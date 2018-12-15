CREATE_FEATURE_TYPE_VALIDATION_RULES = {
    'names': {
        'type': 'list',
        'schema': {
            'type': 'dict',
            'schema': {
                'language_id': {'type': 'integer', 'required': True,
                                'empty': False, 'nullable': False},
                'value': {
                    'type': 'string', 'required': True, 'empty': False, 'nullable': False
                }
            },
        },
        'required': True,
        'nullable': False,
        'minlength': 1,
    },
}
