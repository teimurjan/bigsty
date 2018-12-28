UPDATE_CATEGORY_VALIDATION_RULES = {
    'names': {
        'type': 'dict',
        'keyschema': {'regex': r'^\d+$'},
        'valueschema': {'type': 'string', 'required': True, 'empty': False, 'nullable': False},
        'required': True,
        'nullable': False,
    },
    "feature_types": {
        'type': 'list',
        'schema': {'type': 'integer', 'nullable': False},
        'required': True,
        'nullable': False,
    },
}
