from abc import abstractmethod


class IFixture:
  @staticmethod
  @abstractmethod
  def make() -> None:
    raise NotImplementedError()
