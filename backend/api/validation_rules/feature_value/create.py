CREATE_FEATURE_VALUE_VALIDATION_RULES = {
    'names': {
        'type': 'list',
        'schema': {
            'language_id': {'type': 'integer', 'required': True,
                            'empty': False, 'nullable': False},
            'value': {
                'type': 'string', 'required': True, 'empty': False, 'nullable': False
            }
        },
        'required': True,
        'nullable': False,
        'minlength': 1,
    },
    'feature_type_id': {'type': 'integer', 'required': True, 'nullable': False},
}
