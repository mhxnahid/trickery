### Add CSRF_TRUSTED_ORIGINS along with the https scheme
```py
# config/settings.py
CSRF_TRUSTED_ORIGINS = os.getenv('CSRF_TRUSTED_ORIGINS', "https://test.com").split(',')
```
