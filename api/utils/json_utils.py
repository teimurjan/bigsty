def parse_json_or_none(json_str):
  from json import loads
  try:
    return loads(json_str)
  except Exception:
    return None
