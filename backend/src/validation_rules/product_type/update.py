UPDATE_PRODUCT_TYPE_VALIDATION_RULES = {
    'names': {
        'type': 'dict',
        'keyschema': {'regex': r'^\d+$'},
        'valueschema': {'type': 'string', 'required': True, 'empty': False, 'nullable': False},
        'required': True,
        'nullable': False,
    },
    'descriptions': {
        'type': 'dict',
        'keyschema': {'regex': r'^\d+$'},
        'valueschema': {'type': 'string', 'required': True, 'empty': False, 'nullable': False},
        'required': True,
        'nullable': False,
    },
    'short_descriptions': {
        'type': 'dict',
        'keyschema': {'regex': r'^\d+$'},
        'valueschema': {'type': 'string', 'required': True, 'empty': False, 'nullable': False},
        'required': True,
        'nullable': False,
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
