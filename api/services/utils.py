def deep_serialize_query(q, exclude: list = list()):
  from json import loads
  serialized_query = {}
  for k, v in q:
    if v is None or k in exclude: continue
    try:
      serialized_query[k] = loads(v)
    except Exception:
      serialized_query[k] = v
  return serialized_query


def is_uniqueness_exception(e: Exception, field: str) -> bool:
  import re
  regex = r'DETAIL:\s\sKey\s\({0}\)=\((.*)\)\salready exists\.'.format(field)
  return re.search(regex, str(e)) is not None
