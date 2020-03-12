from flask_mail import Message
from flask import current_app as app


class Mail:
    def __init__(self, flask_mail):
        self._flask_mail = flask_mail

    def send(self, subject, html, recipients):
        msg = Message(subject=subject,
                      sender=app.config['MAIL_USERNAME'],
                      recipients=recipients,
                      html=html)

        if app.config.get('DEBUG'):
            print({
                'subject': subject,
                'html': html,
                'recipients': recipients,
            })
        else:
            self._flask_mail.send(msg)
