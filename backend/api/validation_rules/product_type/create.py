CREATE_PRODUCT_TYPE_VALIDATION_RULES = {
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
    'descriptions': {
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
    'short_descriptions': {
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
    'feature_values':  {
        'type': 'list',
        'schema': {'type': 'integer', 'nullable': False},
        'required': True,
        'nullable': False,
    },
    'category_id': {'required': True, 'type': 'integer'},
    'image': {'required': True, 'nullable': False}
}
