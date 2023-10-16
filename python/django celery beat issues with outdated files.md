After a version update, you may see someting like this in logs for beat
```
celery beat v3.1.18 (Cipater) is starting.
__    -    ... __   -        _
Configuration ->
    . broker -> amqp://user:**@staging-api.user-app.com:5672//
    . loader -> celery.loaders.app.AppLoader
    . scheduler -> celery.beat.PersistentScheduler
    . db -> /tmp/beat.db
    . logfile -> [stderr]@%INFO
    . maxinterval -> now (0s)
[2015-09-25 17:29:24,453: INFO/MainProcess] beat: Starting...
[2015-09-25 17:29:24,457: CRITICAL/MainProcess] beat raised exception <class 'EOFError'>: EOFError('Ran out of input',)
Traceback (most recent call last):
  File "/home/user/staging/venv/lib/python3.4/site-packages/kombu/utils/__init__.py", line 320, in __get__
    return obj.__dict__[self.__name__]
KeyError: 'scheduler'

During handling of the above exception, another exception occurred:

Traceback (most recent call last):
  File "/usr/local/lib/python3.4/shelve.py", line 111, in __getitem__
    value = self.cache[key]
KeyError: 'entries'

During handling of the above exception, another exception occurred:

Traceback (most recent call last):
  File "/home/user/staging/venv/lib/python3.4/site-packages/celery/apps/beat.py", line 112, in start_scheduler
    beat.start()
  File "/home/user/staging/venv/lib/python3.4/site-packages/celery/beat.py", line 454, in start
    humanize_seconds(self.scheduler.max_interval))
  File "/home/user/staging/venv/lib/python3.4/site-packages/kombu/utils/__init__.py", line 322, in __get__
    value = obj.__dict__[self.__name__] = self.__get(obj)
  File "/home/user/staging/venv/lib/python3.4/site-packages/celery/beat.py", line 494, in scheduler
    return self.get_scheduler()
  File "/home/user/staging/venv/lib/python3.4/site-packages/celery/beat.py", line 489, in get_scheduler
    lazy=lazy)
  File "/home/user/staging/venv/lib/python3.4/site-packages/celery/utils/imports.py", line 53, in instantiate
    return symbol_by_name(name)(*args, **kwargs)
  File "/home/user/staging/venv/lib/python3.4/site-packages/celery/beat.py", line 358, in __init__
    Scheduler.__init__(self, *args, **kwargs)
  File "/home/user/staging/venv/lib/python3.4/site-packages/celery/beat.py", line 185, in __init__
    self.setup_schedule()
  File "/home/user/staging/venv/lib/python3.4/site-packages/celery/beat.py", line 377, in setup_schedule
    self._store['entries']
  File "/usr/local/lib/python3.4/shelve.py", line 114, in __getitem__
    value = Unpickler(f).load()
EOFError: Ran out of input
```
Solution is to remove outdated "celery-" files is project root
```bash
$ ls | grep celery
celerybeat-schedule.bak
celerybeat-schedule.dat
celerybeat-schedule.dir

rm celerybeat-schedule.bak
rm celerybeat-schedule.dat
rm celerybeat-schedule.dir
```
