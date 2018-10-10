from json import loads


def parse_json_or_none(json_str):
    try:
        return loads(json_str)
    except Exception:
        return None
