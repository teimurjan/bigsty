from threading import Thread
from typing import List

from django.core.mail import EmailMessage


class EmailService:
  def __init__(self, subject: str, body: str, to: List[str], content_subtype: str = 'html'):
    self.subject = subject
    self.to = to
    self.html_content = body
    self.content_subtype = content_subtype

  def send(self):
    msg = EmailMessage(self.subject, self.html_content, to=self.to)
    msg.content_subtype = self.content_subtype
    from main.settings import TESTING
    self.EmailThread(msg).start() if not TESTING else msg.send()

  class EmailThread(Thread):
    def __init__(self, msg: EmailMessage):
      self.msg = msg
      Thread.__init__(self)

    def run(self):
      self.msg.send()
