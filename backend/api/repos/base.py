class Repo:
    def __init__(self, model_cls):
        self.model_cls = model_cls

    def get_by_id(self, id_):
        return self._get_model_obj_by_id(id_).to_dto()

    def get_by_ids(self, ids, raise_err_on_invalid_id=False):
        models = tuple(self.filter_by(id__in=ids))
        if raise_err_on_invalid_id:
            if len(models) != len(ids):
                raise self.DoesNotExist()
        return models
            

    def _get_model_obj_by_id(self, id_):
        try:
            return self.model_cls.objects.get(id=id_)
        except self.model_cls.DoesNotExist:
            raise self.DoesNotExist()

    def _update(self, id_, **kwargs):
        try:
            model_obj = self.model_cls.objects.get(id=id_)
            if not isinstance(model_obj, self.model_cls):
                raise self.InvalidInstance()
            else:
                for attr, value in kwargs.items():
                    if not hasattr(model_obj, attr):
                        raise self.InvalidAttribute()
                    elif value is not None:
                        setattr(model_obj, attr, value)
                model_obj.save()
                return model_obj.to_dto()
        except self.model_cls.DoesNotExist:
            raise self.DoesNotExist()

    def _create(self, **kwargs):
        model_obj = self.model_cls()
        for attr, value in kwargs.items():
            if not hasattr(model_obj, attr):
                raise self.InvalidAttribute()
            elif value is not None:
                setattr(model_obj, attr, value)
        model_obj.save()
        return model_obj.to_dto()

    def get_all(self):
        return (obj.to_dto() for obj in self.model_cls.objects.all().order_by('pk'))

    def get_first_by(self, **kwargs):
        objects = self.model_cls.objects.filter(**kwargs)
        if not objects.exists():
            raise self.DoesNotExist()
        else:
            return objects[0].to_dto()

    def filter_by(self, **kwargs):
        return (obj.to_dto() for obj in self.model_cls.objects.filter(**kwargs).order_by('pk'))

    def delete(self, id_):
        try:
            self.model_cls.objects.get(id=id_).delete()
        except self.model_cls.DoesNotExist:
            raise self.DoesNotExist()

    class DoesNotExist(Exception):
        pass

    class InvalidInstance(Exception):
        pass

    class InvalidAttribute(Exception):
        pass