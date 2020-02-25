CREATE_BANNER_VALIDATION_RULES = {
    'texts': {
        'type': 'dict',
        'keyschema': {'regex': r'^\d+$'},
        'valueschema': {'type': 'string', 'required': True, 'empty': False, 'nullable': False,'maxlength': 50},
        'required': True,
        'nullable': False,
    },
    'image': {'required': True, 'nullable': False},
    'link': {'required': True, 'nullable': False, 'empty': False}
}
