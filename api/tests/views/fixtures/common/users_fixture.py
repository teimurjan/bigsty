from api.models import User, Group
from api.tests.views.fixtures.base.fixture import IFixture


class UsersFixture(IFixture):
  @staticmethod
  def make():
    group = lambda pk: Group.objects.get(pk=pk)
    User.objects.create(name='Admin', email='admin@user.com', is_active=True,
                        password=User.encrypt_password('Passw0rd'), group=group('admin'))
    User.objects.create(name='Manager', email='manager@user.com', is_active=True,
                        password=User.encrypt_password('Passw0rd'), group=group('manager'))
    User.objects.create(name='Reader', email='reader@user.com', is_active=True,
                        password=User.encrypt_password('Passw0rd'), group=group('reader'))
