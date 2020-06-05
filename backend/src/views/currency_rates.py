from flask import current_app as app
import requests
import datetime
from xml.etree import ElementTree as ET


def get_float_from_node(key, node):
    return float(node.find(key).text.replace(',', '.'))


def get_currency_rates(date=None):
    rates = {}

    date_query = 'date_req=' + date if date else ''
    response = requests.get(
        f'http://www.cbr.ru/scripts/XML_daily.asp?{date_query}'
    )
    if response.status_code == 200:
        currencies = ET.fromstring(response.text).getchildren()
        for currency in currencies:
            if currency.find('CharCode').text == 'KGS':
                value = get_float_from_node('Value', currency)
                nominal = get_float_from_node('Nominal', currency)
                rates['RUB_KGS'] = value / nominal
            elif currency.find('CharCode').text == 'USD':
                value = get_float_from_node('Value', currency)
                nominal = get_float_from_node('Nominal', currency)
                rates['RUB_USD'] = value / nominal

        if rates.get('RUB_KGS') and rates.get('RUB_USD'):
            rates['KGS_USD'] = rates['RUB_USD'] / rates['RUB_KGS']

        return rates if len(rates) > 0 else None

    return None
